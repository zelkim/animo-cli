import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../../collect.js';

export const gradesRouter = Router();

gradesRouter.get('/grades/:courseId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const groups = await collect(client.assignments.listGroups(String(req.params['courseId']), {
      include: ['assignments'],
      scopeAssignmentsToStudent: true,
    }));
    res.json(groups);
  } catch (err) { next(err); }
});

gradesRouter.get('/grades', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = req.app.locals['client'] as CanvasClient;
    const enrollments = await collect(client.enrollments.listForUser('self'));
    const courses = await collect(client.courses.list());
    const courseMap = new Map(courses.map((c: any) => [String(c.id), c.name]));
    const grades = enrollments
      .filter((e: any) => e.type === 'StudentEnrollment')
      .map((e: any) => ({
        courseId: e.course_id,
        courseName: courseMap.get(String(e.course_id)) ?? 'Unknown',
        currentScore: e.grades?.current_score ?? null,
        currentGrade: e.grades?.current_grade ?? null,
        finalScore: e.grades?.final_score ?? null,
      }));
    res.json(grades);
  } catch (err) { next(err); }
});
