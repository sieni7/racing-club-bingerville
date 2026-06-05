import { Router } from 'express';
import { getAllJoueurs, getJoueurById, createJoueur, updateJoueur, deleteJoueur } from '../controllers/joueurController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getAllJoueurs);
router.get('/:id', getJoueurById);

router.post('/', authenticate, authorize('STAFF', 'ADMIN'), createJoueur);
router.put('/:id', authenticate, authorize('STAFF', 'ADMIN'), updateJoueur);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteJoueur);

export default router;
