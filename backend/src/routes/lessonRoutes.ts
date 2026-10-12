import { Router } from 'express';
import { listLessons, getLessonBySlug } from '../controllers/lessonController.js';

const router = Router();

router.get('/', listLessons);
router.get('/:slug', getLessonBySlug);

export default router;

