## ADDED Requirements

### Requirement: submissions list command

The CLI SHALL provide `animo submissions list <courseId> <assignmentId>` to list submissions for an assignment. The command SHALL call `CanvasClient.submissions.list(courseId, assignmentId)` and display results as a table or JSON.

Table columns: User ID, Workflow State, Score, Submitted At, Grade.

#### Scenario: Listing submissions for an assignment
- **WHEN** the user runs `animo submissions list 12345 678`
- **THEN** the CLI SHALL display submissions for the assignment in table format

### Requirement: submissions get command

The CLI SHALL provide `animo submissions get <courseId> <assignmentId>` to get the current user's submission for an assignment. The command SHALL call `CanvasClient.submissions.get(courseId, assignmentId, 'self')` and display the submission details.

#### Scenario: Getting own submission
- **WHEN** the user runs `animo submissions get 12345 678`
- **THEN** the CLI SHALL display the current user's submission details including workflow state, score, grade, submitted at, and any comments

#### Scenario: No submission exists
- **WHEN** the user runs `animo submissions get 12345 678` and no submission exists
- **THEN** the CLI SHALL display a message indicating no submission has been made

### Requirement: submissions submit command

The CLI SHALL provide `animo submissions submit <courseId> <assignmentId>` to create a new submission. The command SHALL accept the following options:

- `--type <type>` (required): Submission type (online_text_entry, online_url)
- `--body <text>`: Submission body for text entries
- `--url <url>`: URL for URL submissions

The command SHALL call `CanvasClient.submissions.create(courseId, assignmentId, { submissionType, body, url })`.

#### Scenario: Submitting a text entry
- **WHEN** the user runs `animo submissions submit 12345 678 --type online_text_entry --body "My answer"`
- **THEN** the CLI SHALL create the submission and display a confirmation with the submission ID and workflow state

#### Scenario: Submitting a URL
- **WHEN** the user runs `animo submissions submit 12345 678 --type online_url --url "https://example.com/my-work"`
- **THEN** the CLI SHALL create the submission and display a confirmation

#### Scenario: Missing required type option
- **WHEN** the user runs `animo submissions submit 12345 678` without `--type`
- **THEN** the CLI SHALL display an error indicating `--type` is required

#### Scenario: Mismatched type and content
- **WHEN** the user runs `animo submissions submit 12345 678 --type online_text_entry --url "https://example.com"`
- **THEN** the CLI SHALL display a warning that `--url` is ignored for text entry submissions and use `--body` if provided
