import 'dotenv/config';
import express from 'express';
import { resolveConfig } from '../config.js';
import { createClient } from '../client.js';
import { errorHandler } from './middleware.js';
import { openApiSpec } from './openapi.js';
import { coursesRouter } from './routes/courses.js';
import { assignmentsRouter } from './routes/assignments.js';
import { submissionsRouter } from './routes/submissions.js';
import { plannerRouter } from './routes/planner.js';
import { calendarRouter } from './routes/calendar.js';
import { gradesRouter } from './routes/grades.js';
import { modulesRouter } from './routes/modules.js';
import { announcementsRouter } from './routes/announcements.js';
import { conversationsRouter } from './routes/conversations.js';
import { userRouter } from './routes/user.js';

const config = resolveConfig({});
const client = createClient(config);

const app = express();
app.use(express.json());

app.locals['client'] = client;

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// OpenAPI spec
app.get('/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

// API routes
app.use('/api', coursesRouter);
app.use('/api', assignmentsRouter);
app.use('/api', submissionsRouter);
app.use('/api', plannerRouter);
app.use('/api', calendarRouter);
app.use('/api', gradesRouter);
app.use('/api', modulesRouter);
app.use('/api', announcementsRouter);
app.use('/api', conversationsRouter);
app.use('/api', userRouter);

// Error handler
app.use(errorHandler);

const port = parseInt(process.env['PORT'] ?? '3000', 10);
const host = process.env['HOST'] ?? '0.0.0.0';

app.listen(port, host, () => {
  console.log(`animo-serve listening on http://${host}:${port}`);
});
