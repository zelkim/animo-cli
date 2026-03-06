## Context

The animo-cli project is a TypeScript + ESM CLI that wraps the `canvas-student-api` SDK to interact with Canvas LMS. It currently exposes 10 command groups (courses, assignments, submissions, planner, calendar, grades, modules, announcements, conversations, user) plus a config command. The goal is to add a REST API server that exposes the same capabilities as HTTP endpoints, primarily for consumption by n8n AI agent tool nodes.

The existing codebase already separates concerns well: `resolveConfig()` handles auth resolution, `createClient()` builds the SDK client, and `collect()` consumes async iterables. The server can reuse all of these directly.

## Goals / Non-Goals

**Goals:**
- Expose all CLI capabilities as REST endpoints returning JSON
- Authenticate requests via Bearer token to prevent unauthorized access
- Serve an OpenAPI 3.0 spec at `/openapi.json` so n8n can auto-discover tools
- Support configurable port and host via CLI flags, env vars, or config file
- Reuse existing config, client, and collection utilities — no duplication
- Keep the server stateless (one Canvas client per request based on server config)

**Non-Goals:**
- WebSocket or streaming support
- User management / multi-tenant auth (single Canvas token per server instance)
- Rate limiting or caching (rely on Canvas LMS upstream behavior)
- A web UI or dashboard
- Modifying existing CLI commands or behavior

## Decisions

### 1. Express.js as HTTP framework

**Choice:** Express v4 (latest stable)
**Alternatives considered:**
- Fastify — faster, but Express is more widely known, has simpler middleware patterns, and n8n examples commonly use Express
- Hono — lightweight, but less ecosystem support for OpenAPI generation
- Koa — minimal advantage over Express for this use case

**Rationale:** Express is the most pragmatic choice for a straightforward REST API. The server is a thin adapter over the SDK — we don't need high-performance routing or schema-based validation. Express v4 is stable and has excellent TypeScript support via `@types/express`.

### 2. Single entry point at `src/server/index.ts`

**Choice:** New `src/server/index.ts` as the server entry, compiled to `dist/server/index.js`, exposed as `animo-serve` bin.
**Rationale:** Keeps server code isolated from CLI code. Both share `src/config.ts`, `src/client.ts`, and `src/collect.ts` but have separate entry points. No changes to the existing CLI entry point.

### 3. Route file per domain

**Choice:** One file per domain in `src/server/routes/` (courses.ts, assignments.ts, etc.), each exporting an Express Router.
**Rationale:** Mirrors the CLI `src/commands/` structure. Each route file is self-contained and registers its routes on a Router, which the main server mounts. This keeps files focused and makes it easy to add or remove route groups.

### 4. Bearer token authentication

**Choice:** A middleware that checks `Authorization: Bearer <token>` on every route except `/health` and `/openapi.json`.
**Alternatives considered:**
- API key in query param — less secure, leaks in logs
- No auth — unacceptable for an API that accesses Canvas data

**Rationale:** The token is read from the server's config (same `resolveConfig()` used by CLI). The server is intended to run locally or in a trusted network for n8n, but Bearer auth prevents accidental exposure. The token used for auth is the same Canvas token — this keeps config simple (one token serves both as "server password" and Canvas API credential).

### 5. Static OpenAPI 3.0 spec

**Choice:** Hand-written OpenAPI spec object in `src/server/openapi.ts`, served at `GET /openapi.json`.
**Alternatives considered:**
- Runtime generation from decorators (tsoa, routing-controllers) — adds heavy dependencies and complexity
- Swagger-jsdoc from JSDoc comments — fragile, hard to keep in sync

**Rationale:** The API surface is well-defined and stable (mirrors CLI 1:1). A static spec object is simple, type-safe, and guaranteed accurate. n8n can import it directly to auto-create tool definitions. The spec describes each endpoint's path, method, parameters, and response schema.

### 6. Shared Canvas client per server instance

**Choice:** Create one `CanvasClient` at startup and share across all requests.
**Alternatives considered:**
- Create a new client per request — wasteful, no benefit since config is static

**Rationale:** The server runs with a single Canvas token configured at startup. Creating the client once and passing it to route handlers via `req.app.locals` avoids per-request overhead and mirrors how the CLI creates one client per invocation.

### 7. URL structure

**Choice:** RESTful routes grouped by resource:
```
GET  /api/courses
GET  /api/courses/:courseId
GET  /api/courses/favorites
GET  /api/courses/:courseId/assignments
GET  /api/courses/:courseId/assignments/:assignmentId
GET  /api/assignments/upcoming
POST /api/courses/:courseId/assignments/:assignmentId/submissions
GET  /api/planner/today
GET  /api/planner/week
GET  /api/planner
GET  /api/calendar
GET  /api/calendar/:eventId
GET  /api/grades
GET  /api/grades/:courseId
GET  /api/courses/:courseId/modules
GET  /api/courses/:courseId/modules/:moduleId
GET  /api/courses/:courseId/modules/:moduleId/items
GET  /api/announcements
GET  /api/announcements/:notificationId
GET  /api/conversations
GET  /api/conversations/:conversationId
POST /api/conversations
POST /api/conversations/:conversationId/reply
GET  /api/user/profile
GET  /api/user/todos
GET  /api/user/upcoming
```
**Rationale:** Standard REST conventions. All routes under `/api/` prefix to avoid collisions with meta endpoints (`/health`, `/openapi.json`). Query parameters for filtering (e.g., `?bucket=upcoming`, `?start=2026-01-01`).

### 8. Error handling

**Choice:** Centralized error-handling middleware that catches `CanvasApiError` and maps it to appropriate HTTP status codes (400, 401, 403, 404, 500).
**Rationale:** Consistent JSON error responses `{ "error": "message", "status": <code> }` make it easy for n8n to detect failures. The CLI already wraps SDK errors; the server does the same with HTTP semantics.

## Risks / Trade-offs

- **[Single-token model]** → The server uses one Canvas token. If multiple users need different tokens, this doesn't support it. Mitigation: out of scope for v1; document the limitation.
- **[No HTTPS]** → Express serves HTTP by default. Mitigation: intended for local/private network use behind n8n. Document that a reverse proxy (nginx, Cloudflare tunnel) should be used for public exposure.
- **[Static OpenAPI spec maintenance]** → If routes change, the spec must be updated manually. Mitigation: the API surface mirrors CLI commands which change infrequently; spec is co-located with route code.
- **[Express v4 + ESM]** → Express v4 works with ESM but requires careful import patterns. Mitigation: well-tested pattern, same as existing chalk v5 ESM usage in the project.
