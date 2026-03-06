## ADDED Requirements

### Requirement: Create Canvas Telegram Bot workflow in n8n
The system SHALL create a new n8n workflow named "Canvas Telegram Bot" via the n8n MCP that contains a Telegram trigger node, an AI agent node, and HTTP Request tool nodes for every REST API endpoint.

#### Scenario: Workflow creation
- **WHEN** the setup task is executed via the n8n MCP
- **THEN** a new workflow named "Canvas Telegram Bot" is created in the n8n instance

### Requirement: Telegram trigger node
The workflow SHALL include a Telegram Trigger node that listens for incoming messages and passes them to the AI agent.

#### Scenario: Receive Telegram message
- **WHEN** a user sends a message to the Telegram bot
- **THEN** the Telegram Trigger node fires and passes the message text to the AI agent node

### Requirement: AI agent node
The workflow SHALL include an AI Agent node configured with all Canvas REST API endpoints as available tools, enabling the agent to interpret user messages and call the appropriate endpoints.

#### Scenario: Agent processes query
- **WHEN** the AI agent receives a message like "what are my upcoming assignments"
- **THEN** the agent selects the appropriate Canvas API tool and returns the result

### Requirement: Course tools
The workflow SHALL include HTTP Request tool nodes for: list courses, get course details, and list favorite courses.

#### Scenario: List courses tool
- **WHEN** the AI agent invokes the list courses tool
- **THEN** an HTTP Request is sent to `GET /api/courses` on the animo-serve server

### Requirement: Assignment tools
The workflow SHALL include HTTP Request tool nodes for: list assignments for a course, get assignment details, and list upcoming assignments.

#### Scenario: List upcoming assignments tool
- **WHEN** the AI agent invokes the upcoming assignments tool
- **THEN** an HTTP Request is sent to `GET /api/assignments/upcoming` on the animo-serve server

### Requirement: Submission tools
The workflow SHALL include HTTP Request tool nodes for: list submissions, get own submission, and create a submission.

#### Scenario: Create submission tool
- **WHEN** the AI agent invokes the create submission tool
- **THEN** an HTTP POST is sent to `/api/courses/{courseId}/assignments/{assignmentId}/submissions`

### Requirement: Planner tools
The workflow SHALL include HTTP Request tool nodes for: today's planner items, this week's items, and custom date range planner items.

#### Scenario: Today's planner tool
- **WHEN** the AI agent invokes the today's planner tool
- **THEN** an HTTP Request is sent to `GET /api/planner/today`

### Requirement: Calendar tools
The workflow SHALL include HTTP Request tool nodes for: list calendar events and get calendar event details.

#### Scenario: List calendar events tool
- **WHEN** the AI agent invokes the list calendar events tool
- **THEN** an HTTP Request is sent to `GET /api/calendar`

### Requirement: Grade tools
The workflow SHALL include HTTP Request tool nodes for: list all grades and get grades for a specific course.

#### Scenario: List all grades tool
- **WHEN** the AI agent invokes the list grades tool
- **THEN** an HTTP Request is sent to `GET /api/grades`

### Requirement: Module tools
The workflow SHALL include HTTP Request tool nodes for: list modules, get module details, and list module items.

#### Scenario: List module items tool
- **WHEN** the AI agent invokes the module items tool
- **THEN** an HTTP Request is sent to `GET /api/courses/{courseId}/modules/{moduleId}/items`

### Requirement: Announcement tools
The workflow SHALL include HTTP Request tool nodes for: list announcements and get announcement details.

#### Scenario: List announcements tool
- **WHEN** the AI agent invokes the list announcements tool
- **THEN** an HTTP Request is sent to `GET /api/announcements`

### Requirement: Conversation tools
The workflow SHALL include HTTP Request tool nodes for: list conversations, get conversation, send new conversation, and reply to conversation.

#### Scenario: Send conversation tool
- **WHEN** the AI agent invokes the send conversation tool
- **THEN** an HTTP POST is sent to `/api/conversations`

### Requirement: User tools
The workflow SHALL include HTTP Request tool nodes for: get user profile, list todos, and list upcoming events.

#### Scenario: Get profile tool
- **WHEN** the AI agent invokes the get profile tool
- **THEN** an HTTP Request is sent to `GET /api/user/profile`

### Requirement: Bearer token authentication on all tools
All HTTP Request tool nodes SHALL include the `Authorization: Bearer <token>` header using the configured animo-serve token.

#### Scenario: Authenticated request
- **WHEN** any HTTP Request tool node sends a request to the animo-serve server
- **THEN** the request includes the Bearer token in the Authorization header
