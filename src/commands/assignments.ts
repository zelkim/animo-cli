import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';

const listColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'due_at', label: 'Due Date' },
  { key: 'points_possible', label: 'Points' },
  { key: 'submission_types', label: 'Submission Types' },
];

const detailColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'due_at', label: 'Due Date' },
  { key: 'points_possible', label: 'Points' },
  { key: 'submission_types', label: 'Submission Types' },
  { key: 'html_url', label: 'URL' },
];

const upcomingColumns: Column[] = [
  { key: 'course_name', label: 'Course' },
  { key: 'name', label: 'Name' },
  { key: 'due_at', label: 'Due Date' },
  { key: 'points_possible', label: 'Points' },
];

export function registerAssignments(parent: Command, getClient: () => CanvasClient): void {
  const assignments = parent.command('assignments').description('Manage assignments');

  assignments
    .command('list <courseId>')
    .description('List assignments for a course')
    .option('--bucket <bucket>', 'Filter by bucket (past, overdue, undated, ungraded, unsubmitted, upcoming, future)')
    .option('--search <term>', 'Search assignments by name')
    .option('--order-by <field>', 'Order by field (name, due_at, position)')
    .action(async (courseId: string, cmdOpts: { bucket?: string; search?: string; orderBy?: string }) => {
      const client = getClient();
      const opts = parent.opts();
      const params: Record<string, unknown> = {};
      if (cmdOpts.bucket) params.bucket = cmdOpts.bucket;
      if (cmdOpts.search) params.searchTerm = cmdOpts.search;
      if (cmdOpts.orderBy) params.orderBy = cmdOpts.orderBy;
      const items = await collect(
        client.assignments.list(courseId, params as Parameters<typeof client.assignments.list>[1]),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      output(items as unknown as Record<string, unknown>[], listColumns, { json: opts.json, itemName: 'assignments' });
    });

  assignments
    .command('get <courseId> <assignmentId>')
    .description('Get assignment details')
    .action(async (courseId: string, assignmentId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const item = await client.assignments.get(courseId, assignmentId);
      outputDetail(item as unknown as Record<string, unknown>, detailColumns, { json: opts.json });
    });

  assignments
    .command('upcoming')
    .description('List upcoming assignments across all courses')
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const courses = await collect(client.courses.list());
      const all: Record<string, unknown>[] = [];
      for (const course of courses) {
        const items = await collect(client.assignments.list(course.id, { bucket: 'upcoming' }));
        for (const item of items) {
          all.push({ ...(item as unknown as Record<string, unknown>), course_name: course.name });
        }
      }
      all.sort((a, b) => {
        const da = a.due_at ? new Date(a.due_at as string).getTime() : Infinity;
        const db = b.due_at ? new Date(b.due_at as string).getTime() : Infinity;
        return da - db;
      });
      const limited = opts.limit ? all.slice(0, parseInt(opts.limit)) : all;
      output(limited, upcomingColumns, { json: opts.json, itemName: 'upcoming assignments' });
    });
}
