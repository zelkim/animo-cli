## 1. Project Setup

- [x] 1.1 Initialize `package.json` with `name: "animo-cli"`, `type: "module"`, `bin: { "animo": "./dist/index.js" }`, and scripts (`build`, `dev`, `lint`)
- [x] 1.2 Add dependencies: `commander`, `chalk`, `cli-table3`, `canvas-student-api`
- [x] 1.3 Add devDependencies: `typescript`, `@types/node`, `vitest`
- [x] 1.4 Create `tsconfig.json` with ESM output, strict mode, `outDir: "dist"`, target ES2022
- [x] 1.5 Create `.gitignore` for `node_modules/`, `dist/`

## 2. Config & Client Factory

- [x] 2.1 Create `src/config.ts` — resolve `baseUrl` and `token` from CLI flags → env vars (`CANVAS_BASE_URL`, `CANVAS_TOKEN`) → config file (`~/.animorc.json`); export `resolveConfig(flags)` function
- [x] 2.2 Create `src/client.ts` — export `createClient(config)` factory that returns a `CanvasClient` instance from resolved config

## 3. Output Formatting

- [x] 3.1 Create `src/formatters/json.ts` — `formatJson(data)` outputs `JSON.stringify(data, null, 2)`
- [x] 3.2 Create `src/formatters/table.ts` — `formatTable(rows, columns)` renders a borderless `cli-table3` table with bold headers via `chalk`, truncating long fields to 60 chars, formatting ISO dates, and displaying `-` for null values
- [x] 3.3 Create `src/formatter.ts` — `output(data, columns, opts)` dispatcher that calls json or table formatter based on `--json` flag; handles empty results with "No <items> found." message or `[]` for JSON
- [x] 3.4 Create `src/collect.ts` — `collect(iterable, limit?)` async utility that iterates an `AsyncIterable` and stops after `limit` items

## 4. CLI Entry Point

- [x] 4.1 Create `src/index.ts` — `#!/usr/bin/env node` shebang, define root `Command` with `--base-url`, `--token`, `--json`, `--limit`, `--per-page` global options, register all command groups, add top-level error handler catching `CanvasApiError` and general errors (print message, exit 1)
- [x] 4.2 Register version from `package.json` and hook default help output

## 5. Course Commands

- [x] 5.1 Create `src/commands/courses.ts` — register `courses` command group with `list`, `get <courseId>`, and `favorites` subcommands
- [x] 5.2 Implement `courses list` — call `client.courses.list()`, collect with limit, output table (ID, Name, Course Code, Term, Enrollment State) or JSON
- [x] 5.3 Implement `courses get <courseId>` — call `client.courses.get(id)`, output detail view or JSON
- [x] 5.4 Implement `courses favorites` — call `client.courses.listFavorites()`, collect and output

## 6. Assignment Commands

- [x] 6.1 Create `src/commands/assignments.ts` — register `assignments` command group with `list <courseId>`, `get <courseId> <assignmentId>`, and `upcoming` subcommands
- [x] 6.2 Implement `assignments list` — accept `--bucket`, `--search`, `--order-by` options; call `client.assignments.list(courseId, params)`, output table (ID, Name, Due Date, Points, Submission Types) or JSON
- [x] 6.3 Implement `assignments get` — call `client.assignments.get(courseId, assignmentId)`, output detail view
- [x] 6.4 Implement `assignments upcoming` — list all courses, fetch upcoming assignments per course, aggregate sorted by due date, output table (Course, Name, Due Date, Points)

## 7. Submission Commands

- [x] 7.1 Create `src/commands/submissions.ts` — register `submissions` command group with `list <courseId> <assignmentId>`, `get <courseId> <assignmentId>`, and `submit <courseId> <assignmentId>` subcommands
- [x] 7.2 Implement `submissions list` — call `client.submissions.list(courseId, assignmentId)`, output table (User ID, Workflow State, Score, Submitted At, Grade)
- [x] 7.3 Implement `submissions get` — call `client.submissions.get(courseId, assignmentId, 'self')`, output detail view
- [x] 7.4 Implement `submissions submit` — accept `--type` (required), `--body`, `--url` options; validate type/content match; call `client.submissions.create()`, output confirmation

## 8. Planner Commands

- [x] 8.1 Create `src/commands/planner.ts` — register `planner` command group with `today`, `week`, and `list` subcommands
- [x] 8.2 Implement `planner today` — calculate today's date range, call `client.planner.listItems({ startDate, endDate })`, output table (Time, Course, Title, Type, Status)
- [x] 8.3 Implement `planner week` — calculate current Monday–Sunday range, call `client.planner.listItems()`, output table
- [x] 8.4 Implement `planner list` — accept `--start`, `--end` options (defaults: today, today+7), call `client.planner.listItems()`, output table

## 9. Calendar Commands

- [x] 9.1 Create `src/commands/calendar.ts` — register `calendar` command group with `list` and `get <eventId>` subcommands
- [x] 9.2 Implement `calendar list` — accept `--start`, `--end`, `--type`, `--context` options; call `client.calendar.listEvents(params)`, output table (Date, Time, Title, Type, Context)
- [x] 9.3 Implement `calendar get` — call `client.calendar.get(eventId)`, output detail view

## 10. Grade Commands

- [x] 10.1 Create `src/commands/grades.ts` — register `grades` command group with `list [courseId]` subcommand
- [x] 10.2 Implement `grades list` (all courses) — call `client.enrollments.listForUser('self')`, output table (Course Name, Current Score, Current Grade, Final Score, Final Grade)
- [x] 10.3 Implement `grades list <courseId>` — call `client.assignments.listGroups(courseId, { include: ['assignments'], scopeAssignmentsToStudent: true })`, output table (Assignment Group, Weight, Current Score, Current Grade)

## 11. Module Commands

- [x] 11.1 Create `src/commands/modules.ts` — register `modules` command group with `list <courseId>`, `get <courseId> <moduleId>`, and `items <courseId> <moduleId>` subcommands
- [x] 11.2 Implement `modules list` — call `client.modules.list(courseId)`, output table (ID, Name, State, Items Count, Position)
- [x] 11.3 Implement `modules get` — call `client.modules.get(courseId, moduleId, { include: ['items'] })`, output detail view with items
- [x] 11.4 Implement `modules items` — accept `--search` option; call `client.modules.listItems(courseId, moduleId, { include: ['content_details'] })`, output table (Position, Title, Type, Due Date, Completed)

## 12. Announcement Commands

- [x] 12.1 Create `src/commands/announcements.ts` — register `announcements` command group with `list` and `get <notificationId>` subcommands
- [x] 12.2 Implement `announcements list` — accept `--course` option; when omitted, list all courses and build context codes; call `client.announcements.list(contextCodes)`, output table (ID, Date, Course, Title)
- [x] 12.3 Implement `announcements get` — call `client.announcements.getAccountNotification('self', notificationId)`, output detail view

## 13. Conversation Commands

- [x] 13.1 Create `src/commands/conversations.ts` — register `conversations` command group with `list`, `get <id>`, `send`, and `reply <id>` subcommands
- [x] 13.2 Implement `conversations list` — accept `--scope` option; call `client.conversations.list({ scope })`, output table (ID, Subject, Last Message, Date, Participants)
- [x] 13.3 Implement `conversations get` — call `client.conversations.get(id)`, output conversation with messages
- [x] 13.4 Implement `conversations send` — accept `--to`, `--subject`, `--body`, `--course` options; validate required fields; call `client.conversations.create()`, output confirmation
- [x] 13.5 Implement `conversations reply` — accept `--body` option; call `client.conversations.addMessage(id, { body })`, output confirmation

## 14. User Commands

- [x] 14.1 Create `src/commands/user.ts` — register `user` command group with `profile`, `todos`, and `upcoming` subcommands
- [x] 14.2 Implement `user profile` — call `client.users.getProfile('self')`, output detail view (Name, Email, Login ID, Bio, Time Zone, Locale)
- [x] 14.3 Implement `user todos` — call `client.users.listTodoItems()`, output table (Type, Course, Assignment/Quiz Name, Due Date, URL)
- [x] 14.4 Implement `user upcoming` — call `client.users.listUpcomingEvents()`, output table (Date, Title, Type, Context, URL)

## 15. Build & Verify

- [x] 15.1 Run `tsc` and verify clean compilation with no errors
- [x] 15.2 Run `animo --help` and verify all command groups are listed
- [x] 15.3 Run `animo --version` and verify version output
