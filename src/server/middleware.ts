import type { Request, Response, NextFunction } from 'express';

export function authMiddleware(expectedToken: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.path === '/health' || req.path === '/openapi.json') {
      next();
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Missing authorization header', status: 401 });
      return;
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token !== expectedToken) {
      res.status(401).json({ error: 'Invalid token', status: 401 });
      return;
    }

    next();
  };
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    const apiErr = err as { status: number; message: string };
    res.status(apiErr.status).json({ error: apiErr.message, status: apiErr.status });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error', status: 500 });
}
