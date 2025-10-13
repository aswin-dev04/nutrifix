import express from 'express';
import { suggestMacros, recommendMeals } from '../controllers/agentController';

const router = express.Router();

// Macro suggestion endpoint
router.post('/suggest-macros', suggestMacros);

// Meal recommendation endpoint
router.post('/recommend-meals', recommendMeals);

export default router;
