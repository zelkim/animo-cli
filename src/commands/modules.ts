import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';

const listColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'state', label: 'State' },
  { key: 'items_count', label: 'Items' },
  { key: 'position', label: 'Position' },
];

const detailColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'state', label: 'State' },
  { key: 'items_count', label: 'Items' },
  { key: 'unlock_at', label: 'Unlock At' },
];

const itemColumns: Column[] = [
  { key: 'position', label: 'Position' },
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'due_at', label: 'Due Date' },
  { key: 'completed', label: 'Completed' },
];

function mapModuleItem(item: Record<string, unknown>): Record<string, unknown> {
  const details = item.content_details as Record<string, unknown> | undefined;
  const req = item.completion_requirement as Record<string, unknown> | undefined;
  return {
    ...item,
    due_at: details?.due_at ?? '-',
    completed: req?.completed != null ? (req.completed ? 'Yes' : 'No') : '-',
  };
}

export function registerModules(parent: Command, getClient: () => CanvasClient): void {
  const modules = parent.command('modules').description('Browse course modules');

  modules
    .command('list <courseId>')
    .description('List modules for a course')
    .action(async (courseId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const items = await collect(
        client.modules.list(courseId),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      output(items as unknown as Record<string, unknown>[], listColumns, { json: opts.json, itemName: 'modules' });
    });

  modules
    .command('get <courseId> <moduleId>')
    .description('Get module details')
    .action(async (courseId: string, moduleId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const item = await client.modules.get(courseId, moduleId, { include: ['items'] });
      outputDetail(item as unknown as Record<string, unknown>, detailColumns, { json: opts.json });
    });

  modules
    .command('items <courseId> <moduleId>')
    .description('List items in a module')
    .option('--search <term>', 'Search module items')
    .action(async (courseId: string, moduleId: string, cmdOpts: { search?: string }) => {
      const client = getClient();
      const opts = parent.opts();
      const params: Parameters<typeof client.modules.listItems>[2] = {
        include: ['content_details'],
      };
      if (cmdOpts.search) params.searchTerm = cmdOpts.search;
      const items = await collect(
        client.modules.listItems(courseId, moduleId, params),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      const mapped = (items as unknown as Record<string, unknown>[]).map(mapModuleItem);
      output(mapped, itemColumns, { json: opts.json, itemName: 'module items' });
    });
}
