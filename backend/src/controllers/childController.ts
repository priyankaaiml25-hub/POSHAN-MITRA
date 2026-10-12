import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';

const createChildSchema = z.object({
  referenceId: z.string().min(3).max(30),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['MALE', 'FEMALE']),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

export async function listChildren(req: Request, res: Response): Promise<void> {
  try {
    const { search, reviewOnly } = req.query;

    const whereClause: any = { active: true };
    if (search) {
      whereClause.referenceId = { contains: String(search) };
    }

    const children = await prisma.child.findMany({
      where: whereClause,
      include: {
        centre: { select: { id: true, name: true, code: true } },
        measurements: {
          orderBy: { measurementDate: 'desc' },
          take: 1,
        },
        tasks: {
          where: { status: { in: ['PENDING', 'IN_PROGRESS', 'OVERDUE'] } },
          select: { id: true, title: true, priority: true, status: true, dueDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Optionally filter children requiring review
    let result = children.map((c) => {
      const latestMeasurement = c.measurements[0] || null;
      return {
        id: c.id,
        referenceId: c.referenceId,
        dateOfBirth: c.dateOfBirth,
        gender: c.gender,
        guardianName: c.guardianName,
        centre: c.centre,
        latestMeasurement,
        openTasksCount: c.tasks.length,
        needsReview: latestMeasurement?.needsReview || false,
      };
    });

    if (reviewOnly === 'true') {
      result = result.filter((c) => c.needsReview);
    }

    res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    console.error('List children error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve child records' });
  }
}

export async function getChildById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);

    const child = await prisma.child.findUnique({
      where: { id },
      include: {
        centre: true,
        measurements: {
          orderBy: { measurementDate: 'asc' }, // Chronological for plotting trend
        },
        tasks: {
          orderBy: { dueDate: 'asc' },
          include: { assignedWorker: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!child) {
      res.status(404).json({ success: false, error: 'Child record not found' });
      return;
    }

    res.json({ success: true, data: child });
  } catch (error) {
    console.error('Get child error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve child details' });
  }
}

export async function createChild(req: Request, res: Response): Promise<void> {
  try {
    const parsed = createChildSchema.parse(req.body);

    // Ensure centre exists
    let centreId = req.user?.centreId;
    if (!centreId) {
      const defaultCentre = await prisma.centre.findFirst();
      centreId = defaultCentre?.id;
    }

    if (!centreId) {
      res.status(400).json({ success: false, error: 'No associated Anganwadi centre found' });
      return;
    }

    // Check for duplicate pseudonymous ID
    const existing = await prisma.child.findUnique({
      where: { referenceId: parsed.referenceId },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: `A record with Reference ID '${parsed.referenceId}' already exists. Please choose a unique ID.`,
      });
      return;
    }

    const child = await prisma.child.create({
      data: {
        referenceId: parsed.referenceId,
        dateOfBirth: new Date(parsed.dateOfBirth),
        gender: parsed.gender,
        guardianName: parsed.guardianName || null,
        guardianPhone: parsed.guardianPhone || null,
        centreId,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'CREATE_CHILD',
        entityType: 'CHILD',
        entityId: child.id,
        details: `Created child record with reference ${child.referenceId}`,
      },
    });

    res.status(201).json({ success: true, data: child });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create child error:', error);
    res.status(500).json({ success: false, error: 'Failed to create child record' });
  }
}
