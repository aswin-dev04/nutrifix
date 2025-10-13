
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('NutriFix server is running!');
});

// TODO: Add your API routes here
// import authRoutes from './routes/authRoutes';
// app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
