import { Router } from 'express';
import {
  getScheduleByRouteAndDateRange,
  getSchedule,
} from '../controllers/schedule.controller';

const router = Router();

router.get('/flight/daterange', getScheduleByRouteAndDateRange);
router.get('/flight/:id', getSchedule);

export default router;
