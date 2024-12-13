import db from '../db';

export const getUserByEmail = async (email: string) => {
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

  const [rows]: [any[], any] = await db.query(query, [email]);

  return rows[0]; // Return the first row (since email is unique, there should only be one match)
};


export const getUserByEmailAndPassword = async (email: string, password: string) => {
  const [rows]: [any[], any] = await db.query(
    `    SELECT 
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
    WHERE email = ? AND password = ?`,
    [email, password]
  );
  console.log("user rows : ",rows)
  return rows[0];
};

export const createUser = async (userData: any) => {
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

  const [result] = await db.execute(query, values);
  return result;
};

export const getUserBookings = async (email: string) => {
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

  const [rows] = await db.query(query, [email]);

  return rows;
};
