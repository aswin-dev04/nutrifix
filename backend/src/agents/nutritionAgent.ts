import { MacroAdvisor } from './macroAdvisor';
import { MealRecommender } from './mealRecommender';

interface UserProfile {
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
  targetProtein?: number;
  targetCarbs?: number;
  targetFats?: number;
}

export class NutritionAgent {
  private macroAdvisor: MacroAdvisor;
  private mealRecommender: MealRecommender;

  constructor() {
    this.macroAdvisor = new MacroAdvisor();
    this.mealRecommender = new MealRecommender();
  }

  async suggestMacros(userProfile: UserProfile) {
    // Get AI-powered macro recommendation
    const aiSuggestion = await this.macroAdvisor.analyze(userProfile);
    
    return {
      macros: aiSuggestion.macros,
      reasoning: aiSuggestion.reasoning,
      confidence: aiSuggestion.confidence,
      adjustments: aiSuggestion.adjustments
    };
  }

  async recommendMeals(userProfile: UserProfile, context: any) {
    const recommendations = await this.mealRecommender.suggest({
      targetMacros: {
        protein: userProfile.targetProtein || 0,
        carbs: userProfile.targetCarbs || 0,
        fats: userProfile.targetFats || 0
      },
      context,
      preferences: []
    });
    
    return recommendations;
  }
}

export const nutritionAgent = new NutritionAgent();
