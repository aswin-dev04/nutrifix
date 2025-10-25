import { Router } from 'express';
import { getAllMeals, searchMeals, getMealById } from '../controllers/mealController';

const router = Router();

router.get('/', getAllMeals);
router.get('/search', searchMeals);
router.get('/:id', getMealById);

export default router;