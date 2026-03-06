# n8n Canvas LMS Telegram AI Agent

Importable n8n workflow that creates a Telegram bot powered by an AI agent with all Animo Canvas API endpoints attached as tools.

## What's included

**`canvas-agent.json`** — A complete n8n workflow with:
- **Telegram Trigger** — Listens for incoming Telegram messages
- **AI Agent** (Tools Agent) — Orchestrator with a system prompt tuned for Canvas LMS queries
- **Send Telegram Reply** — Sends the agent's response back to the user
- **OpenAI Chat Model** — LLM backend (swap for Anthropic, Gemini, etc.)
- **Conversation Memory** — Window buffer memory keyed by Telegram chat ID (keeps last 20 messages)
- **29 HTTP Request Tools** — One per API endpoint covering:
  - Courses (list, favorites, details)
  - Assignments (list, details, upcoming across all courses)
  - Submissions (list, get own, create)
  - Planner (today, week, custom range)
  - Calendar (events, details)
  - Grades (summary, per-course)
  - Modules (list, details, items)
  - Announcements (list, details)
  - Conversations (list, read, send, reply)
  - User (profile, todos, upcoming)

All tool URLs point to `https://animocli.zel.kim`.

## Setup

### 1. Import the workflow

In n8n: **Menu (⋯)** → **Import from File** → select `canvas-agent.json`

### 2. Create a Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Copy the bot token BotFather gives you

### 3. Create credentials

#### Telegram Bot
- **Name**: `Telegram Bot`
- **Access Token**: Paste the bot token from BotFather

#### Animo API Token (Header Auth)
- **Name**: `Animo API Token`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer <your-token>`

The token is the same one your animo-serve uses (from your `.env` file's auth middleware).

#### OpenAI API Key
- **Name**: `OpenAI API`
- Configure with your OpenAI API key

### 4. Assign credentials

After import, open each node and select the matching credential:
- **Telegram Trigger** + **Send Telegram Reply** → `Telegram Bot`
- **All HTTP Request Tool nodes** → `Animo API Token`
- **OpenAI Chat Model** → `OpenAI API`

### 5. Activate and message your bot

Toggle the workflow active. Open Telegram and message your bot. Try:
- "What courses am I enrolled in?"
- "What assignments are due this week?"
- "Show me my grades"
- "Any new announcements?"
- "What's on my planner today?"

The bot remembers conversation context within each chat (up to 20 messages).

## Swapping the LLM

Replace the OpenAI Chat Model node with any supported LLM node:
- `@n8n/n8n-nodes-langchain.lmChatAnthropic` (Claude)
- `@n8n/n8n-nodes-langchain.lmChatGoogleGemini` (Gemini)
- `@n8n/n8n-nodes-langchain.lmChatGroq` (Groq)
- `@n8n/n8n-nodes-langchain.lmChatOllama` (Local Ollama)

Connect the replacement to the Canvas Agent's `ai_languageModel` input.
