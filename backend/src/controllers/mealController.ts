import { Request, Response } from 'express';
import { getMealsService, searchMealsService, getMealByIdService } from '../services/mealMatcher';

export const getAllMeals = async (req: Request, res: Response) => {
  try {
    const meals = await getMealsService();
    
    res.json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meals'
    });
  }
};

export const searchMeals = async (req: Request, res: Response) => {
  try {
    const { protein, carbs, fats, tolerance = '10' } = req.query;

    if (!protein || !carbs || !fats) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: protein, carbs, fats'
      });
    }

    const targetProtein = Number(protein);
    const targetCarbs = Number(carbs);
    const targetFats = Number(fats);
    const tolerancePercent = Number(tolerance);

    const mealsWithScores = await searchMealsService({
      targetProtein,
      targetCarbs,
      targetFats,
      tolerancePercent
    });

    res.json({
      success: true,
      count: mealsWithScores.length,
      query: {
        protein: targetProtein,
        carbs: targetCarbs,
        fats: targetFats,
        tolerance: tolerancePercent
      },
      data: mealsWithScores
    });
  } catch (error) {
    console.error('Error searching meals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search meals'
    });
  }
};

export const getMealById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const meal = await getMealByIdService(id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        error: 'Meal not found'
      });
    }

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meal'
    });
  }
};