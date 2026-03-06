## ADDED Requirements

### Requirement: calendar list command

The CLI SHALL provide `animo calendar list` to list calendar events. Options:

- `--start <date>`: Start date (ISO format, defaults to today)
- `--end <date>`: End date (ISO format, defaults to 14 days from start)
- `--type <type>`: Event type filter (`event` or `assignment`)
- `--context <codes...>`: Context codes to filter by (e.g., `course_12345`)

The command SHALL call `CanvasClient.calendar.listEvents({ startDate, endDate, type, contextCodes })`.

Table columns: Date, Time, Title, Type, Context.

#### Scenario: Listing calendar events with defaults
- **WHEN** the user runs `animo calendar list`
- **THEN** the CLI SHALL display calendar events for the next 14 days in table format

#### Scenario: Filtering by date range and type
- **WHEN** the user runs `animo calendar list --start 2026-03-01 --end 2026-03-31 --type assignment`
- **THEN** the CLI SHALL display only assignment-type calendar events for March 2026

#### Scenario: No events found
- **WHEN** the user runs `animo calendar list` and no events exist in the date range
- **THEN** the CLI SHALL display a message indicating no calendar events were found

### Requirement: calendar get command

The CLI SHALL provide `animo calendar get <eventId>` to fetch a single calendar event. The command SHALL call `CanvasClient.calendar.get(eventId)` and display the event details.

#### Scenario: Getting a calendar event
- **WHEN** the user runs `animo calendar get 456`
- **THEN** the CLI SHALL display the event details including title, start/end time, description (truncated), location, and context

#### Scenario: Event not found
- **WHEN** the user runs `animo calendar get 999` and the API returns 404
- **THEN** the CLI SHALL display an error indicating the event was not found
