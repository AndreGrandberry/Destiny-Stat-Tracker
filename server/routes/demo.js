import express from 'express';
import { getDemoMetrics } from '../controllers/demoController.js';

const router = express.Router();

router.get('/', getDemoMetrics);

export default router