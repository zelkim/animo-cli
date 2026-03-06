## ADDED Requirements

### Requirement: user profile command

The CLI SHALL provide `animo user profile` to display the current user's profile. The command SHALL call `CanvasClient.users.getProfile('self')` and display the profile details.

Table fields: Name, Email, Login ID, Bio, Time Zone, Locale.

#### Scenario: Displaying user profile
- **WHEN** the user runs `animo user profile`
- **THEN** the CLI SHALL display the current user's profile including name, email, login ID, bio, time zone, and locale

#### Scenario: Profile as JSON
- **WHEN** the user runs `animo user profile --json`
- **THEN** the CLI SHALL output the full profile object as JSON

### Requirement: user todos command

The CLI SHALL provide `animo user todos` to list the user's pending todo items. The command SHALL call `CanvasClient.users.listTodoItems()` and display the items.

Table columns: Type, Course, Assignment/Quiz Name, Due Date, URL.

#### Scenario: Listing todo items
- **WHEN** the user runs `animo user todos`
- **THEN** the CLI SHALL display pending todo items with type, course context, item name, and due date

#### Scenario: No todo items
- **WHEN** the user runs `animo user todos` and no items are pending
- **THEN** the CLI SHALL display a message indicating no pending items

### Requirement: user upcoming command

The CLI SHALL provide `animo user upcoming` to list the user's upcoming events. The command SHALL call `CanvasClient.users.listUpcomingEvents()` and display the events.

Table columns: Date, Title, Type, Context, URL.

#### Scenario: Listing upcoming events
- **WHEN** the user runs `animo user upcoming`
- **THEN** the CLI SHALL display upcoming events sorted by date with title, type, and context

#### Scenario: No upcoming events
- **WHEN** the user runs `animo user upcoming` and no events exist
- **THEN** the CLI SHALL display a message indicating no upcoming events
