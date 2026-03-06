import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const plannerRouter = Router();

plannerRouter.get('/planner/today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const today = new Date().toISOString().slice(0, 10);
    const items = await collect(client.planner.listItems({ startDate: today, endDate: today }));
    res.json(items);
  } catch (err) { next(err); }
});

plannerRouter.get('/planner/week', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const items = await collect(client.planner.listItems({
      startDate: monday.toISOString().slice(0, 10),
      endDate: sunday.toISOString().slice(0, 10),
    }));
    res.json(items);
  } catch (err) { next(err); }
});

plannerRouter.get('/planner', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const start = (req.query['start'] as string) || new Date().toISOString().slice(0, 10);
    const endDefault = new Date(new Date(start).getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const end = (req.query['end'] as string) || endDefault;
    const items = await collect(client.planner.listItems({ startDate: start, endDate: end }));
    res.json(items);
  } catch (err) { next(err); }
});
