import { Router } from 'express';
import { 
  getAllMatchs, 
  getMatchById, 
  createMatch, 
  updateMatch, 
  deleteMatch, 
  updateComposition, 
  addMatchEvent 
} from '../controllers/matchController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/', getAllMatchs);
router.get('/:id', getMatchById);

// Protected routes (STAFF/ADMIN)
router.post('/', authenticate, authorize('STAFF', 'ADMIN'), createMatch);
router.put('/:id', authenticate, authorize('STAFF', 'ADMIN'), updateMatch);
router.put('/:id/composition', authenticate, authorize('STAFF', 'ADMIN'), updateComposition);
router.post('/:id/events', authenticate, authorize('STAFF', 'ADMIN'), addMatchEvent);

// Admin only
router.delete('/:id', authenticate, authorize('ADMIN'), deleteMatch);

export default router;
