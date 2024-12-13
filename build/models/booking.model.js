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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBooking = exports.addReservation = exports.getMaxSeats = exports.getAvailableSeats = void 0;
const db_1 = __importDefault(require("../db"));
// Get available seats
const getAvailableSeats = (schedule_id, ticket_type) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("Schedule_Id: ", schedule_id, " , ticket_type: ", ticket_type);
    const query = `CALL get_available_seats(?, ?)`;
    const [rows] = yield db_1.default.execute(query, [schedule_id, ticket_type]);
    return rows;
});
exports.getAvailableSeats = getAvailableSeats;
const getMaxSeats = (schedule_id, ticket_type) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT sc.number_of_seats 
    FROM schedule s 
    JOIN aircraft a ON s.aircraft_id = a.aircraft_id 
    JOIN seat_count sc ON sc.model = a.model 
    WHERE s.schedule_id = ? AND sc.seat_type = ?
  `;
    const [rows] = yield db_1.default.execute(query, [schedule_id, ticket_type]);
    //console.log("Rows: ", rows[0]);
    return rows[0];
});
exports.getMaxSeats = getMaxSeats;
// Add a reservation
const addReservation = (schedule_id, seat_no) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `CALL add_reservation(?, ?)`;
    const [result] = yield db_1.default.execute(query, [schedule_id, seat_no]);
    return result;
});
exports.addReservation = addReservation;
// Add a booking
const addBooking = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    let query;
    let params;
    if (bookingData.email) {
        // console.log("Inside registered booking");
        query = `CALL add_registered_booking(?, ?, ?)`;
        params = [
            (_a = bookingData.email) !== null && _a !== void 0 ? _a : null,
            (_b = bookingData.schedule_id) !== null && _b !== void 0 ? _b : null,
            (_c = bookingData.seat_no) !== null && _c !== void 0 ? _c : null
        ];
    }
    else {
        // console.log("Inside guest booking");
        query = `CALL add_guest_booking(?, ?, ?, ?, ?, ?, ?)`;
        params = [
            (_d = bookingData.full_name) !== null && _d !== void 0 ? _d : null,
            (_e = bookingData.gender) !== null && _e !== void 0 ? _e : null,
            (_f = bookingData.dob) !== null && _f !== void 0 ? _f : null,
            (_g = bookingData.passport_number) !== null && _g !== void 0 ? _g : null,
            (_h = bookingData.mobile_num) !== null && _h !== void 0 ? _h : null,
            (_j = bookingData.schedule_id) !== null && _j !== void 0 ? _j : null,
            (_k = bookingData.seat_no) !== null && _k !== void 0 ? _k : null
        ];
    }
    const [result] = yield db_1.default.execute(query, params);
    return result;
});
exports.addBooking = addBooking;
