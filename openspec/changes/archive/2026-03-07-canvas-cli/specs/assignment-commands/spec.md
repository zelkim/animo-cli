## ADDED Requirements

### Requirement: assignments list command

The CLI SHALL provide `animo assignments list <courseId>` to list assignments for a course. The command SHALL call `CanvasClient.assignments.list(courseId)` and display results as a table or JSON.

Table columns: ID, Name, Due Date, Points, Submission Types.

Options:
- `--bucket <bucket>`: Filter by bucket (past, overdue, undated, ungraded, unsubmitted, upcoming, future)
- `--search <term>`: Search assignments by name
- `--order-by <field>`: Order by field (name, due_at, position)

#### Scenario: Listing assignments for a course
- **WHEN** the user runs `animo assignments list 12345`
- **THEN** the CLI SHALL display all assignments for course 12345 in table format

#### Scenario: Filtering by bucket
- **WHEN** the user runs `animo assignments list 12345 --bucket upcoming`
- **THEN** the CLI SHALL display only upcoming assignments for the course

#### Scenario: Searching assignments
- **WHEN** the user runs `animo assignments list 12345 --search "midterm"`
- **THEN** the CLI SHALL display only assignments matching "midterm"

### Requirement: assignments get command

The CLI SHALL provide `animo assignments get <courseId> <assignmentId>` to fetch a single assignment. The command SHALL call `CanvasClient.assignments.get(courseId, assignmentId)` and display the assignment details.

#### Scenario: Getting an assignment by ID
- **WHEN** the user runs `animo assignments get 12345 678`
- **THEN** the CLI SHALL display the assignment details including name, description (truncated), due date, points possible, submission types, and HTML URL

### Requirement: assignments upcoming command

The CLI SHALL provide `animo assignments upcoming` to list upcoming assignments across all enrolled courses. The command SHALL list all courses, then for each course call `CanvasClient.assignments.list(courseId, { bucket: 'upcoming' })`, and aggregate the results sorted by due date ascending.

#### Scenario: Listing upcoming assignments
- **WHEN** the user runs `animo assignments upcoming`
- **THEN** the CLI SHALL display upcoming assignments across all courses, sorted by due date, with columns: Course, Name, Due Date, Points

#### Scenario: No upcoming assignments
- **WHEN** the user runs `animo assignments upcoming` and no assignments are upcoming
- **THEN** the CLI SHALL display a message indicating no upcoming assignments were found
