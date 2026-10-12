import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export async function listLessons(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    const whereClause: any = {};
    if (category) whereClause.category = String(category);

    const lessons = await prisma.nutritionLesson.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' },
    });

    res.json({ success: true, count: lessons.length, data: lessons });
  } catch (error) {
    console.error('List lessons error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve nutrition lessons' });
  }
}

export async function getLessonBySlug(req: Request, res: Response): Promise<void> {
  try {
    const slug = String(req.params.slug);

    const lesson = await prisma.nutritionLesson.findUnique({
      where: { slug },
    });

    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lesson not found' });
      return;
    }

    let parsedContent = null;
    try {
      parsedContent = JSON.parse(lesson.contentJson);
    } catch {
      parsedContent = lesson.contentJson;
    }

    res.json({
      success: true,
      data: {
        ...lesson,
        content: parsedContent,
      },
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve lesson' });
  }
}
