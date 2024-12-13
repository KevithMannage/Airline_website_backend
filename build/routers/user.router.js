"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const router = (0, express_1.Router)();
router.get('/:email', authmiddleware_1.default, user_controller_1.getUser);
router.post('/login', user_controller_1.loginUser);
router.post('/register', user_controller_1.registerUser);
router.get('/user-bookings/:email', authmiddleware_1.default, user_controller_1.getUserBookingsController);
exports.default = router;
