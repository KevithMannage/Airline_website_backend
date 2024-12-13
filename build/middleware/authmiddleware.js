"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    //console.log(req); 
    // console.log("authheader: ", authHeader);
    if (!authHeader) {
        return res.status(403).send("A token is required for authentication");
    }
    const token = authHeader.split(" ")[1]; // Extract Bearer token from "Bearer <token>"
    if (!token) {
        return res.status(403).send("Token not provided");
    }
    try {
        // Verify the token and attach decoded data to req.user
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token to the request
        // console.log(req.user);
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).send("Invalid token");
    }
    // Proceed to the next middleware or route handler
    next();
};
exports.default = verifyToken;
