import { Router } from 'express';
import {
  getAllUsers,
  findUserById,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users:Id', findUserById);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

export default router;
