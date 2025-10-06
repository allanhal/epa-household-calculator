import 'dotenv/config';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

import calculatorRoutes from './routes/calculatorRoutes.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (_: Request, res: Response) => res.redirect('/api'));
app.get('/api', (_: Request, res: Response) =>
  res.send('EPA Household Carbon Footprint Calculator API'),
);
app.use('/api', calculatorRoutes);

export default app;
