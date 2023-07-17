require('dotenv').config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import { deviceRouter } from './src/routes/device.routes';
import { measurementRouter } from './src/routes/measurement.routes';
import { MqttSingleton } from './src/services/MqttSingleton';

const app = express();

app.use(cors());

app.use(express.json());

MqttSingleton.getInstance();

app.get('/', (req: Request, res: Response) => {
  res.json(
    {
      status: true,
      message: 'Welcome to the main endpoint of RAFT'
    }
  )
});

app.use('/devices', deviceRouter);
app.use('/measurements', measurementRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running in port ${PORT}`);
})
