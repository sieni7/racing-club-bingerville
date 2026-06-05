import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
// import { validateRequest } from '../middleware/validation';
// import { UserSchema } from '../../../shared/schemas/user.schema';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
// router.post('/', validateRequest(UserSchema), createUser);
router.post('/', authenticate, authorize('ADMIN'), createUser); // Secure user creation

export default router;
