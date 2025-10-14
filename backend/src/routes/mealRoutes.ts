import express from 'express';
import prisma from '../config/database';

const router = express.Router();

// GET /api/meals - List all meals
router.get('/', async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      include: {
        vendor: {
          select: {
            name: true,
            address: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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
});

// GET /api/meals/search - Search by macros
router.get('/search', async (req, res) => {
  try {
    const { protein, carbs, fats, tolerance = '10' } = req.query;

    // Validate inputs
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

    // Calculate ranges
    const proteinMin = targetProtein * (1 - tolerancePercent / 100);
    const proteinMax = targetProtein * (1 + tolerancePercent / 100);
    const carbsMin = targetCarbs * (1 - tolerancePercent / 100);
    const carbsMax = targetCarbs * (1 + tolerancePercent / 100);
    const fatsMin = targetFats * (1 - tolerancePercent / 100);
    const fatsMax = targetFats * (1 + tolerancePercent / 100);

    const meals = await prisma.meal.findMany({
      where: {
        isAvailable: true,
        protein: { gte: proteinMin, lte: proteinMax },
        carbs: { gte: carbsMin, lte: carbsMax },
        fats: { gte: fatsMin, lte: fatsMax },
      },
      include: {
        vendor: {
          select: {
            name: true,
            address: true,
          }
        }
      }
    });

    // Calculate match scores
    const mealsWithScores = meals.map(meal => {
      const proteinDiff = Math.abs(meal.protein - targetProtein) / targetProtein;
      const carbsDiff = Math.abs(meal.carbs - targetCarbs) / targetCarbs;
      const fatsDiff = Math.abs(meal.fats - targetFats) / targetFats;
      
      const avgDiff = (proteinDiff + carbsDiff + fatsDiff) / 3;
      const matchScore = Math.round((1 - avgDiff) * 100);

      return {
        ...meal,
        matchScore
      };
    });

    // Sort by match score
    mealsWithScores.sort((a, b) => b.matchScore - a.matchScore);

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
});

// GET /api/meals/:id - Get single meal
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        vendor: true
      }
    });

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
});

export default router;
