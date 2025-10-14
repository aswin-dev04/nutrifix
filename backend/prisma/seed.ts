import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting seed...');

  // Clean existing data
  await prisma.order.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  console.log('  Cleaned existing data');

  // Create vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'FitMeals Chennai',
      email: 'fitmeals@example.com',
      passwordHash: 'dummy_hash_123', 
      address: 'Anna Nagar, Chennai',
      phone: '9876543210',
      isVerified: true,
    }
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      name: 'Protein Kitchen',
      email: 'protein@example.com',
      passwordHash: 'dummy_hash_456',
      address: 'T Nagar, Chennai',
      phone: '9876543211',
      isVerified: true,
    }
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      name: 'HealthHub Meals',
      email: 'healthhub@example.com',
      passwordHash: 'dummy_hash_789',
      address: 'Velachery, Chennai',
      phone: '9876543212',
      isVerified: true,
    }
  });

  console.log(' Created 3 vendors');

  // Create meals
  const mealsData = [
    // High Protein meals
    {
      vendorId: vendor1.id,
      name: 'Grilled Chicken Bowl',
      description: 'High protein grilled chicken with brown rice and steamed broccoli',
      protein: 45,
      carbs: 50,
      fats: 12,
      calories: 476,
      price: 180,
      cuisineType: 'Continental',
      preparationTime: 15,
    },
    {
      vendorId: vendor1.id,
      name: 'Egg White Omelette',
      description: 'Protein-packed egg white omelette with veggies',
      protein: 35,
      carbs: 20,
      fats: 8,
      calories: 284,
      price: 120,
      cuisineType: 'Continental',
      preparationTime: 10,
    },
    {
      vendorId: vendor2.id,
      name: 'Paneer Tikka Bowl',
      description: 'High protein paneer with quinoa and mixed veggies',
      protein: 30,
      carbs: 45,
      fats: 15,
      calories: 435,
      price: 150,
      cuisineType: 'Indian',
      preparationTime: 20,
    },
    {
      vendorId: vendor2.id,
      name: 'Chicken Biryani (Protein)',
      description: 'Lean chicken biryani with extra protein',
      protein: 40,
      carbs: 55,
      fats: 18,
      calories: 534,
      price: 200,
      cuisineType: 'Indian',
      preparationTime: 25,
    },
    {
      vendorId: vendor3.id,
      name: 'Salmon with Sweet Potato',
      description: 'Grilled salmon with roasted sweet potato',
      protein: 38,
      carbs: 42,
      fats: 20,
      calories: 500,
      price: 250,
      cuisineType: 'Continental',
      preparationTime: 20,
    },
    // Balanced meals
    {
      vendorId: vendor1.id,
      name: 'Greek Salad with Chicken',
      description: 'Fresh greek salad with grilled chicken',
      protein: 28,
      carbs: 25,
      fats: 12,
      calories: 316,
      price: 140,
      cuisineType: 'Mediterranean',
      preparationTime: 12,
    },
    {
      vendorId: vendor3.id,
      name: 'Turkey Sandwich',
      description: 'Whole wheat turkey sandwich with avocado',
      protein: 32,
      carbs: 38,
      fats: 14,
      calories: 402,
      price: 130,
      cuisineType: 'Continental',
      preparationTime: 8,
    },
    {
      vendorId: vendor2.id,
      name: 'Tofu Stir Fry',
      description: 'Crispy tofu with mixed vegetables and brown rice',
      protein: 25,
      carbs: 48,
      fats: 16,
      calories: 436,
      price: 160,
      cuisineType: 'Asian',
      preparationTime: 18,
    },
    // Lower calorie options
    {
      vendorId: vendor1.id,
      name: 'Grilled Fish Tacos',
      description: 'Light fish tacos with cabbage slaw',
      protein: 30,
      carbs: 35,
      fats: 10,
      calories: 340,
      price: 170,
      cuisineType: 'Mexican',
      preparationTime: 15,
    },
    {
      vendorId: vendor3.id,
      name: 'Chicken Soup Bowl',
      description: 'Protein-rich chicken soup with vegetables',
      protein: 28,
      carbs: 22,
      fats: 8,
      calories: 268,
      price: 110,
      cuisineType: 'Continental',
      preparationTime: 10,
    },
    // High carb options
    {
      vendorId: vendor2.id,
      name: 'Pasta with Chicken',
      description: 'Whole wheat pasta with grilled chicken',
      protein: 35,
      carbs: 65,
      fats: 14,
      calories: 518,
      price: 190,
      cuisineType: 'Italian',
      preparationTime: 20,
    },
    {
      vendorId: vendor1.id,
      name: 'Rice and Lentil Bowl',
      description: 'Brown rice with dal and vegetables',
      protein: 22,
      carbs: 58,
      fats: 10,
      calories: 410,
      price: 100,
      cuisineType: 'Indian',
      preparationTime: 15,
    },
    // Higher fat options
    {
      vendorId: vendor3.id,
      name: 'Beef Burger Bowl',
      description: 'Deconstructed burger with lean beef',
      protein: 42,
      carbs: 35,
      fats: 22,
      calories: 522,
      price: 220,
      cuisineType: 'American',
      preparationTime: 18,
    },
    {
      vendorId: vendor2.id,
      name: 'Peanut Butter Smoothie Bowl',
      description: 'High protein smoothie bowl with peanut butter',
      protein: 28,
      carbs: 45,
      fats: 20,
      calories: 480,
      price: 150,
      cuisineType: 'Continental',
      preparationTime: 5,
    },
    // Breakfast options
    {
      vendorId: vendor1.id,
      name: 'Protein Pancakes',
      description: 'High protein pancakes with berries',
      protein: 30,
      carbs: 40,
      fats: 10,
      calories: 370,
      price: 140,
      cuisineType: 'Continental',
      preparationTime: 12,
    },
  ];

  for (const mealData of mealsData) {
    await prisma.meal.create({ data: mealData });
  }

  console.log(' Created 15 meals');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'dummy_hash',
      age: 25,
      weight: 75,
      height: 180,
      activityLevel: 'moderate',
      goal: 'muscle_gain',
      targetProtein: 165,
      targetCarbs: 300,
      targetFats: 70,
    }
  });

  console.log(' Created test user');
  console.log('\n Seed completed successfully!\n');
  console.log('Summary:');
  console.log('   - 3 vendors');
  console.log('   - 15 meals');
  console.log('   - 1 test user');
}

main()
  .catch((e) => {
    console.error(' Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
