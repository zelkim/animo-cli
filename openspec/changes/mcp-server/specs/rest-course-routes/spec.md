## ADDED Requirements

### Requirement: List enrolled courses
The server SHALL expose `GET /api/courses` that returns an array of the user's enrolled courses.

#### Scenario: List courses
- **WHEN** a client sends `GET /api/courses`
- **THEN** the server responds with HTTP 200 and a JSON array of course objects

### Requirement: Get course details
The server SHALL expose `GET /api/courses/:courseId` that returns details for a specific course.

#### Scenario: Valid course ID
- **WHEN** a client sends `GET /api/courses/123`
- **THEN** the server responds with HTTP 200 and the course object

#### Scenario: Invalid course ID
- **WHEN** a client sends `GET /api/courses/999999` and the course does not exist
- **THEN** the server responds with HTTP 404

### Requirement: List favorite courses
The server SHALL expose `GET /api/courses/favorites` that returns an array of the user's favorite courses.

#### Scenario: List favorites
- **WHEN** a client sends `GET /api/courses/favorites`
- **THEN** the server responds with HTTP 200 and a JSON array of favorite course objects
