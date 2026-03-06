import { Command } from 'commander';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import chalk from 'chalk';

const configPath = join(homedir(), '.animorc.json');

interface FileConfig {
  baseUrl?: string;
  token?: string;
}

function loadConfig(): FileConfig {
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8')) as FileConfig;
  } catch {
    return {};
  }
}

function saveConfig(config: FileConfig): void {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
}

function maskToken(token: string): string {
  if (token.length <= 8) return '****';
  return token.slice(0, 4) + '...' + token.slice(-4);
}

export function registerConfig(parent: Command): void {
  const config = parent.command('config').description('Manage CLI configuration');

  const set = config.command('set').description('Set a configuration value');

  set
    .command('base-url')
    .description('Set the Canvas instance base URL')
    .argument('<url>', 'Canvas instance base URL')
    .action((url: string) => {
      const existing = loadConfig();
      existing.baseUrl = url;
      saveConfig(existing);
      console.log(chalk.green(`Config saved to ${configPath}`));
      console.log(`  Base URL: ${url}`);
    });

  set
    .command('token')
    .description('Set the Canvas API access token')
    .argument('<token>', 'Canvas API access token')
    .action((token: string) => {
      const existing = loadConfig();
      existing.token = token;
      saveConfig(existing);
      console.log(chalk.green(`Config saved to ${configPath}`));
      console.log(`  Token:    ${maskToken(token)}`);
    });

  config
    .command('show')
    .description('Show current configuration')
    .action(() => {
      const cfg = loadConfig();
      if (!cfg.baseUrl && !cfg.token) {
        console.log('No configuration found. Run `animo config set` to configure.');
        return;
      }
      console.log(`Config file: ${configPath}`);
      console.log(`  Base URL: ${cfg.baseUrl ?? '-'}`);
      console.log(`  Token:    ${cfg.token ? maskToken(cfg.token) : '-'}`);
    });

  config
    .command('path')
    .description('Print the config file path')
    .action(() => {
      console.log(configPath);
    });
}
