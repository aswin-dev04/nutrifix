import { llmClient } from '../ai/llmClient';
import { MEAL_RECOMMENDER_PROMPT } from '../ai/prompts';
import prisma from '../config/database';

interface RecommendationParams {
  targetMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  context?: any;
  preferences?: string[];
}

export class MealRecommender {
  async suggest(params: RecommendationParams) {
    try {
      const availableMeals = await prisma.meal.findMany({
        include: { vendor: true }
      });

      const prompt = this.buildPrompt(params, availableMeals);

      const response = await llmClient.chat({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: MEAL_RECOMMENDER_PROMPT },
          { role: 'user', content: prompt }
        ]
      });

      const recommendations = JSON.parse(response.content);
      return recommendations;

    } catch (error) {
      console.error('Meal Recommender Error:', error);
      throw new Error('Failed to generate meal recommendations');
    }
  }

  private buildPrompt(params: RecommendationParams, meals: any[]): string {
    const mealsList = meals.map(m => 
      `${m.name}: P:${m.proteinGrams}g C:${m.carbsGrams}g F:${m.fatsGrams}g (₹${m.price})`
    ).join('\n');
  
    return `
  Target Macros:
  - Protein: ${params.targetMacros.protein}g
  - Carbs: ${params.targetMacros.carbs}g
  - Fats: ${params.targetMacros.fats}g
  
  Available Meals:
  ${mealsList}
  
  Recommend top 5 meals that best match the target macros.
  
  YOU MUST respond with valid JSON only. No markdown, no code blocks, no explanations.
  Format: { "recommendations": [{ "mealName": "...", "reasoning": "...", "macroMatch": "..." }] }
    `.trim();
  }
}