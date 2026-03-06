import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const conversationsRouter = Router();

conversationsRouter.get('/conversations/:conversationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const conversation = await client.conversations.get(String(req.params['conversationId']));
    res.json(conversation);
  } catch (err) { next(err); }
});

conversationsRouter.post('/conversations/:conversationId/reply', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const { body } = req.body as { body?: string };
    if (!body) {
      res.status(400).json({ error: 'body is required', status: 400 });
      return;
    }
    const result = await client.conversations.addMessage(String(req.params['conversationId']), { body });
    res.status(201).json(result);
  } catch (err) { next(err); }
});

conversationsRouter.post('/conversations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const { recipients, body, subject, course } = req.body as {
      recipients?: string[];
      body?: string;
      subject?: string;
      course?: string;
    };
    if (!recipients || recipients.length === 0 || !body) {
      res.status(400).json({ error: 'recipients and body are required', status: 400 });
      return;
    }
    const params: Record<string, unknown> = { recipients, body };
    if (subject) params['subject'] = subject;
    if (course) params['contextCode'] = `course_${course}`;
    const conversation = await client.conversations.create(params as any);
    res.status(201).json(conversation);
  } catch (err) { next(err); }
});

conversationsRouter.get('/conversations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const params: Record<string, string> = {};
    if (req.query['scope']) params['scope'] = req.query['scope'] as string;
    const conversations = await collect(client.conversations.list(params));
    res.json(conversations);
  } catch (err) { next(err); }
});
