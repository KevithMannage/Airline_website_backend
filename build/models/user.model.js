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
exports.getUserBookings = exports.createUser = exports.getUserByEmailAndPassword = exports.getUserByEmail = void 0;
const db_1 = __importDefault(require("../db"));
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT 
      u.passenger_id,
      u.first_name,
      u.last_name,
      u.email,
      u.password,
      u.role,
      p.full_name,
      p.gender,
      p.D_O_B as dob,
      p.passport_number,
      p.mobile_num,
      p.flight_count,
      p.tier
    FROM 
      user u
    JOIN 
      passenger_details p 
    ON 
      u.passenger_id = p.passenger_id
    WHERE 
      u.email = ?;
  `;
    const [rows] = yield db_1.default.query(query, [email]);
    return rows[0]; // Return the first row (since email is unique, there should only be one match)
});
exports.getUserByEmail = getUserByEmail;
const getUserByEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.query(`    SELECT 
      u.passenger_id,
      u.first_name,
      u.last_name,
      u.email,
      u.password,
      u.role,
      p.full_name,
      p.gender,
      p.D_O_B as dob,
      p.passport_number,
      p.mobile_num,
      p.flight_count,
      p.tier
    FROM 
      user u
    JOIN 
      passenger_details p 
    ON 
      u.passenger_id = p.passenger_id
    WHERE email = ? AND password = ?`, [email, password]);
    console.log("user rows : ", rows);
    return rows[0];
});
exports.getUserByEmailAndPassword = getUserByEmailAndPassword;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    CALL register_user(?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
    const values = [
        userData.first_name + ' ' + userData.last_name,
        userData.gender,
        userData.dob,
        userData.passport_number,
        userData.mobile_num,
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.password,
    ];
    const [result] = yield db_1.default.execute(query, values);
    return result;
});
exports.createUser = createUser;
const getUserBookings = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT 
      s.flight_number,
      r.source_code AS from_destination,
      r.destination_code AS to_destination,
      s.departure_time,
      s.arrival_time,
      r.duration,
      b.seat_no
    FROM 
      booking b
    JOIN 
      schedule s ON b.schedule_id = s.schedule_id
    JOIN 
      route r ON s.route_id = r.route_id
    JOIN 
      user u ON b.passenger_id = u.passenger_id
    WHERE 
      u.email = ?;
  `;
    const [rows] = yield db_1.default.query(query, [email]);
    return rows;
});
exports.getUserBookings = getUserBookings;
