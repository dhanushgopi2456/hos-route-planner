import express, { Request, Response } from 'express';
import { apiRouter } from '../src/server/api';

const app = express();

app.use(express.json({ limit: '10mb' }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mount API router for both /api prefix and root level
app.use('/api', apiRouter);
app.use('/', apiRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'HOS Route Planner & ELD Log Generator (Vercel Serverless)' });
});

export default app;
