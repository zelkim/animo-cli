import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    const apiErr = err as { status: number; message: string };
    res.status(apiErr.status).json({ error: apiErr.message, status: apiErr.status });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error', status: 500 });
}
