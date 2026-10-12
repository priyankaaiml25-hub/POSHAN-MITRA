import { Router } from 'express';
import authRoutes from './authRoutes.js';
import childRoutes from './childRoutes.js';
import growthRoutes from './growthRoutes.js';
import taskRoutes from './taskRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import foodRoutes from './foodRoutes.js';
import mealPlanRoutes from './mealPlanRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/children', childRoutes);
router.use('/growth', growthRoutes);
router.use('/tasks', taskRoutes);
router.use('/lessons', lessonRoutes);
router.use('/foods', foodRoutes);
router.use('/meal-planner', mealPlanRoutes);
router.use('/reports', reportRoutes);

router.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    project: 'Poshan Mitra API',
    version: '1.0.0',
    mode: 'College Evaluation & Pilot Demo',
    timestamp: new Date().toISOString(),
  });
});

export default router;

