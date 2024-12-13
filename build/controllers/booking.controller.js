"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = exports.createReservation = exports.getSeats = void 0;
const booking_model_1 = require("../models/booking.model");
const getSeats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { schedule_id, ticket_type } = req.query;
    if (!schedule_id || !ticket_type) {
        return res.status(400).json({ message: 'Missing required query parameters: schedule_id and ticket_type' });
    }
    try {
        const rows = yield (0, booking_model_1.getAvailableSeats)(Number(schedule_id), ticket_type);
        const seatMax = yield (0, booking_model_1.getMaxSeats)(Number(schedule_id), ticket_type);
        if (Array.isArray(rows) && Array.isArray(rows[0])) {
            const seatNumbers = rows[0]
                .map((row) => row.seat_no)
                .sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ''), 10);
                const numB = parseInt(b.replace(/\D/g, ''), 10);
                return numA - numB;
            });
            return res.status(200).json({
                seats: seatNumbers,
                maxSeats: seatMax.number_of_seats
            });
        }
        else {
            return res.status(500).json({ message: 'Unexpected result format from database.' });
        }
    }
    catch (error) {
        console.error('Error getting available seats:', error);
        return res.status(500).json({ message: 'Failed to get available seats', error: error.message });
    }
});
exports.getSeats = getSeats;
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { schedule_id, seat_no } = req.body;
    if (!schedule_id || !seat_no) {
        return res.status(400).json({ message: 'Missing required parameters in request body' });
    }
    try {
        const result = yield (0, booking_model_1.addReservation)(schedule_id, seat_no);
        res.status(201).json({ message: 'Reservation added successfully', result });
    }
    catch (error) {
        if (error.sqlState === '45000') {
            res.status(400).json({ message: 'Seat not available or already reserved' });
        }
        else {
            console.error('Error adding reservation:', error);
            res.status(500).json({ message: 'Failed to add reservation', error: error.message });
        }
    }
});
exports.createReservation = createReservation;
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = req.body;
    try {
        const result = yield (0, booking_model_1.addBooking)(bookingData);
        res.status(201).json({ message: 'Booking added successfully', result });
    }
    catch (error) {
        if (error.sqlState === '45000') {
            res.status(400).json({ message: 'Seat number is not reserved or user is not reserved.' });
        }
        else {
            console.error('Error adding booking:', error);
            res.status(500).json({ message: 'Failed to add booking', error: error.message });
        }
    }
});
exports.createBooking = createBooking;
