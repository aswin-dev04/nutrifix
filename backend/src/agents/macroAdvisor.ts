import { llmClient } from '../ai/llmClient';
import { MACRO_ADVISOR_PROMPT } from '../ai/prompts';

interface UserProfile {
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
}

export class MacroAdvisor {
  async analyze(userProfile: UserProfile) {
    const prompt = this.buildPrompt(userProfile);
    
    try {
      const response = await llmClient.chat({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: MACRO_ADVISOR_PROMPT },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });

      const recommendation = JSON.parse(response.content);
      
      return {
        macros: recommendation.macros,
        reasoning: recommendation.reasoning,
        confidence: recommendation.confidence,
        adjustments: recommendation.weekly_adjustments
      };
    } catch (error) {
      console.error('Macro Advisor Error:', error);
      throw new Error('Failed to generate macro suggestions');
    }
  }

  private buildPrompt(user: UserProfile): string {
    return `
User Profile:
- Age: ${user.age || 'Not specified'}
- Weight: ${user.weight || 'Not specified'}kg
- Height: ${user.height || 'Not specified'}cm
- Goal: ${user.goal || 'Not specified'}
- Activity Level: ${user.activityLevel || 'Not specified'}

Calculate optimal macro targets (protein/carbs/fats in grams and total calories).
Consider basal metabolic rate, activity multiplier, and goal-specific adjustments.
    `.trim();
  }
}
