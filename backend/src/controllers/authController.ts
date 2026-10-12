import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { signToken } from '../middleware/auth.js';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { centre: true },
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'WORKER' | 'PARENT',
      name: user.name,
      centreId: user.centreId,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          centre: user.centre,
          language: user.language,
        },
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during authentication' });
  }
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        centre: true,
        phone: true,
        language: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User profile not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
}

export async function getDemoAccounts(_req: Request, res: Response): Promise<void> {
  // Safe helper endpoint for college evaluation & demo login buttons
  res.json({
    success: true,
    data: [
      {
        role: 'WORKER',
        name: 'Sunita Devi (Anganwadi Worker)',
        email: 'worker@poshanmitra.in',
        passwordHint: 'Poshan@123',
        description: 'Standard Anganwadi Worker profile with access to Growth Monitoring, Follow-ups, and Dashboard',
      },
      {
        role: 'ADMIN',
        name: 'Dr. Rajesh Kumar (CDPO District Officer)',
        email: 'admin@poshanmitra.in',
        passwordHint: 'Admin@123',
        description: 'District Child Development Project Officer with aggregate reporting and administrative oversight',
      },
      {
        role: 'PARENT',
        name: 'Lakshmi M (Caregiver / Mother)',
        email: 'parent@poshanmitra.in',
        passwordHint: 'Parent@123',
        description: 'Parent view with educational materials, healthy food guide, meal planner, and Poshan Play',
      },
    ],
  });
}
