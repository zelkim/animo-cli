## ADDED Requirements

### Requirement: courses list command

The CLI SHALL provide `animo courses list` to list the current user's enrolled courses. The command SHALL call `CanvasClient.courses.list()` and display results as a table or JSON.

Table columns: ID, Name, Course Code, Term, Enrollment State.

#### Scenario: Listing enrolled courses
- **WHEN** the user runs `animo courses list`
- **THEN** the CLI SHALL display all enrolled courses in table format with columns ID, Name, Course Code, Term, and Enrollment State

#### Scenario: Listing courses with limit
- **WHEN** the user runs `animo courses list --limit 5`
- **THEN** the CLI SHALL display at most 5 courses

#### Scenario: Listing courses as JSON
- **WHEN** the user runs `animo courses list --json`
- **THEN** the CLI SHALL output the courses array as formatted JSON

### Requirement: courses get command

The CLI SHALL provide `animo courses get <courseId>` to fetch a single course by ID. The command SHALL call `CanvasClient.courses.get(courseId)` and display the course details.

#### Scenario: Getting a course by ID
- **WHEN** the user runs `animo courses get 12345`
- **THEN** the CLI SHALL display the course details including ID, name, course code, start/end dates, and enrollment type

#### Scenario: Getting a non-existent course
- **WHEN** the user runs `animo courses get 99999` and the API returns a 404
- **THEN** the CLI SHALL display an error message indicating the course was not found

### Requirement: courses favorites command

The CLI SHALL provide `animo courses favorites` to list the user's favorite courses. The command SHALL call `CanvasClient.courses.listFavorites()`.

#### Scenario: Listing favorite courses
- **WHEN** the user runs `animo courses favorites`
- **THEN** the CLI SHALL display the user's favorite courses in table format

#### Scenario: No favorite courses
- **WHEN** the user runs `animo courses favorites` and the user has no favorites
- **THEN** the CLI SHALL display a message indicating no favorite courses were found
