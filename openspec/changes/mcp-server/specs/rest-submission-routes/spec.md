## ADDED Requirements

### Requirement: List submissions for an assignment
The server SHALL expose `GET /api/courses/:courseId/assignments/:assignmentId/submissions` that returns an array of submissions.

#### Scenario: List submissions
- **WHEN** a client sends `GET /api/courses/123/assignments/456/submissions`
- **THEN** the server responds with HTTP 200 and a JSON array of submission objects

### Requirement: Get own submission
The server SHALL expose `GET /api/courses/:courseId/assignments/:assignmentId/submissions/self` that returns the authenticated user's submission.

#### Scenario: Get self submission
- **WHEN** a client sends `GET /api/courses/123/assignments/456/submissions/self`
- **THEN** the server responds with HTTP 200 and the user's submission object

#### Scenario: No submission exists
- **WHEN** the user has not submitted for the assignment
- **THEN** the server responds with HTTP 404

### Requirement: Create a submission
The server SHALL expose `POST /api/courses/:courseId/assignments/:assignmentId/submissions` that creates a new submission. The request body MUST include `submissionType` and optionally `body` or `url` depending on the type.

#### Scenario: Submit text entry
- **WHEN** a client sends POST with `{ "submissionType": "online_text_entry", "body": "My answer" }`
- **THEN** the server creates the submission and responds with HTTP 201 and the submission object

#### Scenario: Submit URL
- **WHEN** a client sends POST with `{ "submissionType": "online_url", "url": "https://example.com" }`
- **THEN** the server creates the submission and responds with HTTP 201 and the submission object

#### Scenario: Missing submission type
- **WHEN** a client sends POST without `submissionType`
- **THEN** the server responds with HTTP 400 and `{ "error": "submissionType is required", "status": 400 }`
