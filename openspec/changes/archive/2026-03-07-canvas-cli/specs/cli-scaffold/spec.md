## ADDED Requirements

### Requirement: CLI entry point and binary registration

The system SHALL provide a `bin` entry in `package.json` that registers the `animo` command. The entry point SHALL include a `#!/usr/bin/env node` shebang and import Commander.js to define the root program.

#### Scenario: Running the CLI without arguments
- **WHEN** the user runs `animo` with no arguments
- **THEN** the CLI SHALL print the help text showing all available command groups and global options

#### Scenario: Running with --version
- **WHEN** the user runs `animo --version`
- **THEN** the CLI SHALL print the current package version from `package.json`

#### Scenario: Running with --help
- **WHEN** the user runs `animo --help`
- **THEN** the CLI SHALL print usage information including all registered command groups and global option descriptions

### Requirement: Global options

The root command SHALL accept the following global options inherited by all subcommands:

- `--base-url <url>`: Canvas instance base URL
- `--token <token>`: Canvas API access token
- `--json`: Output in JSON format instead of table format
- `--limit <n>`: Maximum number of items to return for list commands
- `--per-page <n>`: Number of items per API page (default: 50)

#### Scenario: Passing global options
- **WHEN** the user runs `animo courses list --base-url https://school.instructure.com --token abc123 --json`
- **THEN** the CLI SHALL use the provided base URL and token for the API client and output the result as JSON

#### Scenario: Global options inherited by subcommands
- **WHEN** the user runs `animo --json courses list`
- **THEN** the `--json` flag SHALL be available to the `courses list` action handler

### Requirement: Configuration resolution

The CLI SHALL resolve `baseUrl` and `token` using a three-tier precedence order: CLI flags (highest) → environment variables → config file (lowest).

Environment variables:
- `CANVAS_BASE_URL` for the Canvas instance URL
- `CANVAS_TOKEN` for the access token

Config file: `~/.animorc.json` containing `{ "baseUrl": "...", "token": "..." }`.

#### Scenario: CLI flags override environment variables
- **WHEN** the user sets `CANVAS_BASE_URL=https://env.example.com` and runs `animo --base-url https://flag.example.com courses list`
- **THEN** the CLI SHALL use `https://flag.example.com` as the base URL

#### Scenario: Environment variables override config file
- **WHEN** the config file contains `{ "baseUrl": "https://file.example.com" }` and `CANVAS_BASE_URL=https://env.example.com` is set
- **THEN** the CLI SHALL use `https://env.example.com` as the base URL

#### Scenario: Config file used as fallback
- **WHEN** no CLI flags or environment variables are set and `~/.animorc.json` contains `{ "baseUrl": "https://file.example.com", "token": "tok" }`
- **THEN** the CLI SHALL use the values from the config file

#### Scenario: Missing required configuration
- **WHEN** neither flags, environment variables, nor config file provide `baseUrl` or `token`
- **THEN** the CLI SHALL print an error message indicating which configuration value is missing and exit with code 1

### Requirement: CanvasClient factory

The CLI SHALL create a `CanvasClient` instance from the resolved configuration. A shared factory function SHALL accept the resolved `baseUrl` and `token` and return a configured `CanvasClient` from the `canvas-student-api` package.

#### Scenario: Client creation with resolved config
- **WHEN** configuration resolves to `baseUrl: "https://school.instructure.com"` and `token: "abc"`
- **THEN** the factory SHALL return a `CanvasClient` configured with those values and the resolved `perPage` option

### Requirement: Error handling

The CLI SHALL catch errors at the top-level command action and print formatted error messages. `CanvasApiError` instances from the SDK SHALL display the HTTP status, request URL, and error body. Other errors SHALL display their message. The process SHALL exit with code 1 on any error.

#### Scenario: API error display
- **WHEN** an API call throws a `CanvasApiError` with status 401
- **THEN** the CLI SHALL print a message containing the status code, URL, and error body, and exit with code 1

#### Scenario: Network error display
- **WHEN** an API call fails due to a network error (e.g., DNS resolution failure)
- **THEN** the CLI SHALL print the error message and exit with code 1

#### Scenario: Missing config error
- **WHEN** the CLI cannot resolve a required config value
- **THEN** the CLI SHALL print which value is missing and suggest how to set it (env var, flag, or config file)
