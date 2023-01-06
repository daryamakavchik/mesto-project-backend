import { Router } from 'express';
import {
  getAllUsers,
  findUserById,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users:Id', findUserById);
router.get('/users/me', getUserInfo);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

export default router;
