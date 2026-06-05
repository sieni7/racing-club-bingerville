import { Router } from 'express';
import { getAllJoueurs, getJoueurById, createJoueur } from '../controllers/joueurController';
// import { validateRequest } from '../middleware/validation';
// import { JoueurSchema } from '../../../shared/schemas/joueur.schema';

const router = Router();

router.get('/', getAllJoueurs);
router.get('/:id', getJoueurById);
router.post('/', createJoueur);

export default router;
