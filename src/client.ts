import { CanvasClient } from 'canvas-student-api';
import type { ResolvedConfig } from './config.js';

export function createClient(config: ResolvedConfig): CanvasClient {
  return new CanvasClient({
    baseUrl: config.baseUrl,
    token: config.token,
    perPage: config.perPage,
  });
}
