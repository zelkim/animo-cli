## ADDED Requirements

### Requirement: modules list command

The CLI SHALL provide `animo modules list <courseId>` to list modules for a course. The command SHALL call `CanvasClient.modules.list(courseId)` and display results as a table or JSON.

Table columns: ID, Name, State, Items Count, Position.

#### Scenario: Listing modules for a course
- **WHEN** the user runs `animo modules list 12345`
- **THEN** the CLI SHALL display all modules for the course in table format ordered by position

#### Scenario: No modules in course
- **WHEN** the user runs `animo modules list 12345` and the course has no modules
- **THEN** the CLI SHALL display a message indicating no modules were found

### Requirement: modules get command

The CLI SHALL provide `animo modules get <courseId> <moduleId>` to fetch a single module. The command SHALL call `CanvasClient.modules.get(courseId, moduleId, { include: ['items'] })` and display the module details along with its items.

#### Scenario: Getting a module by ID
- **WHEN** the user runs `animo modules get 12345 100`
- **THEN** the CLI SHALL display the module details (name, state, prerequisites) and a list of its items

### Requirement: modules items command

The CLI SHALL provide `animo modules items <courseId> <moduleId>` to list items within a module. The command SHALL call `CanvasClient.modules.listItems(courseId, moduleId, { include: ['content_details'] })`.

Table columns: Position, Title, Type, Due Date, Completed.

#### Scenario: Listing items in a module
- **WHEN** the user runs `animo modules items 12345 100`
- **THEN** the CLI SHALL display module items with position, title, type, due date (if applicable), and completion status

#### Scenario: Searching module items
- **WHEN** the user runs `animo modules items 12345 100 --search "quiz"`
- **THEN** the CLI SHALL filter and display only module items matching "quiz"
