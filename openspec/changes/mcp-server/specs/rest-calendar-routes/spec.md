## ADDED Requirements

### Requirement: List calendar events
The server SHALL expose `GET /api/calendar` that returns calendar events, supporting optional query parameters `start`, `end`, `type`, and `context`.

#### Scenario: List with date range
- **WHEN** a client sends `GET /api/calendar?start=2026-03-01&end=2026-03-31`
- **THEN** the server responds with HTTP 200 and a JSON array of calendar events within that range

#### Scenario: Filter by type
- **WHEN** a client sends `GET /api/calendar?type=assignment`
- **THEN** the server responds with only events of type "assignment"

#### Scenario: Filter by context
- **WHEN** a client sends `GET /api/calendar?context=course_123`
- **THEN** the server responds with events only from that context

#### Scenario: Default date range
- **WHEN** a client sends `GET /api/calendar` with no date parameters
- **THEN** the server defaults to today as start and 14 days from today as end

### Requirement: Get calendar event details
The server SHALL expose `GET /api/calendar/:eventId` that returns details for a specific calendar event.

#### Scenario: Valid event
- **WHEN** a client sends `GET /api/calendar/789`
- **THEN** the server responds with HTTP 200 and the calendar event object

#### Scenario: Event not found
- **WHEN** a client requests an event that does not exist
- **THEN** the server responds with HTTP 404
