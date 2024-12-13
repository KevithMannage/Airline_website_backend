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
exports.getUserBookingsController = exports.registerUser = exports.loginUser = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    //   console.log("Inside get User");
    try {
        const user = yield (0, user_model_1.getUserByEmail)(email);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve user');
    }
});
exports.getUser = getUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //   console.log("inside login");
    console.log('Received request to /user/login');
    console.log('Request body:', req.body);
    if (!email || !password) {
        return res
            .status(400)
            .send('Missing required parameters: email and password');
    }
    try {
        const user = yield (0, user_model_1.getUserByEmailAndPassword)(email, password);
        console.log("user : ", user);
        if (user) {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not set');
            }
            const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, secret, { expiresIn: '1h' });
            res.json({ token, user });
        }
        else {
            res.status(401).send('Invalid email or password');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to log in');
    }
});
exports.loginUser = loginUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    try {
        const result = yield (0, user_model_1.createUser)(userData);
        res.status(201).json({ message: 'User added successfully', result });
    }
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Failed to add user', error });
    }
});
exports.registerUser = registerUser;
const getUserBookingsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const bookings = yield (0, user_model_1.getUserBookings)(email);
        res.json(bookings);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve user bookings');
    }
});
exports.getUserBookingsController = getUserBookingsController;
