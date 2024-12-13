"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
router.get('/getSeats', booking_controller_1.getSeats);
router.post('/addReservation', booking_controller_1.createReservation);
router.post('/addBooking', booking_controller_1.createBooking);
exports.default = router;
