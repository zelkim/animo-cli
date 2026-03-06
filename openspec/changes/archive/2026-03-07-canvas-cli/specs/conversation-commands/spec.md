## ADDED Requirements

### Requirement: conversations list command

The CLI SHALL provide `animo conversations list` to list the user's conversations. The command SHALL call `CanvasClient.conversations.list()` and display results as a table or JSON.

Options:
- `--scope <scope>`: Filter by scope (inbox, unread, archived, sent)

Table columns: ID, Subject, Last Message (truncated), Date, Participants.

#### Scenario: Listing conversations
- **WHEN** the user runs `animo conversations list`
- **THEN** the CLI SHALL display conversations in table format sorted by most recent

#### Scenario: Listing unread conversations
- **WHEN** the user runs `animo conversations list --scope unread`
- **THEN** the CLI SHALL display only conversations with unread messages

#### Scenario: No conversations
- **WHEN** the user runs `animo conversations list` and the user has no conversations
- **THEN** the CLI SHALL display a message indicating no conversations were found

### Requirement: conversations get command

The CLI SHALL provide `animo conversations get <conversationId>` to display a conversation with its messages. The command SHALL call `CanvasClient.conversations.get(conversationId)` and display the conversation subject, participants, and messages.

#### Scenario: Getting a conversation
- **WHEN** the user runs `animo conversations get 100`
- **THEN** the CLI SHALL display the conversation subject, participants, and all messages with author, date, and body

### Requirement: conversations send command

The CLI SHALL provide `animo conversations send` to create a new conversation. Required options:

- `--to <recipientIds...>`: One or more recipient user IDs
- `--body <text>`: Message body

Optional:
- `--subject <text>`: Conversation subject
- `--course <courseId>`: Course context code

The command SHALL call `CanvasClient.conversations.create({ recipients, body, subject, contextCode })`.

#### Scenario: Sending a new conversation
- **WHEN** the user runs `animo conversations send --to 42 --subject "Question" --body "Hello" --course 12345`
- **THEN** the CLI SHALL create the conversation and display a confirmation with the conversation ID

#### Scenario: Missing required options
- **WHEN** the user runs `animo conversations send` without `--to` or `--body`
- **THEN** the CLI SHALL display an error indicating the required options

### Requirement: conversations reply command

The CLI SHALL provide `animo conversations reply <conversationId>` to add a message to an existing conversation. Required:

- `--body <text>`: Reply message body

The command SHALL call `CanvasClient.conversations.addMessage(conversationId, { body })`.

#### Scenario: Replying to a conversation
- **WHEN** the user runs `animo conversations reply 100 --body "Thanks for the info"`
- **THEN** the CLI SHALL add the message and display a confirmation

#### Scenario: Replying to a non-existent conversation
- **WHEN** the user runs `animo conversations reply 999 --body "test"` and the API returns 404
- **THEN** the CLI SHALL display an error indicating the conversation was not found
