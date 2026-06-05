import { Router } from 'express';
import { getTopButeurs, getTopPasseurs, recalculateAllStats } from '../controllers/statsController';
import { apiResponseWrapper } from '../middleware/apiResponseWrapper';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/buteurs', apiResponseWrapper(getTopButeurs));
router.get('/passeurs', apiResponseWrapper(getTopPasseurs));

// Endpoint admin pour le rebuild total (idempotent)
router.post('/recalculate/:saison', authenticate, authorize('ADMIN'), apiResponseWrapper(recalculateAllStats));

export default router;
