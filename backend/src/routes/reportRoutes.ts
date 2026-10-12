import { Router } from 'express';
import { getCommunityImpactReport, exportReportCsv } from '../controllers/reportController.js';

const router = Router();

// Aggregate reports can be viewed publicly in demo mode or by workers/evaluators
router.get('/impact', getCommunityImpactReport);
router.get('/export-csv', exportReportCsv);

export default router;

