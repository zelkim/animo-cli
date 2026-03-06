import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface ResolvedConfig {
  baseUrl: string;
  token: string;
  perPage: number;
}

interface ConfigFlags {
  baseUrl?: string;
  token?: string;
  perPage?: string;
}

interface FileConfig {
  baseUrl?: string;
  token?: string;
}

function loadConfigFile(): FileConfig {
  try {
    const raw = readFileSync(join(homedir(), '.animorc.json'), 'utf-8');
    return JSON.parse(raw) as FileConfig;
  } catch {
    return {};
  }
}

export function resolveConfig(flags: ConfigFlags): ResolvedConfig {
  const file = loadConfigFile();

  const baseUrl = flags.baseUrl ?? process.env['CANVAS_BASE_URL'] ?? file.baseUrl;
  const token = flags.token ?? process.env['CANVAS_TOKEN'] ?? file.token;

  if (!baseUrl) {
    console.error(
      'Error: Canvas base URL is required.\n' +
      'Set it via --base-url flag, CANVAS_BASE_URL env var, or ~/.animorc.json'
    );
    process.exit(1);
  }

  if (!token) {
    console.error(
      'Error: Canvas token is required.\n' +
      'Set it via --token flag, CANVAS_TOKEN env var, or ~/.animorc.json'
    );
    process.exit(1);
  }

  const perPage = flags.perPage ? parseInt(flags.perPage, 10) : 50;

  return { baseUrl, token, perPage };
}
