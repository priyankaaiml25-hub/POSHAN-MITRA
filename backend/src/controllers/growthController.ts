import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { calculateGrowthStatus, Gender } from '../utils/whoGrowthStandards.js';
import { z } from 'zod';

const measurementSchema = z.object({
  childId: z.string().uuid(),
  measurementDate: z.string().datetime(),
  weightKg: z.number().min(1).max(40),
  heightCm: z.number().min(40).max(130),
  reviewNotes: z.string().optional(),
});

export async function addMeasurement(req: Request, res: Response): Promise<void> {
  try {
    const parsed = measurementSchema.parse(req.body);

    const child = await prisma.child.findUnique({
      where: { id: parsed.childId },
    });

    if (!child) {
      res.status(404).json({ success: false, error: 'Child record not found' });
      return;
    }

    // Run validated WHO growth calculation engine
    const interpretation = calculateGrowthStatus({
      dateOfBirth: child.dateOfBirth,
      measurementDate: new Date(parsed.measurementDate),
      gender: child.gender as Gender,
      weightKg: parsed.weightKg,
      heightCm: parsed.heightCm,
    });

    const recordedByName = req.user?.name || 'Anganwadi Worker';

    const measurement = await prisma.growthMeasurement.create({
      data: {
        childId: child.id,
        measurementDate: new Date(parsed.measurementDate),
        weightKg: parsed.weightKg,
        heightCm: parsed.heightCm,
        waz: interpretation.waz,
        haz: interpretation.haz,
        whz: interpretation.whz,
        statusWaz: interpretation.statusWaz,
        statusHaz: interpretation.statusHaz,
        statusWhz: interpretation.statusWhz,
        needsReview: interpretation.needsReview,
        reviewNotes: parsed.reviewNotes || interpretation.reviewReason || null,
        recordedBy: recordedByName,
      },
    });

    // If review is needed, proactively create a follow-up task if none exists
    if (interpretation.needsReview) {
      const existingOpenTask = await prisma.followUpTask.findFirst({
        where: {
          childId: child.id,
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          category: 'GROWTH_MONITORING',
        },
      });

      if (!existingOpenTask) {
        await prisma.followUpTask.create({
          data: {
            childId: child.id,
            centreId: child.centreId,
            title: `Growth Review: ${interpretation.statusWhz !== 'NORMAL' ? interpretation.statusWhz : interpretation.statusWaz} for ${child.referenceId}`,
            description: `Auto-flagged by WHO screening: ${interpretation.reviewReason}. Coordinate counselling and supplementary nutrition.`,
            category: 'GROWTH_MONITORING',
            priority: interpretation.statusWhz === 'SEVERE_WASTING' || interpretation.statusWaz === 'SEVERE_UNDERWEIGHT' ? 'HIGH' : 'MEDIUM',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            assignedWorkerId: req.user?.userId || null,
          },
        });
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'ADD_MEASUREMENT',
        entityType: 'GROWTH_MEASUREMENT',
        entityId: measurement.id,
        details: `Recorded growth: Weight ${parsed.weightKg}kg, Height ${parsed.heightCm}cm. WAZ: ${interpretation.waz}, HAZ: ${interpretation.haz}, WHZ: ${interpretation.whz}`,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        measurement,
        interpretation,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Add measurement error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to record growth measurement' });
  }
}

export async function getMeasurementsForChild(req: Request, res: Response): Promise<void> {
  try {
    const childId = String(req.params.childId);

    const child = await prisma.child.findUnique({
      where: { id: childId },
    });

    if (!child) {
      res.status(404).json({ success: false, error: 'Child record not found' });
      return;
    }

    const measurements = await prisma.growthMeasurement.findMany({
      where: { childId },
      orderBy: { measurementDate: 'asc' },
    });

    res.json({
      success: true,
      data: {
        child: {
          id: child.id,
          referenceId: child.referenceId,
          dateOfBirth: child.dateOfBirth,
          gender: child.gender,
        },
        measurements,
      },
    });
  } catch (error) {
    console.error('Get measurements error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch measurements' });
  }
}
