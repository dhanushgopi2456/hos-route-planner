import express, { Request, Response } from 'express';
import { apiRouter } from './api';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Permissive CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Driver-User, X-Driver-Profile');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Normalize request URL for Vercel serverless rewrites
app.use((req, res, next) => {
  // If Vercel rewrote URL through /api/index, normalize path
  const matchedPath = req.headers['x-matched-path'] as string;
  if (matchedPath && matchedPath.startsWith('/api/')) {
    req.url = matchedPath;
  } else if (req.url.startsWith('/api/index')) {
    req.url = req.url.replace('/api/index', '/api') || '/api';
  } else if (req.url.startsWith('/index')) {
    req.url = req.url.replace('/index', '/api') || '/api';
  }
  next();
});

// Health check endpoints
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'HOS Route Planner & ELD Log Generator (Vercel Serverless)',
    timestamp: new Date().toISOString()
  });
});

// Mount API router for both /api prefix and root-level routes
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Fallback 404 handler (always return JSON)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl || req.url}`,
    status: 404
  });
});

// Global error handler ensuring JSON response on any unexpected error
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[Vercel Serverless Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Vercel Serverless function handler with Express delegation
export default function handler(req: any, res: any) {
  return app(req, res);
}

// Preserve Express app methods for runtimes that treat default export as app
Object.assign(handler, app);

export { app };
