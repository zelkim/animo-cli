import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const assignmentsRouter = Router();

assignmentsRouter.get('/assignments/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const courses = await collect(client.courses.list());
    const all: unknown[] = [];
    for (const course of courses) {
      const c = course as { id: number };
      const assignments = await collect(client.assignments.list(String(c.id), { bucket: 'upcoming' }));
      all.push(...assignments);
    }
    res.json(all);
  } catch (err) { next(err); }
});

assignmentsRouter.get('/courses/:courseId/assignments/:assignmentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const assignment = await client.assignments.get(String(req.params['courseId']), String(req.params['assignmentId']));
    res.json(assignment);
  } catch (err) { next(err); }
});

assignmentsRouter.get('/courses/:courseId/assignments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const params: Record<string, string> = {};
    if (req.query['bucket']) params['bucket'] = req.query['bucket'] as string;
    if (req.query['search']) params['search_term'] = req.query['search'] as string;
    if (req.query['orderBy']) params['order_by'] = req.query['orderBy'] as string;
    const assignments = await collect(client.assignments.list(String(req.params['courseId']), params));
    res.json(assignments);
  } catch (err) { next(err); }
});
