import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';

const listColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'course_code', label: 'Code' },
  { key: 'term', label: 'Term' },
  { key: 'enrollment_term_id', label: 'Term ID' },
];

const detailColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'course_code', label: 'Course Code' },
  { key: 'start_at', label: 'Start' },
  { key: 'end_at', label: 'End' },
  { key: 'html_url', label: 'URL' },
];

export function registerCourses(parent: Command, getClient: () => CanvasClient): void {
  const courses = parent.command('courses').description('Manage courses');

  courses
    .command('list')
    .description('List enrolled courses')
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const items = await collect(client.courses.list(), opts.limit ? parseInt(opts.limit) : undefined);
      output(items as unknown as Record<string, unknown>[], listColumns, { json: opts.json, itemName: 'courses' });
    });

  courses
    .command('get <courseId>')
    .description('Get course details')
    .action(async (courseId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const course = await client.courses.get(courseId);
      outputDetail(course as unknown as Record<string, unknown>, detailColumns, { json: opts.json });
    });

  courses
    .command('favorites')
    .description('List favorite courses')
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const items = await collect(client.courses.listFavorites(), opts.limit ? parseInt(opts.limit) : undefined);
      output(items as unknown as Record<string, unknown>[], listColumns, { json: opts.json, itemName: 'favorite courses' });
    });
}
