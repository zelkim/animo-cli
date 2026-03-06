import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';
import chalk from 'chalk';

const listColumns: Column[] = [
  { key: 'user_id', label: 'User ID' },
  { key: 'workflow_state', label: 'State' },
  { key: 'score', label: 'Score' },
  { key: 'submitted_at', label: 'Submitted At' },
  { key: 'grade', label: 'Grade' },
];

const detailColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'workflow_state', label: 'State' },
  { key: 'score', label: 'Score' },
  { key: 'grade', label: 'Grade' },
  { key: 'submitted_at', label: 'Submitted At' },
  { key: 'attempt', label: 'Attempt' },
  { key: 'late', label: 'Late' },
  { key: 'missing', label: 'Missing' },
];

export function registerSubmissions(parent: Command, getClient: () => CanvasClient): void {
  const submissions = parent.command('submissions').description('Manage submissions');

  submissions
    .command('list <courseId> <assignmentId>')
    .description('List submissions for an assignment')
    .action(async (courseId: string, assignmentId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const items = await collect(
        client.submissions.list(courseId, assignmentId),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      output(items as unknown as Record<string, unknown>[], listColumns, { json: opts.json, itemName: 'submissions' });
    });

  submissions
    .command('get <courseId> <assignmentId>')
    .description('Get your submission for an assignment')
    .action(async (courseId: string, assignmentId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const item = await client.submissions.get(courseId, assignmentId, 'self');
      outputDetail(item as unknown as Record<string, unknown>, detailColumns, { json: opts.json });
    });

  submissions
    .command('submit <courseId> <assignmentId>')
    .description('Submit an assignment')
    .requiredOption('--type <type>', 'Submission type (online_text_entry, online_url)')
    .option('--body <text>', 'Submission body for text entries')
    .option('--url <url>', 'URL for URL submissions')
    .action(async (courseId: string, assignmentId: string, cmdOpts: { type: string; body?: string; url?: string }) => {
      const client = getClient();
      const opts = parent.opts();

      if (cmdOpts.type === 'online_text_entry' && cmdOpts.url) {
        console.error(chalk.yellow('Warning: --url is ignored for text entry submissions.'));
      }

      const result = await client.submissions.create(courseId, assignmentId, {
        submissionType: cmdOpts.type,
        body: cmdOpts.body,
        url: cmdOpts.url,
      });

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.green('Submission created successfully.'));
        console.log(`ID: ${result.id}`);
        console.log(`State: ${result.workflow_state}`);
      }
    });
}
