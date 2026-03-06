## ADDED Requirements

### Requirement: announcements list command

The CLI SHALL provide `animo announcements list` to list announcements. The command SHALL accept an optional `--course <courseId>` option.

When `--course` is provided, the command SHALL call `CanvasClient.announcements.list(['course_<courseId>'])`. When omitted, the command SHALL first list all enrolled courses, then call `CanvasClient.announcements.list(contextCodes)` with all course context codes.

Options:
- `--course <courseId>`: Filter to a specific course
- `--active-only`: Show only active announcements (default: true)

Table columns: ID, Date, Course, Title.

#### Scenario: Listing announcements across all courses
- **WHEN** the user runs `animo announcements list`
- **THEN** the CLI SHALL display recent announcements from all enrolled courses sorted by date descending

#### Scenario: Listing announcements for a specific course
- **WHEN** the user runs `animo announcements list --course 12345`
- **THEN** the CLI SHALL display announcements only from course 12345

#### Scenario: No announcements found
- **WHEN** the user runs `animo announcements list` and no announcements exist
- **THEN** the CLI SHALL display a message indicating no announcements were found

### Requirement: announcements get command

The CLI SHALL provide `animo announcements get <notificationId>` to display a single account notification. The command SHALL call `CanvasClient.announcements.getAccountNotification('self', notificationId)` and display the notification details.

#### Scenario: Getting an announcement
- **WHEN** the user runs `animo announcements get 42`
- **THEN** the CLI SHALL display the announcement subject, message body, start/end dates, and icon

#### Scenario: Announcement not found
- **WHEN** the user runs `animo announcements get 999` and the API returns 404
- **THEN** the CLI SHALL display an error indicating the announcement was not found
