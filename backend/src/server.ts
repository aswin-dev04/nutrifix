import express from 'express';
import dotenv from 'dotenv';
import mealRoutes from './routes/mealRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import agenetRoutes from './routes/agentRoutes';
import userRouter from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api/meals', mealRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/agents', agenetRoutes);
app.use('/api/users', userRouter);

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

// Start server
app.listen(port, () => {
  console.log(` NutriFix API running on http://localhost:${port}`);
  console.log(` Health check: http://localhost:${port}/health`);
  console.log(` Meals API: http://localhost:${port}/api/meals`);
});