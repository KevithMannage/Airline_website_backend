// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// JWT verification middleware
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded; // Attach the decoded token to the request
    // console.log(req.user);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).send("Invalid token");
  }

  // Proceed to the next middleware or route handler
  next();
};

export default verifyToken;
