## ADDED Requirements

### Requirement: Output format selection

The CLI SHALL support two output formats: table (default) and JSON. The format SHALL be selected by the `--json` global flag. When `--json` is passed, all commands SHALL output their data as formatted JSON. When absent, commands SHALL output human-readable tables.

#### Scenario: Default table output
- **WHEN** the user runs any list command without `--json`
- **THEN** the CLI SHALL render results as a formatted table

#### Scenario: JSON output
- **WHEN** the user runs any command with `--json`
- **THEN** the CLI SHALL output the raw data as indented JSON (2-space indent)

### Requirement: Table formatting

The table formatter SHALL use `cli-table3` to render data in a borderless, compact style. Each domain command SHALL define which columns to display. Long text fields (descriptions, message bodies) SHALL be truncated to 60 characters with an ellipsis. Dates SHALL be formatted as locale-appropriate short strings (e.g., `Mar 7, 2026 3:00 PM`).

#### Scenario: Truncating long fields
- **WHEN** a table cell contains text longer than 60 characters
- **THEN** the formatter SHALL truncate it to 57 characters followed by `...`

#### Scenario: Date formatting
- **WHEN** a table cell contains an ISO date string
- **THEN** the formatter SHALL display it as a readable date (e.g., `Mar 7, 2026 3:00 PM`)

#### Scenario: Null or missing fields
- **WHEN** a field value is null or undefined
- **THEN** the formatter SHALL display `-` as the cell value

### Requirement: JSON formatting

The JSON formatter SHALL output data using `JSON.stringify` with 2-space indentation. For single-item commands, it SHALL output the object directly. For list commands, it SHALL output an array.

#### Scenario: JSON array output
- **WHEN** a list command output contains multiple items and `--json` is set
- **THEN** the formatter SHALL output a JSON array of objects

#### Scenario: JSON single object output
- **WHEN** a get command output is a single item and `--json` is set
- **THEN** the formatter SHALL output a single JSON object

### Requirement: Color support

The table formatter SHALL use `chalk` for color output. Header rows SHALL be bold. Error messages SHALL be displayed in red. Success confirmations (e.g., submission created) SHALL be displayed in green. The CLI SHALL respect the `NO_COLOR` environment variable — when set, all color output SHALL be disabled.

#### Scenario: Colored table headers
- **WHEN** the user runs a list command in a color-capable terminal
- **THEN** the table header row SHALL be rendered in bold

#### Scenario: NO_COLOR environment variable
- **WHEN** the `NO_COLOR` environment variable is set
- **THEN** the CLI SHALL produce no ANSI color codes in any output

### Requirement: Empty result messaging

When a list command returns zero results, the CLI SHALL display a human-readable message (e.g., "No courses found.") instead of an empty table. For JSON output, an empty array `[]` SHALL be printed.

#### Scenario: Empty list in table mode
- **WHEN** a list command returns no items and `--json` is not set
- **THEN** the CLI SHALL print a descriptive "No <items> found." message

#### Scenario: Empty list in JSON mode
- **WHEN** a list command returns no items and `--json` is set
- **THEN** the CLI SHALL output `[]`

### Requirement: Pagination collection with limit

The CLI SHALL consume the SDK's `AsyncIterable` pagination and collect items into an array. When `--limit <n>` is specified, the collector SHALL stop iterating after `n` items. The collector SHALL be a shared utility used by all list commands.

#### Scenario: Collecting with limit
- **WHEN** the user runs a list command with `--limit 10` and the API has 50 results
- **THEN** the CLI SHALL collect and display only the first 10 items

#### Scenario: Collecting without limit
- **WHEN** the user runs a list command without `--limit`
- **THEN** the CLI SHALL collect and display all items from the paginated result
