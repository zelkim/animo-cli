## Why

Students interacting with Canvas LMS currently need to write code against the `canvas-student-api` TypeScript SDK or use the raw REST API. There is no command-line tool that lets students quickly list courses, check assignments, view planner items, or submit work from a terminal. A CLI bridges this gap — providing fast, scriptable access to the most common student workflows without opening a browser.

## What Changes

- Add a new CLI application (`animo`) built on the `canvas-student-api` npm package
- Expose read-oriented commands for the core student domains: courses, assignments, submissions, modules, planner, calendar, grades, announcements, conversations, and user profile
- Expose write commands for submissions (submit work) and conversations (send/reply)
- Support configurable Canvas instance URL and access token via environment variables, config file, or CLI flags
- Provide structured output (table and JSON) for all commands
- Auto-paginate list results with optional `--limit` control

## Capabilities

### New Capabilities

- `cli-scaffold`: Project setup, entry point, command parser (e.g. Commander/yargs), global options (`--base-url`, `--token`, `--output json|table`), and config file loading
- `course-commands`: `courses list`, `courses get <id>`, `courses favorites` — list enrolled courses, view details, list favorites
- `assignment-commands`: `assignments list <course>`, `assignments get <course> <id>`, `assignments upcoming` — list and view assignments, show upcoming due dates
- `submission-commands`: `submissions list <course> <assignment>`, `submissions get <course> <assignment>`, `submissions submit <course> <assignment>` — view and create submissions
- `planner-commands`: `planner today`, `planner week`, `planner list --start <date> --end <date>` — view planner items for date ranges
- `calendar-commands`: `calendar list --start <date> --end <date>`, `calendar get <id>` — list and view calendar events
- `grade-commands`: `grades list [course]` — show grades/submissions across courses
- `module-commands`: `modules list <course>`, `modules get <course> <id>`, `modules items <course> <module>` — browse course modules
- `announcement-commands`: `announcements list`, `announcements get <id>` — view announcements and account notifications
- `conversation-commands`: `conversations list`, `conversations get <id>`, `conversations send`, `conversations reply <id>` — read and compose messages
- `user-commands`: `user profile`, `user todos`, `user upcoming` — view profile, pending tasks, and upcoming events
- `output-formatting`: Shared table/JSON formatters, color support, truncation for terminal width, and error display

### Modified Capabilities

_(none — this is a new project)_

## Impact

- **New dependency**: `canvas-student-api` (the attached wrapper package)
- **New dependencies**: a CLI framework (e.g. Commander.js), a table formatter (e.g. cli-table3 or similar)
- **New npm binary**: `animo` — registered in `package.json` `bin` field
- **Environment**: Requires `CANVAS_BASE_URL` and `CANVAS_TOKEN` environment variables (or equivalent config) to operate
- **No impact on existing code** — animo-cli is a new, standalone project
