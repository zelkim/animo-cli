## Context

This is a greenfield CLI project (`animo-cli`) that wraps the `canvas-student-api` TypeScript SDK. The SDK provides a fully typed, paginated client for Canvas LMS REST endpoints scoped to student access tokens. It uses native `fetch`, supports ESM and CJS, and exposes 15 domain APIs (courses, assignments, submissions, modules, pages, discussions, quizzes, files, calendar, planner, conversations, users, groups, enrollments, announcements).

The CLI needs to expose the most useful student workflows as terminal commands, handle authentication configuration, and present API responses in human-readable and machine-readable formats.

## Goals / Non-Goals

**Goals:**

- Provide a `animo` CLI binary that students can install globally via npm
- Support all read commands for the 11 core domains identified in the proposal
- Support write commands for submissions and conversations
- Load credentials from env vars (`CANVAS_BASE_URL`, `CANVAS_TOKEN`), a `~/.animorc.json` config file, or CLI flags — in that precedence order (flags > env > config file)
- Output in two formats: human-readable tables (default) and JSON (`--json` flag)
- Auto-paginate all list endpoints with `--limit` to cap results
- Provide clear, actionable error messages for auth failures, network errors, and API errors

**Non-Goals:**

- No interactive/TUI mode (e.g., curses-based UI) — strictly command-line
- No file upload support in v1 (submission uploads require multi-step flow)
- No caching or offline support
- No admin/instructor-scoped commands — student token only
- No shell completions in v1
- Pages, discussions, quizzes, files, groups, and enrollments commands are deferred to a future iteration — focus on the highest-value student workflows first

## Decisions

### 1. CLI Framework: Commander.js

**Choice**: Commander.js  
**Alternatives considered**: yargs, oclif, citty  
**Rationale**: Commander.js is the most widely used Node CLI framework, has zero transitive dependencies in modern versions, provides subcommand support natively (`program.command('courses').command('list')`), and has excellent TypeScript support. yargs is heavier and its chaining API is less idiomatic for TypeScript. oclif is powerful but overkill for this scope — its plugin system and class-based architecture add unnecessary complexity. citty is lightweight but less mature and has a smaller ecosystem.

### 2. Project Structure: Flat command modules

**Choice**: One file per domain under `src/commands/`, a shared `src/client.ts` factory, and shared formatters under `src/formatters/`.

```
src/
  index.ts          # entry point, registers commands
  client.ts         # creates CanvasClient from resolved config
  config.ts         # config resolution (flags → env → file)
  formatter.ts      # table/json output dispatcher
  commands/
    courses.ts
    assignments.ts
    submissions.ts
    planner.ts
    calendar.ts
    grades.ts
    modules.ts
    announcements.ts
    conversations.ts
    user.ts
  formatters/
    table.ts        # table rendering with cli-table3
    json.ts         # JSON.stringify with indentation
```

**Rationale**: Flat structure keeps the project simple. Each command file registers its subcommands on a Commander `Command` object and is imported by the entry point. No dynamic loading or plugin system needed at this scale.

### 3. Output Formatting: cli-table3 + chalk

**Choice**: `cli-table3` for table output, `chalk` for color  
**Alternatives considered**: columnify, tty-table, no-color plain text  
**Rationale**: cli-table3 is the maintained fork of cli-table2, handles Unicode widths correctly, and supports compact/borderless styles. chalk is the standard for terminal colors. Both are lightweight. Each domain formatter will define which columns to show by default, keeping tables scannable.

### 4. Config Resolution Order

**Choice**: CLI flags → environment variables → config file (`~/.animorc.json`)

The config file stores `baseUrl` and `token`. The CLI reads it with `fs.readFileSync` at startup. Environment variables are `CANVAS_BASE_URL` and `CANVAS_TOKEN`. CLI flags are `--base-url` and `--token` on the root command (inherited by subcommands).

**Rationale**: This is the standard precedence for CLI tools (explicit flags override everything, env vars for CI/containers, config file for personal defaults). A JSON config file is simple to parse and edit.

### 5. Pagination Strategy

**Choice**: Auto-iterate the SDK's `AsyncIterable` and collect to array, applying `--limit` as an early break.

All list commands accept `--limit <n>` (default: no limit, fetch all). The runner iterates the SDK's paginated result and stops after `n` items. For JSON output, the full collected array is printed. For table output, rows are rendered after collection.

**Rationale**: The SDK already handles Link-header pagination internally. The CLI just needs to consume the async iterable and optionally cap it. Streaming row-by-row output is a non-goal for v1.

### 6. Error Handling

**Choice**: Catch `CanvasApiError` at the top-level action handler and print a formatted error message (status, URL, Canvas error body). Non-API errors (network, config) get a simple message with exit code 1.

**Rationale**: Centralized error handling avoids try/catch in every command. The SDK already throws structured `CanvasApiError` instances, so the CLI can destructure them cleanly.

### 7. TypeScript + ESM Build

**Choice**: TypeScript with ESM output, compiled with `tsc`. The `bin` field points to `dist/index.js` with a `#!/usr/bin/env node` shebang.

**Rationale**: Matches the SDK's ESM-first approach. No bundler needed — tsc is sufficient for a CLI tool. Node 18+ supports ESM natively.

## Risks / Trade-offs

- **[SDK coupling]** → The CLI directly depends on `canvas-student-api` types and methods. If the SDK changes its API surface, the CLI breaks. Mitigation: pin the SDK version; the SDK is owned by the same team.
- **[No file uploads in v1]** → Students can't submit file-based assignments via CLI. Mitigation: document this limitation; the multi-step upload flow (get upload URL → POST file → attach to submission) can be added later.
- **[Token security]** → Storing a token in `~/.animorc.json` is readable by the user's account. Mitigation: set file permissions to `0600` on creation; warn users not to commit the file; support env vars as the primary mechanism.
- **[Large result sets]** → Some endpoints (e.g., all submissions across all courses) can return thousands of items. Mitigation: `--limit` flag; default `perPage` of 50 keeps API calls reasonable.
- **[chalk ESM compatibility]** → chalk v5+ is ESM-only. Mitigation: since the project is ESM, this is a non-issue; use chalk v5.
