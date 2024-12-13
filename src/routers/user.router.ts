import { Router } from 'express';
import {
  getUser,
  loginUser,
  registerUser,
  getUserBookingsController,
} from '../controllers/user.controller';

import verifyToken from '../middleware/authmiddleware';

const router = Router();

router.get('/email/:email',  getUser);
router.get('/:email', verifyToken, getUser);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/user-bookings/:email', verifyToken,  getUserBookingsController);

export default router;
