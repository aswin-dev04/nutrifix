# Nutrifix AI Architecture

## Overview

The AI agent layer provides intelligent macro recommendations and meal suggestions using OpenAI's GPT models.

## Components

### Backend (`backend/src/agents/`)

- **nutritionAgent.ts** - Main orchestrator
- **macroAdvisor.ts** - Personalized macro calculations
- **mealRecommender.ts** - Context-aware meal suggestions
- **conversationHandler.ts** - Natural language interface

### AI Utilities (`backend/src/ai/`)

- **llmClient.ts** - OpenAI API wrapper
- **prompts.ts** - System prompts for different AI tasks
- **embeddings.ts** - Vector embeddings for meal similarity
- **models.ts** - Type definitions for AI responses

## API Endpoints

### POST /api/agent/suggest-macros
Generates personalized macro recommendations

**Request:**
```json
{
  "age": 25,
  "weight": 75,
  "height": 180,
  "activityLevel": "moderate",
  "goal": "muscle_gain"
}
```

**Response:**
```json
{
  "macros": {
    "protein": 165,
    "carbs": 300,
    "fats": 70,
    "calories": 2500
  },
  "reasoning": "For muscle gain at 75kg...",
  "confidence": 0.92,
  "adjustments": "Weekly adjustment strategy..."
}
```

### POST /api/agent/recommend-meals
Suggests meals based on remaining macros and context

## Environment Variables

Required in `backend/.env`:
```
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1000
```

## Cost Estimates

Using gpt-4o-mini:
- Macro suggestion: ~$0.001 per request
- Meal recommendation: ~$0.002 per request
- Total development/testing: ~$1-5

## Future Enhancements

1. User preference learning
2. Meal history analysis
3. Dietary restriction handling
4. Multi-day meal planning
5. Budget optimization
