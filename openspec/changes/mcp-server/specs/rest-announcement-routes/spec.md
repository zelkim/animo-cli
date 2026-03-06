## ADDED Requirements

### Requirement: List announcements
The server SHALL expose `GET /api/announcements` that returns an array of announcements, supporting an optional `course` query parameter to filter by course.

#### Scenario: List all announcements
- **WHEN** a client sends `GET /api/announcements`
- **THEN** the server responds with HTTP 200 and a JSON array of announcements across all enrolled courses

#### Scenario: Filter by course
- **WHEN** a client sends `GET /api/announcements?course=123`
- **THEN** the server responds with announcements only from the specified course

### Requirement: Get announcement details
The server SHALL expose `GET /api/announcements/:notificationId` that returns details for a specific account notification.

#### Scenario: Valid notification
- **WHEN** a client sends `GET /api/announcements/789`
- **THEN** the server responds with HTTP 200 and the notification object

#### Scenario: Notification not found
- **WHEN** a client requests a notification that does not exist
- **THEN** the server responds with HTTP 404
