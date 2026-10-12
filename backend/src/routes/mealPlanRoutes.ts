import { Router } from 'express';
import { generateMealPlan } from '../controllers/mealPlanController.js';

const router = Router();

router.post('/generate', generateMealPlan);

export default router;

