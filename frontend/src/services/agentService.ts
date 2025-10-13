import api from './api';

interface MacroSuggestion {
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  reasoning: string;
  confidence: number;
  adjustments: string;
}

interface MealRecommendation {
  meals: any[];
  reasoning: string;
}

export const agentService = {
  async suggestMacros(userProfile: any): Promise<MacroSuggestion> {
    const response = await api.post('/agent/suggest-macros', userProfile);
    return response.data;
  },

  async recommendMeals(userProfile: any, context: any): Promise<MealRecommendation> {
    const response = await api.post('/agent/recommend-meals', { userProfile, context });
    return response.data;
  }
};
