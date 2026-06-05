import { Router } from 'express';
import {
  getActualites,
  getActualiteById,
  createActualite,
  updateActualite,
  deleteActualite
} from '../controllers/actualiteController';
import { apiResponseWrapper } from '../middleware/apiResponseWrapper';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', apiResponseWrapper(getActualites));
router.get('/:id', apiResponseWrapper(getActualiteById));

router.post('/', authenticate, authorize('STAFF', 'ADMIN'), apiResponseWrapper(createActualite));
router.put('/:id', authenticate, authorize('STAFF', 'ADMIN'), apiResponseWrapper(updateActualite));
router.delete('/:id', authenticate, authorize('ADMIN'), apiResponseWrapper(deleteActualite));

export default router;
