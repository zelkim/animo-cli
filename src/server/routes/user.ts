import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const userRouter = Router();

userRouter.get('/user/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const profile = await client.users.getProfile('self');
    res.json(profile);
  } catch (err) { next(err); }
});

userRouter.get('/user/todos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const todos = await collect(client.users.listTodoItems());
    res.json(todos);
  } catch (err) { next(err); }
});

userRouter.get('/user/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const events = await collect(client.users.listUpcomingEvents());
    res.json(events);
  } catch (err) { next(err); }
});
