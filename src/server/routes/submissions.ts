import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const submissionsRouter = Router();

submissionsRouter.get('/courses/:courseId/assignments/:assignmentId/submissions/self', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const submission = await client.submissions.get(String(req.params['courseId']), String(req.params['assignmentId']), 'self');
    res.json(submission);
  } catch (err) { next(err); }
});

submissionsRouter.get('/courses/:courseId/assignments/:assignmentId/submissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const submissions = await collect(client.submissions.list(String(req.params['courseId']), String(req.params['assignmentId'])));
    res.json(submissions);
  } catch (err) { next(err); }
});

submissionsRouter.post('/courses/:courseId/assignments/:assignmentId/submissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const { submissionType, body, url } = req.body as { submissionType?: string; body?: string; url?: string };
    if (!submissionType) {
      res.status(400).json({ error: 'submissionType is required', status: 400 });
      return;
    }
    const submission = await client.submissions.create(String(req.params['courseId']), String(req.params['assignmentId']), {
      submissionType,
      body,
      url,
    });
    res.status(201).json(submission);
  } catch (err) { next(err); }
});
