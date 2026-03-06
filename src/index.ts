#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import chalk from 'chalk';
import { CanvasApiError } from 'canvas-student-api';
import { resolveConfig } from './config.js';
import { createClient } from './client.js';
import { registerCourses } from './commands/courses.js';
import { registerAssignments } from './commands/assignments.js';
import { registerSubmissions } from './commands/submissions.js';
import { registerPlanner } from './commands/planner.js';
import { registerCalendar } from './commands/calendar.js';
import { registerGrades } from './commands/grades.js';
import { registerModules } from './commands/modules.js';
import { registerAnnouncements } from './commands/announcements.js';
import { registerConversations } from './commands/conversations.js';
import { registerUser } from './commands/user.js';
import { registerConfig } from './commands/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('animo')
  .description('CLI for Canvas LMS student API')
  .version(pkg.version)
  .option('--base-url <url>', 'Canvas instance base URL')
  .option('--token <token>', 'Canvas API access token')
  .option('--json', 'Output in JSON format')
  .option('--limit <n>', 'Maximum number of items to return')
  .option('--per-page <n>', 'Items per API page (default: 50)');

function getClient() {
  const opts = program.opts();
  const config = resolveConfig({
    baseUrl: opts.baseUrl,
    token: opts.token,
    perPage: opts.perPage,
  });
  return createClient(config);
}

registerCourses(program, getClient);
registerAssignments(program, getClient);
registerSubmissions(program, getClient);
registerPlanner(program, getClient);
registerCalendar(program, getClient);
registerGrades(program, getClient);
registerModules(program, getClient);
registerAnnouncements(program, getClient);
registerConversations(program, getClient);
registerUser(program, getClient);
registerConfig(program);

program.hook('preAction', () => {
  // Ensure client is constructable before running any command
});

program.parseAsync(process.argv).catch((err: unknown) => {
  if (err instanceof CanvasApiError) {
    console.error(chalk.red(`API Error ${err.status} ${err.statusText}`));
    console.error(`  URL: ${err.url}`);
    if (err.body) console.error(`  Body: ${JSON.stringify(err.body)}`);
  } else if (err instanceof Error) {
    console.error(chalk.red(`Error: ${err.message}`));
  } else {
    console.error(chalk.red('An unknown error occurred.'));
  }
  process.exit(1);
});
