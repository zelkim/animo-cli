## 1. Project Setup

- [x] 1.1 Install `express` dependency and `@types/express` dev dependency
- [x] 1.2 Add `animo-serve` bin entry to `package.json` pointing to `./dist/server/index.js`
- [x] 1.3 Add `start` script to `package.json` (`node dist/server/index.js`)

## 2. Server Core

- [x] 2.1 Create `src/server/index.ts` entry point with shebang, Commander program for `--port` and `--host` flags, config resolution, client creation, and Express app startup
- [x] 2.2 Create `src/server/middleware.ts` with Bearer token auth middleware that skips `/health` and `/openapi.json`
- [x] 2.3 Add centralized error-handling middleware in `src/server/middleware.ts` that maps `CanvasApiError` to HTTP status codes and returns `{ error, status }` JSON
- [x] 2.4 Add `GET /health` route returning `{ "status": "ok" }`
- [x] 2.5 Store shared `CanvasClient` instance on `app.locals.client` at startup

## 3. Course Routes

- [x] 3.1 Create `src/server/routes/courses.ts` with `GET /api/courses` (list enrolled courses)
- [x] 3.2 Add `GET /api/courses/favorites` (list favorite courses)
- [x] 3.3 Add `GET /api/courses/:courseId` (get course details)

## 4. Assignment Routes

- [x] 4.1 Create `src/server/routes/assignments.ts` with `GET /api/courses/:courseId/assignments` (list assignments with `bucket`, `search`, `orderBy` query params)
- [x] 4.2 Add `GET /api/courses/:courseId/assignments/:assignmentId` (get assignment details)
- [x] 4.3 Add `GET /api/assignments/upcoming` (upcoming assignments across all courses)

## 5. Submission Routes

- [x] 5.1 Create `src/server/routes/submissions.ts` with `GET /api/courses/:courseId/assignments/:assignmentId/submissions` (list submissions)
- [x] 5.2 Add `GET /api/courses/:courseId/assignments/:assignmentId/submissions/self` (get own submission)
- [x] 5.3 Add `POST /api/courses/:courseId/assignments/:assignmentId/submissions` (create submission with `submissionType`, `body`, `url` in request body)

## 6. Planner Routes

- [x] 6.1 Create `src/server/routes/planner.ts` with `GET /api/planner/today` (today's planner items)
- [x] 6.2 Add `GET /api/planner/week` (current week Monday–Sunday)
- [x] 6.3 Add `GET /api/planner` (custom date range via `start` and `end` query params, default 7 days)

## 7. Calendar Routes

- [x] 7.1 Create `src/server/routes/calendar.ts` with `GET /api/calendar` (list events with `start`, `end`, `type`, `context` query params, default 14 days)
- [x] 7.2 Add `GET /api/calendar/:eventId` (get event details)

## 8. Grade Routes

- [x] 8.1 Create `src/server/routes/grades.ts` with `GET /api/grades` (grade summary across all courses via enrollments)
- [x] 8.2 Add `GET /api/grades/:courseId` (assignment groups with weights for a specific course)

## 9. Module Routes

- [x] 9.1 Create `src/server/routes/modules.ts` with `GET /api/courses/:courseId/modules` (list modules)
- [x] 9.2 Add `GET /api/courses/:courseId/modules/:moduleId` (get module details with items)
- [x] 9.3 Add `GET /api/courses/:courseId/modules/:moduleId/items` (list module items with optional `search` query param)

## 10. Announcement Routes

- [x] 10.1 Create `src/server/routes/announcements.ts` with `GET /api/announcements` (list announcements, optional `course` query param)
- [x] 10.2 Add `GET /api/announcements/:notificationId` (get notification details)

## 11. Conversation Routes

- [x] 11.1 Create `src/server/routes/conversations.ts` with `GET /api/conversations` (list with optional `scope` query param)
- [x] 11.2 Add `GET /api/conversations/:conversationId` (get conversation with messages)
- [x] 11.3 Add `POST /api/conversations` (send new conversation with `recipients`, `body`, optional `subject`, `course` in request body)
- [x] 11.4 Add `POST /api/conversations/:conversationId/reply` (reply with `body` in request body)

## 12. User Routes

- [x] 12.1 Create `src/server/routes/user.ts` with `GET /api/user/profile` (user profile)
- [x] 12.2 Add `GET /api/user/todos` (pending todo items)
- [x] 12.3 Add `GET /api/user/upcoming` (upcoming events)

## 13. OpenAPI Spec

- [x] 13.1 Create `src/server/openapi.ts` with static OpenAPI 3.0 spec object describing all endpoints, parameters, request bodies, and response schemas
- [x] 13.2 Add `GET /openapi.json` route in server entry point serving the spec

## 14. Route Registration

- [x] 14.1 Import and mount all route routers in `src/server/index.ts`
- [x] 14.2 Wire up auth middleware and error-handling middleware in correct order

## 15. Build & Verify

- [x] 15.1 Run `npx tsc` and verify clean compilation
- [x] 15.2 Test `animo-serve --help` shows port/host options
- [x] 15.3 Smoke test: start server, verify `GET /health` returns 200
- [x] 15.4 Smoke test: verify `GET /openapi.json` returns valid spec

## 16. n8n Workflow — Canvas Telegram Bot

- [ ] 16.1 Create "Canvas Telegram Bot" workflow in n8n via MCP with Telegram Trigger node and AI Agent node
- [ ] 16.2 Add HTTP Request tool nodes for course routes: list courses, get course, list favorites
- [ ] 16.3 Add HTTP Request tool nodes for assignment routes: list assignments, get assignment, upcoming assignments
- [ ] 16.4 Add HTTP Request tool nodes for submission routes: list submissions, get self submission, create submission
- [ ] 16.5 Add HTTP Request tool nodes for planner routes: today, week, custom range
- [ ] 16.6 Add HTTP Request tool nodes for calendar routes: list events, get event
- [ ] 16.7 Add HTTP Request tool nodes for grade routes: list all grades, get course grades
- [ ] 16.8 Add HTTP Request tool nodes for module routes: list modules, get module, list items
- [ ] 16.9 Add HTTP Request tool nodes for announcement routes: list announcements, get announcement
- [ ] 16.10 Add HTTP Request tool nodes for conversation routes: list, get, send, reply
- [ ] 16.11 Add HTTP Request tool nodes for user routes: profile, todos, upcoming
- [ ] 16.12 Configure Bearer token authentication on all HTTP Request tool nodes
- [ ] 16.13 Connect all tool nodes to the AI Agent node and verify workflow activates
