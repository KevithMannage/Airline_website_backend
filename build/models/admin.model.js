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
exports.adminLoginQuery = exports.revenueByAircraftModelQuery = exports.flightsFromSourceToDestinationQuery = exports.bookingsByTierQuery = exports.passengerCountForDestinationQuery = exports.flightNumberAgeQuery = exports.getAllFlights = void 0;
const db_1 = __importDefault(require("../db"));
const getAllFlights = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
  SELECT schedule_id, departure_time, arrival_time, flight_number
  FROM schedule
  WHERE departure_time > NOW();
  `;
    const [rows] = yield db_1.default.query(query);
    return rows;
});
exports.getAllFlights = getAllFlights;
const flightNumberAgeQuery = (flightNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adultQuery = `
      SELECT  passenger_details.full_name, passenger_details.gender, passenger_details.D_O_B, passenger_details.flight_count, passenger_details.tier
      FROM booking 
      LEFT JOIN passenger_details ON passenger_details.passenger_id = booking.passenger_id
      LEFT JOIN schedule ON schedule.schedule_id = booking.schedule_id
      WHERE schedule.flight_number = ? AND get_passenger_age(passenger_details.passenger_id) >= 18;
    `;
        const childQuery = `
      SELECT passenger_details.passenger_id, passenger_details.full_name, passenger_details.gender, passenger_details.D_O_B, passenger_details.passport_number, passenger_details.flight_count, passenger_details.tier
      FROM booking 
      LEFT JOIN passenger_details ON passenger_details.passenger_id = booking.passenger_id
      LEFT JOIN schedule ON schedule.schedule_id = booking.schedule_id
      WHERE schedule.flight_number = ? AND get_passenger_age(passenger_details.passenger_id) < 18;
    `;
        // Execute both queries in parallel
        const [adultResult, childResult] = yield Promise.all([
            db_1.default.query(adultQuery, [flightNumber]),
            db_1.default.query(childQuery, [flightNumber]),
        ]);
        // console.log("Adult Query: ", adultResult)
        // console.log("Child Query: ", childResult)
        return {
            flightNumber,
            adult: adultResult[0],
            child: childResult[0],
        };
    }
    catch (error) {
        console.error("Error in flightNumberAgeQuery:", error);
        throw error;
    }
});
exports.flightNumberAgeQuery = flightNumberAgeQuery;
const passengerCountForDestinationQuery = (destinationCode, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const passengerCountQuery = `
        SELECT COUNT(booking.passenger_id) AS no_of_passengers
        FROM booking 
        JOIN schedule ON booking.schedule_id = schedule.schedule_id 
        JOIN route ON schedule.route_id = route.route_id
        WHERE route.destination_code = ? 
        AND schedule.departure_time BETWEEN ? AND ?;
      `;
        // Execute the query with the provided parameters
        const [result] = yield db_1.default.query(passengerCountQuery, [
            destinationCode,
            startDate,
            endDate,
        ]);
        return {
            destinationCode,
            startDate,
            endDate,
            no_of_passengers: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.no_of_passengers) || 0,
        };
    }
    catch (error) {
        console.error("Error in passengerCountForDestinationQuery:", error);
        throw error;
    }
});
exports.passengerCountForDestinationQuery = passengerCountForDestinationQuery;
const bookingsByTierQuery = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tierBookingsQuery = `
        SELECT passenger_details.tier, COUNT(booking.booking_id) AS no_of_bookings
        FROM booking 
        JOIN passenger_details ON booking.passenger_id = passenger_details.passenger_id 
        JOIN schedule ON booking.schedule_id = schedule.schedule_id
        WHERE schedule.departure_time BETWEEN ? AND ?
        GROUP BY passenger_details.tier;
      `;
        // Execute the query with the date range as parameters
        const [result] = yield db_1.default.query(tierBookingsQuery, [startDate, endDate]);
        return result;
    }
    catch (error) {
        console.error("Error in bookingsByTierQuery:", error);
        throw error;
    }
});
exports.bookingsByTierQuery = bookingsByTierQuery;
const flightsFromSourceToDestinationQuery = (sourceCode, destinationCode) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("source code:", sourceCode);
    console.log("destination code:", destinationCode);
    try {
        const flightsQuery = `
        SELECT schedule.flight_number, schedule.status, COUNT(booking.passenger_id) AS passenger_count
        FROM schedule 
        JOIN route ON schedule.route_id = route.route_id
        LEFT JOIN booking ON schedule.schedule_id = booking.schedule_id
        WHERE route.source_code = ? AND route.destination_code = ? 
        AND schedule.departure_time < CURRENT_TIMESTAMP
        GROUP BY schedule.schedule_id
        ORDER BY schedule.departure_time DESC;
      `;
        // Execute the query with source and destination codes as parameters
        const [result] = yield db_1.default.query(flightsQuery, [
            sourceCode,
            destinationCode,
        ]);
        console.log("result: ", result);
        return result;
    }
    catch (error) {
        console.error("Error in flightsFromSourceToDestinationQuery:", error);
        throw error;
    }
});
exports.flightsFromSourceToDestinationQuery = flightsFromSourceToDestinationQuery;
const revenueByAircraftModelQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenueQuery = `
        SELECT aircraft.model AS aircraft_model, SUM(booking.ticket_price) AS total_revenue
        FROM booking 
        JOIN schedule ON booking.schedule_id = schedule.schedule_id
        JOIN aircraft ON schedule.aircraft_id = aircraft.aircraft_id
        GROUP BY aircraft.model;
      `;
        // Execute the query
        const [result] = yield db_1.default.query(revenueQuery);
        return result;
    }
    catch (error) {
        console.error("Error in revenueByAircraftModelQuery:", error);
        throw error;
    }
});
exports.revenueByAircraftModelQuery = revenueByAircraftModelQuery;
const adminLoginQuery = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginQuery = `
        SELECT first_name, last_name, email, role 
        FROM user 
        WHERE email = ? AND password = ? AND role = 'admin';
      `;
        // Execute the query with email and password as parameters
        const [result] = yield db_1.default.query(loginQuery, [email, password]);
        // Check if a user was found
        if (result.length > 0) {
            console.log("results :", result[0]);
            return result[0]; // Return the user data if login is successful
        }
        else {
            return null; // Return null if no matching admin user is found
        }
    }
    catch (error) {
        console.error("Error in adminLoginQuery:", error);
        throw error;
    }
});
exports.adminLoginQuery = adminLoginQuery;
