import { Command } from 'commander';
import type { CanvasClient } from 'canvas-student-api';
import { collect } from '../collect.js';
import { output, outputDetail, type Column } from '../formatter.js';
import chalk from 'chalk';

const listColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'subject', label: 'Subject' },
  { key: 'last_message', label: 'Last Message' },
  { key: 'last_message_at', label: 'Date' },
  { key: 'participant_names', label: 'Participants' },
];

const detailColumns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'subject', label: 'Subject' },
  { key: 'message_count', label: 'Messages' },
  { key: 'participant_names', label: 'Participants' },
];

function mapConversation(item: Record<string, unknown>): Record<string, unknown> {
  const participants = item.participants as Array<{ name?: string }> | undefined;
  return {
    ...item,
    participant_names: participants?.map(p => p.name).join(', ') ?? '-',
  };
}

export function registerConversations(parent: Command, getClient: () => CanvasClient): void {
  const conversations = parent.command('conversations').description('Manage conversations');

  conversations
    .command('list')
    .description('List conversations')
    .option('--scope <scope>', 'Filter by scope (inbox, unread, archived, sent)')
    .action(async (cmdOpts: { scope?: string }) => {
      const client = getClient();
      const opts = parent.opts();
      const params: Parameters<typeof client.conversations.list>[0] = {};
      if (cmdOpts.scope) params.scope = cmdOpts.scope;
      const items = await collect(
        client.conversations.list(params),
        opts.limit ? parseInt(opts.limit) : undefined,
      );
      const mapped = (items as unknown as Record<string, unknown>[]).map(mapConversation);
      output(mapped, listColumns, { json: opts.json, itemName: 'conversations' });
    });

  conversations
    .command('get <conversationId>')
    .description('Get a conversation with messages')
    .action(async (conversationId: string) => {
      const client = getClient();
      const opts = parent.opts();
      const item = await client.conversations.get(conversationId);
      const mapped = mapConversation(item as unknown as Record<string, unknown>);

      if (opts.json) {
        console.log(JSON.stringify(item, null, 2));
        return;
      }

      outputDetail(mapped, detailColumns, { json: false });
      console.log('\n--- Messages ---\n');
      const messages = (item as unknown as Record<string, unknown>).messages as Array<Record<string, unknown>> | undefined;
      if (messages) {
        for (const msg of messages) {
          const date = msg.created_at ? new Date(msg.created_at as string).toLocaleString() : '';
          console.log(`[${date}] Author ${msg.author_id}:`);
          console.log(`  ${msg.body}\n`);
        }
      }
    });

  conversations
    .command('send')
    .description('Send a new conversation')
    .requiredOption('--to <recipientIds...>', 'Recipient user IDs')
    .requiredOption('--body <text>', 'Message body')
    .option('--subject <text>', 'Conversation subject')
    .option('--course <courseId>', 'Course context')
    .action(async (cmdOpts: { to: string[]; body: string; subject?: string; course?: string }) => {
      const client = getClient();
      const opts = parent.opts();
      const result = await client.conversations.create({
        recipients: cmdOpts.to,
        body: cmdOpts.body,
        subject: cmdOpts.subject,
        contextCode: cmdOpts.course ? `course_${cmdOpts.course}` : undefined,
      });

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.green('Conversation created successfully.'));
      }
    });

  conversations
    .command('reply <conversationId>')
    .description('Reply to a conversation')
    .requiredOption('--body <text>', 'Reply message body')
    .action(async (conversationId: string, cmdOpts: { body: string }) => {
      const client = getClient();
      const opts = parent.opts();
      const result = await client.conversations.addMessage(conversationId, {
        body: cmdOpts.body,
      });

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.green('Reply sent successfully.'));
      }
    });
}
