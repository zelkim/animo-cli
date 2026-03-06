import { formatJson } from './formatters/json.js';
import { formatTable, type Column } from './formatters/table.js';

export type { Column } from './formatters/table.js';

export interface OutputOptions {
  json?: boolean;
  itemName?: string;
}

export function output(
  data: Record<string, unknown> | Record<string, unknown>[],
  columns: Column[],
  opts: OutputOptions,
): void {
  const isArray = Array.isArray(data);

  if (opts.json) {
    console.log(formatJson(data));
    return;
  }

  if (isArray && data.length === 0) {
    console.log(`No ${opts.itemName ?? 'items'} found.`);
    return;
  }

  if (isArray) {
    console.log(formatTable(data, columns));
  } else {
    // Single item — display key/value pairs
    const pairs = columns.map(c => ({
      label: c.label,
      value: data[c.key],
    }));
    for (const { label, value } of pairs) {
      const display = value === null || value === undefined ? '-' : String(value);
      console.log(`${label}: ${display}`);
    }
  }
}

export function outputDetail(
  data: Record<string, unknown>,
  columns: Column[],
  opts: OutputOptions,
): void {
  if (opts.json) {
    console.log(formatJson(data));
    return;
  }

  for (const c of columns) {
    const value = data[c.key];
    const display = value === null || value === undefined ? '-' : String(value);
    console.log(`${c.label}: ${display}`);
  }
}
