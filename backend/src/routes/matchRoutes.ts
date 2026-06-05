import { Router } from 'express';
import { createMatchController } from '../controllers/matchController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { MatchService } from '../services/MatchService';

export const createMatchRoutes = (matchService: MatchService) => {
  const router = Router();
  const controller = createMatchController(matchService);

  // Public routes
  router.get('/', controller.getAllMatchs);
  router.get('/:id', controller.getMatchById);

  // Protected routes (STAFF/ADMIN)
  router.post('/', authenticate, authorize('STAFF', 'ADMIN'), controller.createMatch);
  router.put('/:id', authenticate, authorize('STAFF', 'ADMIN'), controller.updateMatch);
  router.put('/:id/composition', authenticate, authorize('STAFF', 'ADMIN'), controller.updateComposition);
  router.post('/:id/events', authenticate, authorize('STAFF', 'ADMIN'), controller.addMatchEvent);

  // Admin only
  router.delete('/:id', authenticate, authorize('ADMIN'), controller.deleteMatch);

  return router;
};
