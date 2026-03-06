import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';

const listColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'posted_at', label: 'Date' },
  { key: 'context_code', label: 'Course' },
  { key: 'title', label: 'Title' },
];

const detailColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'subject', label: 'Subject' },
  { key: 'message', label: 'Message' },
  { key: 'start_at', label: 'Start' },
  { key: 'end_at', label: 'End' },
  { key: 'icon', label: 'Icon' },
];

export function registerAnnouncements(parent: Command, getClient: () => CanvasClient): void {
  const announcements = parent.command('announcements').description('View announcements');

  announcements
    .command('list')
    .description('List announcements')
    .option('--course <courseId>', 'Filter to a specific course')
    .action(async (cmdOpts: { course?: string }) => {
      const client = getClient();
      const opts = parent.opts();

      let contextCodes: string[];
      if (cmdOpts.course) {
        contextCodes = [`course_${cmdOpts.course}`];
      } else {
        const courses = await collect(client.courses.list());
        contextCodes = courses.map(c => `course_${c.id}`);
      }

      if (contextCodes.length === 0) {
        console.log('No courses found to fetch announcements from.');
        return;
      }

      const items = await collect(
        client.announcements.list(contextCodes),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      output(items as unknown as Record<string, unknown>[], listColumns, { json: opts.json, itemName: 'announcements' });
    });

  announcements
    .command('get <notificationId>')
    .description('Get an account notification')
    .action(async (notificationId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const item = await client.announcements.getAccountNotification('self', notificationId);
      outputDetail(item as unknown as Record<string, unknown>, detailColumns, { json: opts.json });
    });
}
