import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const coursesRouter = Router();

coursesRouter.get('/courses/favorites', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const courses = await collect(client.courses.listFavorites());
    res.json(courses);
  } catch (err) { next(err); }
});

coursesRouter.get('/courses/:courseId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const course = await client.courses.get(String(req.params['courseId']));
    res.json(course);
  } catch (err) { next(err); }
});

coursesRouter.get('/courses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const courses = await collect(client.courses.list());
    res.json(courses);
  } catch (err) { next(err); }
});
