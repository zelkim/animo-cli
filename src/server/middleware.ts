import type { Request, Response, NextFunction } from 'express';

const ALLOWED_IPS = ['194.127.193.119'];

export function ipAllowlist(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/health' || req.path === '/openapi.json') {
    next();
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const raw = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
  // Normalize IPv6-mapped IPv4 (e.g. ::ffff:1.2.3.4 → 1.2.3.4)
  const ip = raw?.replace(/^::ffff:/, '') ?? '';

  if (!ALLOWED_IPS.includes(ip)) {
    console.warn(`Blocked request from ${ip} to ${req.method} ${req.path}`);
    res.status(403).json({ error: 'Forbidden', status: 403 });
    return;
  }

  next();
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
