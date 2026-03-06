## ADDED Requirements

### Requirement: planner today command

The CLI SHALL provide `animo planner today` to list planner items due today. The command SHALL call `CanvasClient.planner.listItems({ startDate: <today>, endDate: <today> })` and display results as a table or JSON.

Table columns: Time, Course, Title, Type, Status.

#### Scenario: Listing today's planner items
- **WHEN** the user runs `animo planner today`
- **THEN** the CLI SHALL display all planner items for today sorted by time

#### Scenario: No items for today
- **WHEN** the user runs `animo planner today` and no planner items are due
- **THEN** the CLI SHALL display a message indicating nothing is planned for today

### Requirement: planner week command

The CLI SHALL provide `animo planner week` to list planner items for the current week (Monday through Sunday). The command SHALL calculate the current week's date range and call `CanvasClient.planner.listItems({ startDate, endDate })`.

#### Scenario: Listing this week's planner items
- **WHEN** the user runs `animo planner week`
- **THEN** the CLI SHALL display planner items for the current Monday through Sunday, grouped or sorted by date

### Requirement: planner list command

The CLI SHALL provide `animo planner list` to list planner items for a custom date range. Options:

- `--start <date>`: Start date (ISO format, defaults to today)
- `--end <date>`: End date (ISO format, defaults to 7 days from start)

The command SHALL call `CanvasClient.planner.listItems({ startDate, endDate })`.

#### Scenario: Listing items for a custom date range
- **WHEN** the user runs `animo planner list --start 2026-03-01 --end 2026-03-31`
- **THEN** the CLI SHALL display all planner items for March 2026

#### Scenario: Default date range
- **WHEN** the user runs `animo planner list` without specifying dates
- **THEN** the CLI SHALL display planner items from today through the next 7 days
