## Why

The CLI exposes Canvas LMS capabilities only through a terminal interface. A REST API would expose the same capabilities as HTTP endpoints that external tools — specifically n8n AI agents — can invoke via HTTP Request nodes or custom tool definitions. This enables building automated workflows and AI-powered agents that interact with Canvas for querying courses, checking grades, submitting assignments, and managing conversations.

## What Changes

- Add a new `src/server/` module containing an Express HTTP server with route handlers
- Add a new `bin` entry (`animo-serve`) that starts the REST API server
- Add `express` dependency
- Reuse existing `src/config.ts` and `src/client.ts` for authentication and API access
- Expose every CLI capability as a REST endpoint with JSON request/response
- Bearer token authentication on all routes (reuses the Canvas token or a configurable server secret)
- Auto-generated OpenAPI spec for n8n tool integration
- No changes to existing CLI commands or behavior

## Capabilities

### New Capabilities

- `rest-server-core`: Express server scaffold — startup, middleware, auth guard, error handling, OpenAPI spec generation, health check
- `rest-course-routes`: Routes for listing courses, getting course details, listing favorites
- `rest-assignment-routes`: Routes for listing assignments, getting assignment details, listing upcoming assignments across courses
- `rest-submission-routes`: Routes for listing submissions, getting own submission, creating a submission
- `rest-planner-routes`: Routes for listing today's planner items, this week's items, and custom date-range items
- `rest-calendar-routes`: Routes for listing calendar events and getting event details
- `rest-grade-routes`: Routes for listing grades per course or across all courses
- `rest-module-routes`: Routes for listing modules, getting module details, listing module items
- `rest-announcement-routes`: Routes for listing announcements and getting notification details
- `rest-conversation-routes`: Routes for listing conversations, getting a conversation, sending a new conversation, replying
- `rest-user-routes`: Routes for viewing profile, listing todos, listing upcoming events
- `n8n-workflow-setup`: Create a "Canvas Telegram Bot" workflow in n8n via the n8n MCP, with an AI agent that uses all REST API routes as HTTP Request tools

### Modified Capabilities

_None — existing CLI commands and specs are unchanged._

## Impact

- **New dependencies**: `express`, `@types/express` (dev)
- **New files**: `src/server/index.ts` (entry point), `src/server/routes/*.ts` (one per route group), `src/server/middleware.ts` (auth, error handling), `src/server/openapi.ts` (spec generation)
- **package.json**: New `bin` entry for `animo-serve`, new dependencies, new `start` script
- **tsconfig.json**: No changes needed (new files are under `src/`)
- **Existing code**: No modifications — routes import and reuse `createClient`, `resolveConfig`, and `collect`
- **n8n**: New "Canvas Telegram Bot" workflow created via n8n MCP with Telegram trigger, AI agent node, and HTTP Request tool nodes for every REST API endpoint
