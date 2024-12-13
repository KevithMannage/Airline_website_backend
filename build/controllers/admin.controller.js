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
exports.adminLogin = exports.report5 = exports.report4 = exports.report3 = exports.report2 = exports.report1 = exports.getFlightReport = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_model_1 = require("../models/admin.model");
const getFlightReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Request body:', req.body); // For debugging
    try {
        const flights = yield (0, admin_model_1.getAllFlights)();
        res.json(flights);
    }
    catch (err) {
        console.error('Error fetching flight reports:', err);
        res.status(500).send('An error occurred while retrieving flight reports');
    }
});
exports.getFlightReport = getFlightReport;
const report1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flightNumber = req.query.flightNumber;
        if (!flightNumber) {
            return res.status(400).json({
                success: false,
                message: "Flight number is required",
            });
        }
        const report = yield (0, admin_model_1.flightNumberAgeQuery)(flightNumber);
        console.log("report", report);
        res.status(200).json({
            success: true,
            message: "Report 1 generated successfully",
            data: report,
        });
    }
    catch (error) {
        console.error("Error generating report 1:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while generating report 1",
        });
    }
});
exports.report1 = report1;
const report2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract parameters from request query or body
        const { destinationCode, startDate, endDate } = req.query;
        if (!destinationCode || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide destinationCode, startDate, and endDate",
            });
        }
        // Call the model method to generate report2
        const report = yield (0, admin_model_1.passengerCountForDestinationQuery)(destinationCode, startDate, endDate);
        console.log("report", report);
        res.status(200).json({
            success: true,
            message: "Report 2 generated successfully",
            data: report,
        });
    }
    catch (error) {
        console.error("Error generating report 2:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while generating report 2",
        });
    }
});
exports.report2 = report2;
const report3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract start and end dates from request query parameters
        const { startDate, endDate } = req.query;
        // Validate parameters
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide both startDate and endDate",
            });
        }
        // Call the model method to get the bookings by tier
        const report = yield (0, admin_model_1.bookingsByTierQuery)(startDate, endDate);
        res.status(200).json({
            success: true,
            message: "Report 3 generated successfully",
            data: report,
        });
    }
    catch (error) {
        console.error("Error generating report 3:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while generating report 3",
        });
    }
});
exports.report3 = report3;
const report4 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract source and destination codes from request query parameters
        const { sourceCode, destinationCode } = req.query;
        // Validate parameters
        if (!sourceCode || !destinationCode) {
            return res.status(400).json({
                success: false,
                message: "Please provide both sourceCode and destinationCode",
            });
        }
        // Call the model method with source and destination
        const report = yield (0, admin_model_1.flightsFromSourceToDestinationQuery)(sourceCode, destinationCode);
        res.status(200).json({
            success: true,
            message: "Report 4 generated successfully",
            data: report,
        });
    }
    catch (error) {
        console.error("Error generating report 4:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while generating report 4",
        });
    }
});
exports.report4 = report4;
const report5 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Call the model method to get revenue by aircraft model
        const report = yield (0, admin_model_1.revenueByAircraftModelQuery)();
        res.status(200).json({
            success: true,
            message: "Report 5 generated successfully",
            data: report,
        });
    }
    catch (error) {
        console.error("Error generating report 5:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while generating report 5",
            error: error.message, // Include the error message for debugging
        });
    }
});
exports.report5 = report5;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log('Received request to /admin/adminlogin');
        console.log('Request body:', req.body);
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        // Call the model method to check for admin login
        const adminUser = yield (0, admin_model_1.adminLoginQuery)(email, password);
        console.log("admin : ", adminUser);
        if (adminUser) {
            const secret = process.env.JWT_SECRET; // Make sure your JWT_SECRET is set in the environment
            if (!secret) {
                throw new Error('JWT_SECRET is not set');
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ email: adminUser.email, role: adminUser.role }, // Include role if needed
            secret, { expiresIn: '1h' });
            res.status(200).json({
                success: true,
                message: "Login successful",
                token, // Include the token in the response
                data: {
                    first_name: adminUser.first_name,
                    last_name: adminUser.last_name,
                    email: adminUser.email,
                    role: adminUser.role,
                },
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
    }
    catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
            error: error.message, // Include the error message for debugging
        });
    }
});
exports.adminLogin = adminLogin;
