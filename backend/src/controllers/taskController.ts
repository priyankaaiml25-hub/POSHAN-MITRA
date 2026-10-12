import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';

const createTaskSchema = z.object({
  childId: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  category: z.enum([
    'NUTRITION_COUNSELLING',
    'GROWTH_MONITORING',
    'PARENT_EDUCATION',
    'ASHA_ANM_REFERRAL',
    'ADMIN_FOLLOWUP',
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().datetime(),
});

const updateTaskSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  completionNotes: z.string().optional(),
});

export async function listTasks(req: Request, res: Response): Promise<void> {
  try {
    const { status, priority, category, childId } = req.query;

    const whereClause: any = {};
    if (status) whereClause.status = String(status);
    if (priority) whereClause.priority = String(priority);
    if (category) whereClause.category = String(category);
    if (childId) whereClause.childId = String(childId);

    const tasks = await prisma.followUpTask.findMany({
      where: whereClause,
      include: {
        child: { select: { id: true, referenceId: true, gender: true } },
        assignedWorker: { select: { id: true, name: true, email: true } },
      },
      orderBy: [
        { status: 'asc' },
        { dueDate: 'asc' },
      ],
    });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error('List tasks error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve follow-up tasks' });
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const parsed = createTaskSchema.parse(req.body);

    let centreId = req.user?.centreId;
    if (!centreId) {
      const defaultCentre = await prisma.centre.findFirst();
      centreId = defaultCentre?.id;
    }

    if (!centreId) {
      res.status(400).json({ success: false, error: 'Centre ID is required' });
      return;
    }

    const task = await prisma.followUpTask.create({
      data: {
        title: parsed.title,
        description: parsed.description || null,
        category: parsed.category,
        priority: parsed.priority,
        dueDate: new Date(parsed.dueDate),
        childId: parsed.childId || null,
        centreId,
        assignedWorkerId: req.user?.userId || null,
        status: 'PENDING',
      },
      include: {
        child: { select: { id: true, referenceId: true } },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'CREATE_TASK',
        entityType: 'FOLLOW_UP_TASK',
        entityId: task.id,
        details: `Created task "${task.title}" with priority ${task.priority}`,
      },
    });

    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create task error:', error);
    res.status(500).json({ success: false, error: 'Failed to create follow-up task' });
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const parsed = updateTaskSchema.parse(req.body);

    const existing = await prisma.followUpTask.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    const isCompleting = parsed.status === 'COMPLETED' && existing.status !== 'COMPLETED';

    const updated = await prisma.followUpTask.update({
      where: { id },
      data: {
        status: parsed.status || existing.status,
        priority: parsed.priority || existing.priority,
        completionNotes: parsed.completionNotes !== undefined ? parsed.completionNotes : existing.completionNotes,
        completedAt: isCompleting ? new Date() : (parsed.status && parsed.status !== 'COMPLETED' ? null : existing.completedAt),
      },
      include: {
        child: { select: { id: true, referenceId: true } },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: isCompleting ? 'COMPLETE_TASK' : 'UPDATE_TASK',
        entityType: 'FOLLOW_UP_TASK',
        entityId: updated.id,
        details: `Updated task status to ${updated.status}`,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update task error:', error);
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const existing = await prisma.followUpTask.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    await prisma.followUpTask.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'DELETE_TASK',
        entityType: 'FOLLOW_UP_TASK',
        entityId: id,
        details: `Deleted task "${existing.title}"`,
      },
    });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
}
