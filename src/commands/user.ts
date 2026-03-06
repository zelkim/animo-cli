import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';

const profileColumns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'primary_email', label: 'Email' },
  { key: 'login_id', label: 'Login ID' },
  { key: 'bio', label: 'Bio' },
  { key: 'time_zone', label: 'Time Zone' },
  { key: 'locale', label: 'Locale' },
];

const todoColumns: Column[] = [
  { key: 'type', label: 'Type' },
  { key: 'course_id', label: 'Course' },
  { key: 'assignment_name', label: 'Name' },
  { key: 'due_at', label: 'Due Date' },
  { key: 'html_url', label: 'URL' },
];

const upcomingColumns: Column[] = [
  { key: 'start_at', label: 'Date' },
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'context_code', label: 'Context' },
  { key: 'html_url', label: 'URL' },
];

function mapTodo(item: Record<string, unknown>): Record<string, unknown> {
  const assignment = item.assignment as Record<string, unknown> | undefined;
  return {
    ...item,
    assignment_name: assignment?.name ?? '-',
    due_at: assignment?.due_at ?? '-',
  };
}

export function registerUser(parent: Command, getClient: () => CanvasClient): void {
  const user = parent.command('user').description('View user information');

  user
    .command('profile')
    .description('Display your profile')
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const profile = await client.users.getProfile('self');
      outputDetail(profile as unknown as Record<string, unknown>, profileColumns, { json: opts.json });
    });

  user
    .command('todos')
    .description('List pending todo items')
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const items = await collect(
        client.users.listTodoItems(),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      const mapped = (items as unknown as Record<string, unknown>[]).map(mapTodo);
      output(mapped, todoColumns, { json: opts.json, itemName: 'todo items' });
    });

  user
    .command('upcoming')
    .description('List upcoming events')
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const items = await collect(
        client.users.listUpcomingEvents(),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      output(items as unknown as Record<string, unknown>[], upcomingColumns, { json: opts.json, itemName: 'upcoming events' });
    });
}
