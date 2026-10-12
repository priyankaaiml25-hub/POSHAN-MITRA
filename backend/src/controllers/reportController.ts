import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export async function getCommunityImpactReport(_req: Request, res: Response): Promise<void> {
  try {
    const totalChildren = await prisma.child.count({ where: { active: true } });
    const totalMeasurements = await prisma.growthMeasurement.count();
    const reviewNeededMeasurements = await prisma.growthMeasurement.count({
      where: { needsReview: true },
    });

    const totalTasks = await prisma.followUpTask.count();
    const completedTasks = await prisma.followUpTask.count({
      where: { status: 'COMPLETED' },
    });
    const pendingTasks = await prisma.followUpTask.count({
      where: { status: 'PENDING' },
    });
    const inProgressTasks = await prisma.followUpTask.count({
      where: { status: 'IN_PROGRESS' },
    });

    const totalLessons = await prisma.nutritionLesson.count();
    const totalFoods = await prisma.foodItem.count();

    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Monthly activity mock/aggregation for chart
    const monthlyTrends = [
      { month: 'Jun', measurements: 14, followupsCompleted: 10, counsellingSessions: 18 },
      { month: 'Jul', measurements: 22, followupsCompleted: 17, counsellingSessions: 24 },
      { month: 'Aug', measurements: 28, followupsCompleted: 23, counsellingSessions: 30 },
      { month: 'Sep', measurements: 35, followupsCompleted: 31, counsellingSessions: 36 },
      { month: 'Oct', measurements: totalMeasurements || 42, followupsCompleted: completedTasks || 38, counsellingSessions: 45 },
    ];

    res.json({
      success: true,
      data: {
        centreSummary: {
          centreName: 'Kaveri Anganwadi Centre #14',
          district: 'Bengaluru Urban',
          state: 'Karnataka',
        },
        kpis: {
          enrolledChildren: totalChildren,
          totalMeasurementsRecorded: totalMeasurements,
          measurementsFlaggedForReview: reviewNeededMeasurements,
          reviewWorkloadPercentage: totalMeasurements > 0 ? Math.round((reviewNeededMeasurements / totalMeasurements) * 100) : 0,
          totalFollowUpTasks: totalTasks,
          completedFollowUps: completedTasks,
          pendingFollowUps: pendingTasks,
          inProgressFollowUps: inProgressTasks,
          followUpResolutionRate: taskCompletionRate,
          educationalModulesAvailable: totalLessons,
          localFoodsCatalogued: totalFoods,
        },
        monthlyTrends,
        disclaimer:
          'DEMONSTRATION NOTICE: All metrics represent simulated evaluation records designed for college project demonstration and pilot workflow verification. These figures do not represent verified longitudinal clinical trials or government health statistics.',
      },
    });
  } catch (error) {
    console.error('Impact report error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate community impact report' });
  }
}

export async function exportReportCsv(_req: Request, res: Response): Promise<void> {
  try {
    const totalChildren = await prisma.child.count({ where: { active: true } });
    const totalMeasurements = await prisma.growthMeasurement.count();
    const reviewNeeded = await prisma.growthMeasurement.count({ where: { needsReview: true } });
    const totalTasks = await prisma.followUpTask.count();
    const completedTasks = await prisma.followUpTask.count({ where: { status: 'COMPLETED' } });
    const resolutionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const csvRows = [
      'Category,Metric Name,Value,Unit,Note',
      `Enrollment,Active Enrolled Children,${totalChildren},Children,Pseudonymized records`,
      `Growth Monitoring,Total Measurements Logged,${totalMeasurements},Records,Validated against WHO 2006 reference`,
      `Growth Monitoring,Flagged For Anganwadi Review,${reviewNeeded},Records,WAZ/HAZ/WHZ below -2 SD`,
      `Welfare Follow-ups,Total Welfare Tasks,${totalTasks},Tasks,Scheduled Anganwadi workflows`,
      `Welfare Follow-ups,Completed Tasks,${completedTasks},Tasks,Resolved by field workers`,
      `Welfare Follow-ups,Task Resolution Rate,${resolutionRate},%,Target benchmark >= 80%`,
      `Compliance,Data Verification Status,Simulated Demo Dataset,Evaluation,"College project demonstration data"`,
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="poshan_mitra_community_impact_report.csv"');
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ success: false, error: 'Failed to export CSV report' });
  }
}

