## ADDED Requirements

### Requirement: grades list command

The CLI SHALL provide `animo grades list [courseId]` to display grades. When `courseId` is provided, the command SHALL show grades for that course. When omitted, it SHALL show grades across all enrolled courses.

The command SHALL call `CanvasClient.enrollments.listForUser('self', { include: ['current_points'] })` to get enrollment objects with grade data. When a `courseId` is given, it SHALL also call `CanvasClient.assignments.listGroups(courseId, { include: ['assignments'], scopeAssignmentsToStudent: true })` to show per-group breakdowns.

Table columns (all courses): Course Name, Current Score, Current Grade, Final Score, Final Grade.
Table columns (single course): Assignment Group, Weight, Current Score, Current Grade.

#### Scenario: Listing grades for all courses
- **WHEN** the user runs `animo grades list`
- **THEN** the CLI SHALL display a table of grades for each enrolled course showing current and final scores/grades

#### Scenario: Listing grades for a specific course
- **WHEN** the user runs `animo grades list 12345`
- **THEN** the CLI SHALL display a breakdown of assignment group grades for course 12345 including group names, weights, and scores

#### Scenario: No grade data available
- **WHEN** the user runs `animo grades list` and enrollments have no grade data
- **THEN** the CLI SHALL display a message indicating grades are not yet available

#### Scenario: JSON output for grades
- **WHEN** the user runs `animo grades list --json`
- **THEN** the CLI SHALL output the enrollment objects with grades as JSON
