## ADDED Requirements

### Requirement: List modules for a course
The server SHALL expose `GET /api/courses/:courseId/modules` that returns an array of modules for a course.

#### Scenario: List modules
- **WHEN** a client sends `GET /api/courses/123/modules`
- **THEN** the server responds with HTTP 200 and a JSON array of module objects

### Requirement: Get module details
The server SHALL expose `GET /api/courses/:courseId/modules/:moduleId` that returns details for a specific module including its items.

#### Scenario: Valid module
- **WHEN** a client sends `GET /api/courses/123/modules/456`
- **THEN** the server responds with HTTP 200 and the module object with its items included

#### Scenario: Module not found
- **WHEN** a client requests a module that does not exist
- **THEN** the server responds with HTTP 404

### Requirement: List module items
The server SHALL expose `GET /api/courses/:courseId/modules/:moduleId/items` that returns items within a module, supporting an optional `search` query parameter.

#### Scenario: List all items
- **WHEN** a client sends `GET /api/courses/123/modules/456/items`
- **THEN** the server responds with HTTP 200 and a JSON array of module items with content details

#### Scenario: Search items
- **WHEN** a client sends `GET /api/courses/123/modules/456/items?search=quiz`
- **THEN** the server responds with module items whose titles match the search term
