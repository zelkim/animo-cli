import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, type Column } from '../formatter.js';

const allCoursesColumns: Column[] = [
  { key: 'course_name', label: 'Course' },
  { key: 'current_score', label: 'Current Score' },
  { key: 'current_grade', label: 'Current Grade' },
  { key: 'final_score', label: 'Final Score' },
  { key: 'final_grade', label: 'Final Grade' },
];

const courseDetailColumns: Column[] = [
  { key: 'name', label: 'Assignment Group' },
  { key: 'group_weight', label: 'Weight' },
];

export function registerGrades(parent: Command, getClient: () => CanvasClient): void {
  const grades = parent.command('grades').description('View grades');

  grades
    .command('list [courseId]')
    .description('List grades for all courses or a specific course')
    .action(async (courseId?: string) => {
      const client = getClient();
      const opts = parent.opts();

      if (courseId) {
        // Per-course breakdown by assignment group
        const groups = await collect(
          client.assignments.listGroups(courseId, {
            include: ['assignments'],
            scopeAssignmentsToStudent: true,
          }),
        );
        const rows = (groups as unknown as Record<string, unknown>[]).map(g => ({
          name: g.name,
          group_weight: g.group_weight != null ? `${g.group_weight}%` : '-',
        }));
        output(rows, courseDetailColumns, { json: opts.json ? true : false, itemName: 'assignment groups' });
      } else {
        // All courses grade summary
        const enrollments = await collect(client.enrollments.listForUser('self'));
        const courses = await collect(client.courses.list());
        const courseMap = new Map(courses.map(c => [c.id, c.name]));
        const rows = (enrollments as unknown as Record<string, unknown>[]).map(e => {
          const grades = e.grades as Record<string, unknown> | undefined;
          return {
            course_name: courseMap.get(e.course_id as number) ?? e.course_id,
            current_score: grades?.current_score ?? '-',
            current_grade: grades?.current_grade ?? '-',
            final_score: grades?.final_score ?? '-',
            final_grade: grades?.final_grade ?? '-',
          };
        });
        output(rows, allCoursesColumns, { json: opts.json, itemName: 'grades' });
      }
    });
}
