import db from '../db';

// Get available seats
export const getAvailableSeats = async (schedule_id: number, ticket_type: string) => {
  //console.log("Schedule_Id: ", schedule_id, " , ticket_type: ", ticket_type);
  const query = `CALL get_available_seats(?, ?)`;
  const [rows]: [any[], any] = await db.execute(query, [schedule_id, ticket_type]);
  return rows;
};

export const getMaxSeats = async (schedule_id: number, ticket_type: string) => {
  const query = `
    SELECT sc.number_of_seats 
    FROM schedule s 
    JOIN aircraft a ON s.aircraft_id = a.aircraft_id 
    JOIN seat_count sc ON sc.model = a.model 
    WHERE s.schedule_id = ? AND sc.seat_type = ?
  `
  const [rows]: [any[], any] = await db.execute(query, [schedule_id, ticket_type]);
  //console.log("Rows: ", rows[0]);
  return rows[0];
}

// Add a reservation
export const addReservation = async (schedule_id: number, seat_no: number) => {
  const query = `CALL add_reservation(?, ?)`;
  const [result] = await db.execute(query, [schedule_id, seat_no]);
  return result;
};

// Add a booking
export const addBooking = async (bookingData: any) => {
  let query;
  let params;

  if (bookingData.email) {
    // console.log("Inside registered booking");
    query = `CALL add_registered_booking(?, ?, ?)`;
    params = [
      bookingData.email ?? null,
      bookingData.schedule_id ?? null,
      bookingData.seat_no ?? null
    ];
  } 
  else {
    // console.log("Inside guest booking");
    query = `CALL add_guest_booking(?, ?, ?, ?, ?, ?, ?)`;
    params = [
      bookingData.full_name ?? null,
      bookingData.gender ?? null,
      bookingData.dob ?? null,
      bookingData.passport_number ?? null,
      bookingData.mobile_num ?? null,
      bookingData.schedule_id ?? null,
      bookingData.seat_no ?? null
    ];
  }

  const [result] = await db.execute(query, params);
  return result;
};

