import { Router } from 'express';
import { listFoods, getFoodById } from '../controllers/foodController.js';

const router = Router();

router.get('/', listFoods);
router.get('/:id', getFoodById);

export default router;

