import express from 'express';
import connection from './db';
import userRouter from './routers/user.router';
import scheduleRouter from './routers/schedule.router';
import bookingRouter from './routers/booking.router';
import adminRouter from './routers/admin.router'
import cors from 'cors';
import {config} from './config/config';

const app = express();


app.use(cors({ origin: '*' }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);
app.use("/booking", bookingRouter);
app.use("/admin", adminRouter);

app.get('/test', async (req, res) => {
  try {
    const [rows, fields] = await connection.query('CALL AddReservation(1, "Economy", 2)');
    console.log("ROws", rows);
    console.log("Fields", fields);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database query failed');
  }
});

app.listen(config.server.port, () => {
  console.log(`Server is running on porttt ${config.server.port} on herokuuu`);
});
