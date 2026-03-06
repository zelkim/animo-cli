## ADDED Requirements

### Requirement: List assignments for a course
The server SHALL expose `GET /api/courses/:courseId/assignments` that returns an array of assignments, supporting optional query parameters `bucket`, `search`, and `orderBy`.

#### Scenario: List all assignments
- **WHEN** a client sends `GET /api/courses/123/assignments`
- **THEN** the server responds with HTTP 200 and a JSON array of assignment objects

#### Scenario: Filter by bucket
- **WHEN** a client sends `GET /api/courses/123/assignments?bucket=upcoming`
- **THEN** the server responds with only assignments matching the specified bucket

#### Scenario: Search by name
- **WHEN** a client sends `GET /api/courses/123/assignments?search=midterm`
- **THEN** the server responds with assignments whose names match the search term

### Requirement: Get assignment details
The server SHALL expose `GET /api/courses/:courseId/assignments/:assignmentId` that returns details for a specific assignment.

#### Scenario: Valid assignment
- **WHEN** a client sends `GET /api/courses/123/assignments/456`
- **THEN** the server responds with HTTP 200 and the assignment object

#### Scenario: Assignment not found
- **WHEN** a client requests an assignment that does not exist
- **THEN** the server responds with HTTP 404

### Requirement: List upcoming assignments across courses
The server SHALL expose `GET /api/assignments/upcoming` that aggregates upcoming assignments across all enrolled courses.

#### Scenario: Upcoming assignments
- **WHEN** a client sends `GET /api/assignments/upcoming`
- **THEN** the server responds with HTTP 200 and a JSON array of upcoming assignment objects from all courses
