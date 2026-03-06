## ADDED Requirements

### Requirement: Server startup
The server SHALL start an Express HTTP server on a configurable port (default 3000) and host (default 0.0.0.0), reading configuration from CLI flags, environment variables (`ANIMO_PORT`, `ANIMO_HOST`), or the config file.

#### Scenario: Start with default settings
- **WHEN** the user runs `animo-serve` with no flags
- **THEN** the server starts on `0.0.0.0:3000` and logs the listening address

#### Scenario: Start with custom port
- **WHEN** the user runs `animo-serve --port 8080`
- **THEN** the server starts on port 8080

#### Scenario: Missing Canvas config
- **WHEN** the server starts but no Canvas base URL or token is configured
- **THEN** the server exits with an error message explaining how to configure credentials

### Requirement: Health check endpoint
The server SHALL expose `GET /health` that returns HTTP 200 with `{ "status": "ok" }` without requiring authentication.

#### Scenario: Health check succeeds
- **WHEN** a client sends `GET /health`
- **THEN** the server responds with HTTP 200 and body `{ "status": "ok" }`

### Requirement: Bearer token authentication
The server SHALL require a valid `Authorization: Bearer <token>` header on all `/api/*` routes. The expected token is the Canvas API token from the server's configuration.

#### Scenario: Valid token
- **WHEN** a request includes `Authorization: Bearer <valid-token>`
- **THEN** the request proceeds to the route handler

#### Scenario: Missing token
- **WHEN** a request to `/api/*` has no Authorization header
- **THEN** the server responds with HTTP 401 and `{ "error": "Missing authorization header", "status": 401 }`

#### Scenario: Invalid token
- **WHEN** a request includes an incorrect Bearer token
- **THEN** the server responds with HTTP 401 and `{ "error": "Invalid token", "status": 401 }`

### Requirement: Centralized error handling
The server SHALL catch errors from Canvas API calls and return consistent JSON error responses with appropriate HTTP status codes.

#### Scenario: Canvas API returns 404
- **WHEN** a route handler throws a CanvasApiError with status 404
- **THEN** the server responds with HTTP 404 and `{ "error": "<message>", "status": 404 }`

#### Scenario: Unexpected error
- **WHEN** a route handler throws an unexpected error
- **THEN** the server responds with HTTP 500 and `{ "error": "Internal server error", "status": 500 }`

### Requirement: OpenAPI spec endpoint
The server SHALL expose `GET /openapi.json` that returns a valid OpenAPI 3.0 specification describing all API endpoints, without requiring authentication.

#### Scenario: Retrieve OpenAPI spec
- **WHEN** a client sends `GET /openapi.json`
- **THEN** the server responds with HTTP 200 and a JSON body conforming to OpenAPI 3.0, listing all `/api/*` routes with their parameters and response schemas

### Requirement: JSON request and response
The server SHALL parse incoming JSON request bodies and return all responses as `application/json`.

#### Scenario: JSON body parsing
- **WHEN** a POST request includes a JSON body with `Content-Type: application/json`
- **THEN** the server parses the body and makes it available to route handlers

### Requirement: Shared Canvas client
The server SHALL create a single `CanvasClient` instance at startup and share it across all route handlers via `app.locals`.

#### Scenario: Client available in routes
- **WHEN** a route handler accesses the Canvas client
- **THEN** it retrieves the shared instance from `req.app.locals.client`
