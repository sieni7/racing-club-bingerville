import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../controllers/userController';
// import { validateRequest } from '../middleware/validation';
// import { UserSchema } from '../../../shared/schemas/user.schema';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
// router.post('/', validateRequest(UserSchema), createUser);
router.post('/', createUser); // Temporarily removing validation for simpler setup, will add later

export default router;
