import { Router } from 'express';
import { addMeasurement, getMeasurementsForChild } from '../controllers/growthController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireRole(['WORKER', 'ADMIN']));

router.post('/measurements', addMeasurement);
router.get('/child/:childId', getMeasurementsForChild);

export default router;

