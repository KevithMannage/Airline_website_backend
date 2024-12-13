"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schedule_controller_1 = require("../controllers/schedule.controller");
const router = (0, express_1.Router)();
router.get('/flight/daterange', schedule_controller_1.getScheduleByRouteAndDateRange);
router.get('/flight/:id', schedule_controller_1.getSchedule);
exports.default = router;
