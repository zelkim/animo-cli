import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const announcementsRouter = Router();

announcementsRouter.get('/announcements/:notificationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const notification = await client.announcements.getAccountNotification('self', String(req.params['notificationId']));
    res.json(notification);
  } catch (err) { next(err); }
});

announcementsRouter.get('/announcements', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const courseFilter = req.query['course'] as string | undefined;
    let contextCodes: string[];
    if (courseFilter) {
      contextCodes = [`course_${courseFilter}`];
    } else {
      const courses = await collect(client.courses.list());
      contextCodes = courses.map((c: any) => `course_${c.id}`);
    }
    const announcements = await collect(client.announcements.list(contextCodes));
    res.json(announcements);
  } catch (err) { next(err); }
});
