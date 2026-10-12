import { Router } from 'express';
import { listChildren, getChildById, createChild } from '../controllers/childController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireRole(['WORKER', 'ADMIN']));

router.get('/', listChildren);
router.get('/:id', getChildById);
router.post('/', createChild);

export default router;

