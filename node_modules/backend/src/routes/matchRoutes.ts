import { Router } from 'express';
import { getAllMatchs, getMatchById, createMatch } from '../controllers/matchController';
// import { validateRequest } from '../middleware/validation';
// import { MatchSchema } from '../../../shared/schemas/match.schema';

const router = Router();

router.get('/', getAllMatchs);
router.get('/:id', getMatchById);
router.post('/', createMatch);

export default router;
