import { Router } from 'express';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireRole(['WORKER', 'ADMIN']));

router.get('/', listTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;

