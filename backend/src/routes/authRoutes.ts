import { Router } from 'express';
import { login, getCurrentUser, getDemoAccounts } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.get('/demo-accounts', getDemoAccounts);

export default router;

