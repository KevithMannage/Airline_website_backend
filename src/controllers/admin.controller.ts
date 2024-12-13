import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import {
  flightNumberAgeQuery,
  passengerCountForDestinationQuery,
  bookingsByTierQuery,
  flightsFromSourceToDestinationQuery,
  revenueByAircraftModelQuery,
  adminLoginQuery,
  getAllFlights,
} from "../models/admin.model";

export const getFlightReport = async (req: Request, res: Response) => {
  console.log('Request body:', req.body); // For debugging
  try {
    const flights = await getAllFlights();
    res.json(flights);
  } catch (err) {
    console.error('Error fetching flight reports:', err);
    res.status(500).send('An error occurred while retrieving flight reports');
  }
} 

export const report1 = async (req: Request, res: Response) => {
  try {
    const flightNumber = req.query.flightNumber as string;

    if (!flightNumber) {
      return res.status(400).json({
        success: false,
        message: "Flight number is required",
      });
    }

    const report = await flightNumberAgeQuery(flightNumber);

    console.log("report",report)
    res.status(200).json({
      success: true,
      message: "Report 1 generated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error generating report 1:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating report 1",
    });
  }
};

export const report2 = async (req: Request, res: Response) => {
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
    const report = await passengerCountForDestinationQuery(
      destinationCode,
      startDate,
      endDate
    );

    console.log("report",report)

    res.status(200).json({
      success: true,
      message: "Report 2 generated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error generating report 2:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating report 2",
    });
  }
};

export const report3 = async (req: Request, res: Response) => {
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
    const report = await bookingsByTierQuery(startDate, endDate);

    res.status(200).json({
      success: true,
      message: "Report 3 generated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error generating report 3:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating report 3",
    });
  }
};

export const report4 = async (req: Request, res: Response) => {
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
    const report = await flightsFromSourceToDestinationQuery(
      sourceCode,
      destinationCode
    );

    res.status(200).json({
      success: true,
      message: "Report 4 generated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error generating report 4:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating report 4",
    });
  }
};

export const report5 = async (req: Request, res: Response) => {
  try {
    // Call the model method to get revenue by aircraft model
    const report = await revenueByAircraftModelQuery();

    res.status(200).json({
      success: true,
      message: "Report 5 generated successfully",
      data: report,
    });
  } catch (error: any) {
    console.error("Error generating report 5:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating report 5",
      error: error.message, // Include the error message for debugging
    });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
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
    const adminUser = await adminLoginQuery(email, password);

    console.log("admin : ", adminUser)

    if (adminUser) {
      const secret = process.env.JWT_SECRET; // Make sure your JWT_SECRET is set in the environment
      if (!secret) {
        throw new Error('JWT_SECRET is not set');
      }

      // Generate JWT token
      const token = jwt.sign(
        { email: adminUser.email, role: adminUser.role }, // Include role if needed
        secret,
        { expiresIn: '1h' }
      );

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
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error: any) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message, // Include the error message for debugging
    });
  }
};
