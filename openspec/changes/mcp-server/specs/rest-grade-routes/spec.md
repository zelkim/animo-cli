## ADDED Requirements

### Requirement: List grades across all courses
The server SHALL expose `GET /api/grades` that returns a grade summary across all enrolled courses, using enrollment data.

#### Scenario: All course grades
- **WHEN** a client sends `GET /api/grades`
- **THEN** the server responds with HTTP 200 and a JSON array of objects containing course name, current score, current grade, and final score for each enrollment

### Requirement: List grades for a specific course
The server SHALL expose `GET /api/grades/:courseId` that returns assignment group grades for a specific course, including group weights and individual assignments.

#### Scenario: Course grade details
- **WHEN** a client sends `GET /api/grades/123`
- **THEN** the server responds with HTTP 200 and a JSON array of assignment groups with their weights and assignments scoped to the student

#### Scenario: Course not found
- **WHEN** a client requests grades for a course that does not exist
- **THEN** the server responds with HTTP 404
