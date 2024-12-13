import db from "../db";
import { RowDataPacket } from 'mysql2/promise';

export const getAllFlights = async (): Promise<RowDataPacket[]> => {
  const query = `
  SELECT schedule_id, departure_time, arrival_time, flight_number
  FROM schedule
  WHERE departure_time > NOW();
  `;
  const [rows] = await db.query<RowDataPacket[]>(query);
  return rows;
}

export const flightNumberAgeQuery = async (flightNumber: string) => {
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
    const [adultResult, childResult] = await Promise.all([
      db.query(adultQuery, [flightNumber]),
      db.query(childQuery, [flightNumber]),
    ]);

    // console.log("Adult Query: ", adultResult)
    // console.log("Child Query: ", childResult)

    return {
      flightNumber,
      adult: adultResult[0],
      child: childResult[0],
    };
  } catch (error) {
    console.error("Error in flightNumberAgeQuery:", error);
    throw error;
  }
};

export const passengerCountForDestinationQuery = async (
  destinationCode: any,
  startDate: any,
  endDate: any
) => {
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
    const [result]: [any[], any] = await db.query(passengerCountQuery, [
      destinationCode,
      startDate,
      endDate,
    ]);

    return {
      destinationCode,
      startDate,
      endDate,
      no_of_passengers: result[0]?.no_of_passengers || 0,
    };
  } catch (error) {
    console.error("Error in passengerCountForDestinationQuery:", error);
    throw error;
  }
};

export const bookingsByTierQuery = async (startDate: any, endDate: any) => {
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
    const [result] = await db.query(tierBookingsQuery, [startDate, endDate]);

    return result;
  } catch (error) {
    console.error("Error in bookingsByTierQuery:", error);
    throw error;
  }
};

export const flightsFromSourceToDestinationQuery = async (
  sourceCode: any,
  destinationCode: any
) => {
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
    const [result] = await db.query(flightsQuery, [
      sourceCode,
      destinationCode,
    ]);
    console.log("result: ", result);

    return result;
  } catch (error) {
    console.error("Error in flightsFromSourceToDestinationQuery:", error);
    throw error;
  }
};

export const revenueByAircraftModelQuery = async () => {
    try {
      const revenueQuery = `
        SELECT aircraft.model AS aircraft_model, SUM(booking.ticket_price) AS total_revenue
        FROM booking 
        JOIN schedule ON booking.schedule_id = schedule.schedule_id
        JOIN aircraft ON schedule.aircraft_id = aircraft.aircraft_id
        GROUP BY aircraft.model;
      `;
  
      // Execute the query
      const [result] = await db.query(revenueQuery);
  
      return result;
    } catch (error) {
      console.error("Error in revenueByAircraftModelQuery:", error);
      throw error;
    }
  };

  export const adminLoginQuery = async (email: any, password: any) => {
    try {
      const loginQuery = `
        SELECT first_name, last_name, email, role 
        FROM user 
        WHERE email = ? AND password = ? AND role = 'admin';
      `;
  
      // Execute the query with email and password as parameters
      const [result]: [any[], any] = await db.query(loginQuery, [email, password]);
  
      // Check if a user was found
      if (result.length > 0) {
        console.log("results :",result[0])
        return result[0]; // Return the user data if login is successful
      } else {
        return null; // Return null if no matching admin user is found
      }
    } catch (error) {
      console.error("Error in adminLoginQuery:", error);
      throw error;
    }
  };
  

  
