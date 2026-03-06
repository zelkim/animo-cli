## ADDED Requirements

### Requirement: List conversations
The server SHALL expose `GET /api/conversations` that returns an array of conversations, supporting an optional `scope` query parameter (`inbox`, `unread`, `archived`, `sent`).

#### Scenario: List all conversations
- **WHEN** a client sends `GET /api/conversations`
- **THEN** the server responds with HTTP 200 and a JSON array of conversation objects

#### Scenario: Filter by scope
- **WHEN** a client sends `GET /api/conversations?scope=unread`
- **THEN** the server responds with only conversations matching the specified scope

### Requirement: Get conversation details
The server SHALL expose `GET /api/conversations/:conversationId` that returns a conversation with its messages.

#### Scenario: Valid conversation
- **WHEN** a client sends `GET /api/conversations/123`
- **THEN** the server responds with HTTP 200 and the conversation object including all messages

#### Scenario: Conversation not found
- **WHEN** a client requests a conversation that does not exist
- **THEN** the server responds with HTTP 404

### Requirement: Send a new conversation
The server SHALL expose `POST /api/conversations` that creates a new conversation. The request body MUST include `recipients` (array of user IDs) and `body` (message text), and optionally `subject` and `course`.

#### Scenario: Send with required fields
- **WHEN** a client sends POST with `{ "recipients": ["456"], "body": "Hello" }`
- **THEN** the server creates the conversation and responds with HTTP 201 and the conversation object

#### Scenario: Send with all fields
- **WHEN** a client sends POST with `{ "recipients": ["456"], "body": "Hello", "subject": "Question", "course": "123" }`
- **THEN** the server creates the conversation with the course context code `course_123`

#### Scenario: Missing required fields
- **WHEN** a client sends POST without `recipients` or `body`
- **THEN** the server responds with HTTP 400 and an error message

### Requirement: Reply to a conversation
The server SHALL expose `POST /api/conversations/:conversationId/reply` that adds a message to an existing conversation. The request body MUST include `body`.

#### Scenario: Reply to conversation
- **WHEN** a client sends POST to `/api/conversations/123/reply` with `{ "body": "Thanks!" }`
- **THEN** the server adds the message and responds with HTTP 201

#### Scenario: Missing body
- **WHEN** a client sends POST without `body`
- **THEN** the server responds with HTTP 400
