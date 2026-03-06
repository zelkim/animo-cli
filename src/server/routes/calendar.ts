import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const calendarRouter = Router();

calendarRouter.get('/calendar/:eventId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const event = await client.calendar.get(String(req.params['eventId']));
    res.json(event);
  } catch (err) { next(err); }
});

calendarRouter.get('/calendar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const start = (req.query['start'] as string) || new Date().toISOString().slice(0, 10);
    const endDefault = new Date(new Date(start).getTime() + 14 * 86400000).toISOString().slice(0, 10);
    const end = (req.query['end'] as string) || endDefault;
    const params: Record<string, string | string[]> = { start_date: start, end_date: end };
    if (req.query['type']) params['type'] = req.query['type'] as string;
    if (req.query['context']) {
      const ctx = req.query['context'];
      params['context_codes'] = Array.isArray(ctx) ? ctx as string[] : [ctx as string];
    }
    const events = await collect(client.calendar.listEvents(params));
    res.json(events);
  } catch (err) { next(err); }
});
