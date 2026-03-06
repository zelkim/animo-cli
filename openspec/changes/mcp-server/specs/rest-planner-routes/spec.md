## ADDED Requirements

### Requirement: List today's planner items
The server SHALL expose `GET /api/planner/today` that returns planner items for the current date.

#### Scenario: Today's items
- **WHEN** a client sends `GET /api/planner/today`
- **THEN** the server responds with HTTP 200 and a JSON array of planner items with start and end dates set to today

### Requirement: List this week's planner items
The server SHALL expose `GET /api/planner/week` that returns planner items from Monday through Sunday of the current week.

#### Scenario: Week's items
- **WHEN** a client sends `GET /api/planner/week`
- **THEN** the server responds with HTTP 200 and a JSON array of planner items spanning the current Monday to Sunday

### Requirement: List planner items for a date range
The server SHALL expose `GET /api/planner` that returns planner items for a configurable date range via `start` and `end` query parameters.

#### Scenario: Custom date range
- **WHEN** a client sends `GET /api/planner?start=2026-03-01&end=2026-03-15`
- **THEN** the server responds with HTTP 200 and planner items within that range

#### Scenario: Default date range
- **WHEN** a client sends `GET /api/planner` with no query parameters
- **THEN** the server defaults to today as start and 7 days from today as end
