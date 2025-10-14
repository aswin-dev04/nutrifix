import express from 'express';
import dotenv from 'dotenv';
import mealRoutes from './routes/mealRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'NutriFix API is running!',
    version: '1.0.0',
    endpoints: {
      meals: '/api/meals',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/meals', mealRoutes);

// Start server
app.listen(port, () => {
  console.log(` NutriFix API running on http://localhost:${port}`);
  console.log(` Health check: http://localhost:${port}/health`);
  console.log(` Meals API: http://localhost:${port}/api/meals`);
});