import prisma from '../config/database';

export const getMealsService = async () => {
  return await prisma.meal.findMany({
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
};

interface SearchParams {
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  tolerancePercent: number;
}

export const searchMealsService = async (params: SearchParams) => {
  const { targetProtein, targetCarbs, targetFats, tolerancePercent } = params;

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

  return mealsWithScores;
};

export const getMealByIdService = async (id: string) => {
  return await prisma.meal.findUnique({
    where: { id },
    include: {
      vendor: true
    }
  });
};