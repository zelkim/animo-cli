import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, type Column } from '../formatter.js';

const listColumns: Column[] = [
  { key: 'plannable_date', label: 'Time' },
  { key: 'context_name', label: 'Course' },
  { key: 'plannable_title', label: 'Title' },
  { key: 'plannable_type', label: 'Type' },
  { key: 'planner_override_marked_complete', label: 'Status' },
];

function todayRange(): { startDate: string; endDate: string } {
  const d = new Date();
  const iso = d.toISOString().slice(0, 10);
  return { startDate: iso, endDate: iso };
}

function weekRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    startDate: monday.toISOString().slice(0, 10),
    endDate: sunday.toISOString().slice(0, 10),
  };
}

function mapItem(item: Record<string, unknown>): Record<string, unknown> {
  const plannable = item.plannable as Record<string, unknown> | undefined;
  return {
    ...item,
    plannable_title: (item as Record<string, unknown>).plannable?.toString() ?? plannable?.title ?? '-',
    plannable_date: item.plannable_date ?? '-',
    context_name: (item as Record<string, unknown>).context_name ?? '-',
    plannable_type: item.plannable_type ?? '-',
    planner_override_marked_complete: item.planner_override
      ? ((item.planner_override as Record<string, unknown>).marked_complete ? 'Done' : 'Pending')
      : 'Pending',
  };
}

export function registerPlanner(parent: Command, getClient: () => CanvasClient): void {
  const planner = parent.command('planner').description('View planner items');

  planner
    .command('today')
    .description("List today's planner items")
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const range = todayRange();
      const items = await collect(
        client.planner.listItems(range),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      const mapped = (items as unknown as Record<string, unknown>[]).map(mapItem);
      output(mapped, listColumns, { json: opts.json, itemName: 'planner items for today' });
    });

  planner
    .command('week')
    .description("List this week's planner items")
    .action(async () => {
      const client = getClient();
      const opts = parent.opts();
      const range = weekRange();
      const items = await collect(
        client.planner.listItems(range),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      const mapped = (items as unknown as Record<string, unknown>[]).map(mapItem);
      output(mapped, listColumns, { json: opts.json, itemName: 'planner items this week' });
    });

  planner
    .command('list')
    .description('List planner items for a date range')
    .option('--start <date>', 'Start date (ISO format)')
    .option('--end <date>', 'End date (ISO format)')
    .action(async (cmdOpts: { start?: string; end?: string }) => {
      const client = getClient();
      const opts = parent.opts();
      const startDate = cmdOpts.start ?? new Date().toISOString().slice(0, 10);
      const endD = new Date(startDate);
      endD.setDate(endD.getDate() + 7);
      const endDate = cmdOpts.end ?? endD.toISOString().slice(0, 10);
      const items = await collect(
        client.planner.listItems({ startDate, endDate }),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      const mapped = (items as unknown as Record<string, unknown>[]).map(mapItem);
      output(mapped, listColumns, { json: opts.json, itemName: 'planner items' });
    });
}
