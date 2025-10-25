import express from 'express';
import auth from '../middleware/auth';
import { suggestMacros, recommendMeals } from '../controllers/agentController';

const router = express.Router();

router.post('/suggest-macros', auth, suggestMacros);

router.post('/recommend-meals', auth, recommendMeals);

export default router;
