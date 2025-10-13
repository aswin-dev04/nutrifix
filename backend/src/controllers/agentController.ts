import { Request, Response } from 'express';
import { nutritionAgent } from '../agents/nutritionAgent';

export const suggestMacros = async (req: Request, res: Response) => {
  try {
    const userProfile = req.body;
    
    const suggestion = await nutritionAgent.suggestMacros(userProfile);
    
    res.json(suggestion);
  } catch (error) {
    console.error('Suggest Macros Error:', error);
    res.status(500).json({ error: 'Failed to generate macro suggestions' });
  }
};

export const recommendMeals = async (req: Request, res: Response) => {
  try {
    const { userProfile, context } = req.body;
    
    const recommendations = await nutritionAgent.recommendMeals(userProfile, context);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Recommend Meals Error:', error);
    res.status(500).json({ error: 'Failed to recommend meals' });
  }
};
