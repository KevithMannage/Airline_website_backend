import { Router } from 'express';
import {
  getSeats,
  createReservation,
  createBooking,
} from '../controllers/booking.controller';

const router = Router();

router.get('/getSeats', getSeats);
router.post('/addReservation', createReservation);
router.post('/addBooking', createBooking);

export default router;
 