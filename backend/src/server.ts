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
import { createMatchRoutes } from './routes/matchRoutes';
import statsRoutes from './routes/statsRoutes';
import actualiteRoutes from './routes/actualiteRoutes';

import { DomainEventBus } from './events/DomainEventBus';
import { MATCH_COMPLETED, MATCH_EVENT_ADDED } from './events/registry';
import { StatsListener } from './listeners/StatsListener';
import { statsService } from './services/StatsService';
import { MatchService } from './services/MatchService';
import { matchRepository } from './repositories/MatchRepository';

dotenv.config();

export const createApp = (eventBus: DomainEventBus) => {
  const app = express();

  // Initialize Services & Listeners
  const statsListener = new StatsListener(statsService);
  eventBus.register(MATCH_COMPLETED, statsListener.onMatchCompleted);
  eventBus.register(MATCH_EVENT_ADDED, statsListener.onMatchEventAdded);
  eventBus.register('STATS_RECALCULATION_REQUESTED', statsListener.onStatsRecalculationRequested);

  const matchService = new MatchService(matchRepository, eventBus);

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
  app.use('/api/matchs', createMatchRoutes(matchService));
  app.use('/api/stats', statsRoutes);
  app.use('/api/actualites', actualiteRoutes);

  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Backend is healthy' });
  });

  return app;
};

// Application entry point
export const eventBus = new DomainEventBus();
export const app = createApp(eventBus);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  // Connect to database
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}
