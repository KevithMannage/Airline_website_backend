import db from '../db';


// Get future schedule by route and date range
export const getFutureScheduleByRouteAndDateRange = async (
  start: string,
  end: string,
  from: string,
  to: string
) => {
  const query = 'CALL get_future_schedule_by_route_and_date_range(?, ?, ?, ?)';
  const [rows]: [any[], any] = await db.query(query, [start, end, from, to]);
  return rows;
};

// Get schedule by ID
export const getScheduleById = async (id: number) => {
  const [rows]: [any[], any] = await db.query(
    'SELECT * FROM schedule s JOIN route r ON s.route_id = r.route_id WHERE schedule_id = ?',
    [id]
  );
  return rows[0];
};
