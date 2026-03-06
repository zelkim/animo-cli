## ADDED Requirements

### Requirement: Get user profile
The server SHALL expose `GET /api/user/profile` that returns the authenticated user's profile.

#### Scenario: Get profile
- **WHEN** a client sends `GET /api/user/profile`
- **THEN** the server responds with HTTP 200 and the user profile object

### Requirement: List user todo items
The server SHALL expose `GET /api/user/todos` that returns the user's pending todo items.

#### Scenario: List todos
- **WHEN** a client sends `GET /api/user/todos`
- **THEN** the server responds with HTTP 200 and a JSON array of todo items with assignment details

### Requirement: List user upcoming events
The server SHALL expose `GET /api/user/upcoming` that returns the user's upcoming events.

#### Scenario: List upcoming events
- **WHEN** a client sends `GET /api/user/upcoming`
- **THEN** the server responds with HTTP 200 and a JSON array of upcoming event objects
