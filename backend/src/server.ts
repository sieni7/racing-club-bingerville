import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { apiLimiter } from './middleware/rateLimit';
import { apiResponseWrapper } from './middleware/apiResponseWrapper';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import joueurRoutes from './routes/joueurRoutes';
import matchRoutes from './routes/matchRoutes';

dotenv.config();

export const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(apiResponseWrapper);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/joueurs', joueurRoutes);
app.use('/api/matchs', matchRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is healthy' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  // Connect to database
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}
