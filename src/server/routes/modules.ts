import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const modulesRouter = Router();

modulesRouter.get('/courses/:courseId/modules/:moduleId/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const params: Record<string, string | string[]> = { include: ['content_details'] };
    if (req.query['search']) params['search_term'] = req.query['search'] as string;
    const items = await collect(client.modules.listItems(String(req.params['courseId']), String(req.params['moduleId']), params));
    res.json(items);
  } catch (err) { next(err); }
});

modulesRouter.get('/courses/:courseId/modules/:moduleId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const mod = await client.modules.get(String(req.params['courseId']), String(req.params['moduleId']), { include: ['items'] });
    res.json(mod);
  } catch (err) { next(err); }
});

modulesRouter.get('/courses/:courseId/modules', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const modules = await collect(client.modules.list(String(req.params['courseId'])));
    res.json(modules);
  } catch (err) { next(err); }
});
