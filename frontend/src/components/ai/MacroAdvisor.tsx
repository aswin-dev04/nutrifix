import React, { useState } from 'react';
import { agentService } from '../../services/agentService';

export const MacroAdvisor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleGetSuggestion = async (userProfile: any) => {
    setLoading(true);
    try {
      const result = await agentService.suggestMacros(userProfile);
      setSuggestion(result);
    } catch (error) {
      console.error('Failed to get macro suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="macro-advisor">
      {loading && <p>Getting AI recommendations...</p>}
      {suggestion && (
        <div>
          <h3>Recommended Macros</h3>
          <p>Protein: {suggestion.macros.protein}g</p>
          <p>Carbs: {suggestion.macros.carbs}g</p>
          <p>Fats: {suggestion.macros.fats}g</p>
          <p>Calories: {suggestion.macros.calories}</p>
          <p>{suggestion.reasoning}</p>
        </div>
      )}
    </div>
  );
};
