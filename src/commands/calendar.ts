import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';

const listColumns: Column[] = [
  { key: 'start_at', label: 'Date' },
  { key: 'start_at', label: 'Time' },
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'context_code', label: 'Context' },
];

const detailColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'start_at', label: 'Start' },
  { key: 'end_at', label: 'End' },
  { key: 'description', label: 'Description' },
  { key: 'location_name', label: 'Location' },
  { key: 'context_code', label: 'Context' },
  { key: 'html_url', label: 'URL' },
];

export function registerCalendar(parent: Command, getClient: () => CanvasClient): void {
  const calendar = parent.command('calendar').description('View calendar events');

  calendar
    .command('list')
    .description('List calendar events')
    .option('--start <date>', 'Start date (ISO format)')
    .option('--end <date>', 'End date (ISO format)')
    .option('--type <type>', 'Event type (event, assignment)')
    .option('--context <codes...>', 'Context codes to filter by')
    .action(async (cmdOpts: { start?: string; end?: string; type?: string; context?: string[] }) => {
      const client = getClient();
      const opts = parent.opts();
      const startDate = cmdOpts.start ?? new Date().toISOString().slice(0, 10);
      const endD = new Date(startDate);
      endD.setDate(endD.getDate() + 14);
      const endDate = cmdOpts.end ?? endD.toISOString().slice(0, 10);
      const params: Parameters<typeof client.calendar.listEvents>[0] = {
        startDate,
        endDate,
      };
      if (cmdOpts.type) params.type = cmdOpts.type;
      if (cmdOpts.context) params.contextCodes = cmdOpts.context;
      const items = await collect(
        client.calendar.listEvents(params),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      output(items as unknown as Record<string, unknown>[], listColumns, { json: opts.json, itemName: 'calendar events' });
    });

  calendar
    .command('get <eventId>')
    .description('Get calendar event details')
    .action(async (eventId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const item = await client.calendar.get(eventId);
      outputDetail(item as unknown as Record<string, unknown>, detailColumns, { json: opts.json });
    });
}
