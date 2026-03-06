import Table from 'cli-table3';
import chalk from 'chalk';

export interface Column {
  key: string;
  label: string;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + '...';
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T/.test(value);
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '-';
  const str = String(value);
  if (isIsoDate(str)) return formatDate(str);
  return truncate(str, 60);
}

export function formatTable(rows: Record<string, unknown>[], columns: Column[]): string {
  const table = new Table({
    head: columns.map(c => chalk.bold(c.label)),
    style: { head: [], border: [], compact: true },
    chars: {
      top: '', 'top-mid': '', 'top-left': '', 'top-right': '',
      bottom: '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
      left: '', 'left-mid': '', mid: '', 'mid-mid': '',
      right: '', 'right-mid': '', middle: '  ',
    },
  });

  for (const row of rows) {
    table.push(columns.map(c => formatCell(row[c.key])));
  }

  return table.toString();
}
