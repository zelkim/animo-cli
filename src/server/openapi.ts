export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Animo Canvas API',
    description: 'REST API exposing Canvas LMS student capabilities',
    version: '0.1.0',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local server' }],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http' as const,
        scheme: 'bearer',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        security: [],
        responses: { '200': { description: 'Server is healthy' } },
      },
    },
    '/api/courses': {
      get: {
        summary: 'List enrolled courses',
        tags: ['Courses'],
        responses: { '200': { description: 'Array of course objects' } },
      },
    },
    '/api/courses/favorites': {
      get: {
        summary: 'List favorite courses',
        tags: ['Courses'],
        responses: { '200': { description: 'Array of favorite course objects' } },
      },
    },
    '/api/courses/{courseId}': {
      get: {
        summary: 'Get course details',
        tags: ['Courses'],
        parameters: [{ name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Course object' }, '404': { description: 'Not found' } },
      },
    },
    '/api/courses/{courseId}/assignments': {
      get: {
        summary: 'List assignments for a course',
        tags: ['Assignments'],
        parameters: [
          { name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'bucket', in: 'query' as const, schema: { type: 'string', enum: ['past', 'overdue', 'undated', 'ungraded', 'unsubmitted', 'upcoming', 'future'] } },
          { name: 'search', in: 'query' as const, schema: { type: 'string' } },
          { name: 'orderBy', in: 'query' as const, schema: { type: 'string', enum: ['name', 'due_at', 'position'] } },
        ],
        responses: { '200': { description: 'Array of assignment objects' } },
      },
    },
    '/api/courses/{courseId}/assignments/{assignmentId}': {
      get: {
        summary: 'Get assignment details',
        tags: ['Assignments'],
        parameters: [
          { name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'assignmentId', in: 'path' as const, required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Assignment object' }, '404': { description: 'Not found' } },
      },
    },
    '/api/assignments/upcoming': {
      get: {
        summary: 'List upcoming assignments across all courses',
        tags: ['Assignments'],
        responses: { '200': { description: 'Array of upcoming assignment objects' } },
      },
    },
    '/api/courses/{courseId}/assignments/{assignmentId}/submissions': {
      get: {
        summary: 'List submissions for an assignment',
        tags: ['Submissions'],
        parameters: [
          { name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'assignmentId', in: 'path' as const, required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Array of submission objects' } },
      },
      post: {
        summary: 'Create a submission',
        tags: ['Submissions'],
        parameters: [
          { name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'assignmentId', in: 'path' as const, required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['submissionType'],
                properties: {
                  submissionType: { type: 'string', enum: ['online_text_entry', 'online_url'] },
                  body: { type: 'string' },
                  url: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Created submission' }, '400': { description: 'Missing submissionType' } },
      },
    },
    '/api/courses/{courseId}/assignments/{assignmentId}/submissions/self': {
      get: {
        summary: 'Get your submission for an assignment',
        tags: ['Submissions'],
        parameters: [
          { name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'assignmentId', in: 'path' as const, required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Submission object' }, '404': { description: 'Not found' } },
      },
    },
    '/api/planner/today': {
      get: {
        summary: "List today's planner items",
        tags: ['Planner'],
        responses: { '200': { description: 'Array of planner items' } },
      },
    },
    '/api/planner/week': {
      get: {
        summary: "List this week's planner items",
        tags: ['Planner'],
        responses: { '200': { description: 'Array of planner items' } },
      },
    },
    '/api/planner': {
      get: {
        summary: 'List planner items for a date range',
        tags: ['Planner'],
        parameters: [
          { name: 'start', in: 'query' as const, schema: { type: 'string', format: 'date' }, description: 'Start date (default: today)' },
          { name: 'end', in: 'query' as const, schema: { type: 'string', format: 'date' }, description: 'End date (default: 7 days from start)' },
        ],
        responses: { '200': { description: 'Array of planner items' } },
      },
    },
    '/api/calendar': {
      get: {
        summary: 'List calendar events',
        tags: ['Calendar'],
        parameters: [
          { name: 'start', in: 'query' as const, schema: { type: 'string', format: 'date' }, description: 'Start date (default: today)' },
          { name: 'end', in: 'query' as const, schema: { type: 'string', format: 'date' }, description: 'End date (default: 14 days from start)' },
          { name: 'type', in: 'query' as const, schema: { type: 'string', enum: ['event', 'assignment'] } },
          { name: 'context', in: 'query' as const, schema: { type: 'string' }, description: 'Context code (e.g., course_123)' },
        ],
        responses: { '200': { description: 'Array of calendar events' } },
      },
    },
    '/api/calendar/{eventId}': {
      get: {
        summary: 'Get calendar event details',
        tags: ['Calendar'],
        parameters: [{ name: 'eventId', in: 'path' as const, required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Calendar event object' }, '404': { description: 'Not found' } },
      },
    },
    '/api/grades': {
      get: {
        summary: 'List grade summary across all courses',
        tags: ['Grades'],
        responses: { '200': { description: 'Array of grade summary objects' } },
      },
    },
    '/api/grades/{courseId}': {
      get: {
        summary: 'List assignment groups with grades for a course',
        tags: ['Grades'],
        parameters: [{ name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Array of assignment group objects' }, '404': { description: 'Not found' } },
      },
    },
    '/api/courses/{courseId}/modules': {
      get: {
        summary: 'List modules for a course',
        tags: ['Modules'],
        parameters: [{ name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Array of module objects' } },
      },
    },
    '/api/courses/{courseId}/modules/{moduleId}': {
      get: {
        summary: 'Get module details',
        tags: ['Modules'],
        parameters: [
          { name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'moduleId', in: 'path' as const, required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Module object with items' }, '404': { description: 'Not found' } },
      },
    },
    '/api/courses/{courseId}/modules/{moduleId}/items': {
      get: {
        summary: 'List module items',
        tags: ['Modules'],
        parameters: [
          { name: 'courseId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'moduleId', in: 'path' as const, required: true, schema: { type: 'string' } },
          { name: 'search', in: 'query' as const, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Array of module item objects' } },
      },
    },
    '/api/announcements': {
      get: {
        summary: 'List announcements',
        tags: ['Announcements'],
        parameters: [{ name: 'course', in: 'query' as const, schema: { type: 'string' }, description: 'Course ID to filter by' }],
        responses: { '200': { description: 'Array of announcement objects' } },
      },
    },
    '/api/announcements/{notificationId}': {
      get: {
        summary: 'Get announcement details',
        tags: ['Announcements'],
        parameters: [{ name: 'notificationId', in: 'path' as const, required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Notification object' }, '404': { description: 'Not found' } },
      },
    },
    '/api/conversations': {
      get: {
        summary: 'List conversations',
        tags: ['Conversations'],
        parameters: [{ name: 'scope', in: 'query' as const, schema: { type: 'string', enum: ['inbox', 'unread', 'archived', 'sent'] } }],
        responses: { '200': { description: 'Array of conversation objects' } },
      },
      post: {
        summary: 'Send a new conversation',
        tags: ['Conversations'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['recipients', 'body'],
                properties: {
                  recipients: { type: 'array', items: { type: 'string' }, description: 'Recipient user IDs' },
                  body: { type: 'string', description: 'Message body' },
                  subject: { type: 'string' },
                  course: { type: 'string', description: 'Course ID for context' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Created conversation' }, '400': { description: 'Missing required fields' } },
      },
    },
    '/api/conversations/{conversationId}': {
      get: {
        summary: 'Get conversation with messages',
        tags: ['Conversations'],
        parameters: [{ name: 'conversationId', in: 'path' as const, required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Conversation with messages' }, '404': { description: 'Not found' } },
      },
    },
    '/api/conversations/{conversationId}/reply': {
      post: {
        summary: 'Reply to a conversation',
        tags: ['Conversations'],
        parameters: [{ name: 'conversationId', in: 'path' as const, required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['body'],
                properties: { body: { type: 'string' } },
              },
            },
          },
        },
        responses: { '201': { description: 'Reply sent' }, '400': { description: 'Missing body' } },
      },
    },
    '/api/user/profile': {
      get: {
        summary: 'Get user profile',
        tags: ['User'],
        responses: { '200': { description: 'User profile object' } },
      },
    },
    '/api/user/todos': {
      get: {
        summary: 'List pending todo items',
        tags: ['User'],
        responses: { '200': { description: 'Array of todo items' } },
      },
    },
    '/api/user/upcoming': {
      get: {
        summary: 'List upcoming events',
        tags: ['User'],
        responses: { '200': { description: 'Array of upcoming event objects' } },
      },
    },
  },
};
