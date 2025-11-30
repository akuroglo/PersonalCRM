# Personal CRM Application - Russian Edition

## Overview

Personal CRM system in Russian for managing contacts and AI chat conversations with all data stored in Supabase. Features OpenRouter AI integration with support for 10 popular models including web search capability. Design: ClickUp style (purple theme, modern professional interface).

## User Preferences

Preferred communication style: Simple, everyday language in Russian.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components built on top of Radix UI primitives.

**Styling**: 
- Tailwind CSS with ClickUp-inspired purple theme (268° hue)
- Design system following ClickUp principles: professional clarity, structured information hierarchy
- Custom CSS variables for theming with support for light/dark modes

**State Management**:
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Hook Form with Zod resolver for form state and validation
- Local component state using React hooks

**Routing**: Wouter for lightweight client-side routing.

**Type Safety**: Full TypeScript implementation with strict mode enabled.

### Backend Architecture

**Runtime**: Node.js with Express.js framework.

**API Design**: RESTful API with endpoints for:
- `/api/contacts/*` - Contact management
- `/api/chats/*` - Chat and message operations
- `/api/models` - AI model listings with pricing and capabilities
- `/api/config` - Supabase configuration

**Validation**: Zod schemas for runtime type validation.

**AI Integration**: OpenRouter via Replit AI Integrations with automatic key management.

### Data Storage

**ORM**: Drizzle ORM for type-safe database operations.

**Database**: Supabase PostgreSQL (Session Pooler - port 6543)

**Schema**:
- `users` - Supabase Auth users
- `contacts` - Contact information with reminders
- `chats` - AI conversation threads with cost tracking:
  - `totalCost` (decimal) - Accumulated cost in USD for the chat
  - `totalTokens` (integer) - Total tokens used in the chat
  - `messageCount` (integer) - Number of assistant messages
  - `enableWebSearch` (boolean) - Web search enabled for chat
- `messages` - Chat messages with analytics:
  - `inputTokens`, `outputTokens` (integer) - Token counts per message
  - `costUsd` (decimal) - Cost per message in USD
  - `webSearchUsed` (boolean) - Whether web search was used

### Design System (ClickUp Style)

**Color Scheme**:
- Primary: Purple (268° 100% 45% light / 55% dark)
- Professional, modern aesthetic
- Full light/dark mode support

**Typography**: System font stack with 5-6 font weights

**Components**: Card-based layouts, sidebar navigation, modern form design

## Features Implemented

### Core Features
1. **Contact Management** (CRUD with reminder tracking)
2. **AI Chat System** with multi-model support
3. **Model Selection** with pricing display
4. **Web Search** capability for supported models
5. **Cost Tracking** - Real-time tracking per chat and per message:
   - Each message records input/output tokens and cost
   - Each chat accumulates total cost and tokens
   - Cost displayed in chat list sidebar and header
6. **Analytics Page** (/analytics) - Comprehensive spending overview:
   - Total cost across all chats
   - Total messages and tokens
   - Web search usage count
   - Cost breakdown by AI model

### AI Models Available (Top 10)
1. **GPT-4o** ($5 input / $15 output) - OpenAI, most capable
2. **Claude 3.5 Sonnet** ($3 / $15) - Anthropic, excellent reasoning
3. **GPT-4o Mini** ($0.15 / $0.60) - OpenAI, fast & efficient
4. **Gemini 2.0 Flash** ($0.075 / $0.30) - Google, very fast
5. **Claude 3 Haiku** ($0.25 / $1.25) - Anthropic, budget-friendly
6. **Llama 3.3 70B** ($0.65 / $2.60) - Meta, open-source
7. **Mistral Large** ($2.7 / $8.1) - Mistral AI, strong reasoning
8. **DeepSeek Chat** (Free) - DeepSeek, cost-effective
9. **Qwen 2.5 72B** ($0.65 / $2.60) - Alibaba, multilingual
10. **Gemini 1.5 Flash** ($0.075 / $0.30) - Google, large context

### Web Search Feature
- Available on all 10 models via `:online` suffix
- Engine: Exa or native provider search
- Cost: $4 per 1,000 results (~$0.02 per request with default 5 results)
- Checkbox toggle in chat creation dialog

### Authentication
- Supabase Auth with email/password
- Multi-user support with userId isolation
- Password recovery via email
- Session persistence

### UI Features
- Sidebar navigation with collapsible chat list
- Model selection dropdown with pricing display
- Input/Output token pricing shown in USD/1M tokens
- Context window information
- Web search toggle when supported
- Modern ClickUp-style interface with purple accent

## API Endpoints

### Models
- `GET /api/models` - Returns all 10 models with pricing, provider, capabilities

### Contacts
- `GET /api/contacts` - List all user contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Chats
- `GET /api/chats` - List all chats (includes totalCost, totalTokens, messageCount)
- `POST /api/chats` - Create chat (requires model selection)
- `GET /api/chats/:id` - Get chat with messages
- `DELETE /api/chats/:id` - Delete chat
- `POST /api/chats/:id/messages` - Send message and get AI response (records cost/tokens)

### Analytics
- `GET /api/analytics` - User's spending analytics (totalCostUsd, totalMessages, totalTokens, webSearchCount, costByModel)

## External Dependencies

**Database**: Supabase PostgreSQL with Neon-backed connection pooling

**AI Service**: 
- OpenRouter via Replit AI Integrations
- Automatic API key management
- Billing through Replit credits
- No data used for training (privacy-first)

**UI**: Radix UI primitives, Lucide React icons

**Forms**: React Hook Form + Zod validation

## Recent Changes (Latest Session)

1. **Migrated to ClickUp Design**: Updated color scheme from blue (211°) to purple (268°) theme
2. **Added Top 10 Models**: Implemented list of most popular OpenRouter models with real pricing
3. **Web Search Integration**: Added checkbox toggle for web search capability (+$0.02 per request)
4. **Pricing Display**: Shows input/output costs per 1M tokens in model selection
5. **Model Details**: Display provider, description, context window size
6. **Comprehensive Cost Tracking**: 
   - Messages store inputTokens, outputTokens, costUsd, webSearchUsed
   - Chats accumulate totalCost, totalTokens, messageCount
   - Cost displayed in sidebar next to each chat
   - Cost displayed in chat header
7. **Analytics Page**: Full spending analytics at /analytics with model breakdown
8. **Console Logging**: Backend logs each AI request with model, tokens, cost for debugging

## Technical Stack Summary

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js + TypeScript
- **Database**: Supabase PostgreSQL (Drizzle ORM)
- **Authentication**: Supabase Auth
- **AI**: OpenRouter (10 models) via Replit Integrations
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: TanStack Query + React Hooks
- **Routing**: Wouter
- **Validation**: Zod
- **Icons**: Lucide React

## Deployment

- Replit (single deployment)
- PostgreSQL: Supabase (Session Pooler)
- AI API: OpenRouter through Replit
- All data encrypted and user-scoped

## Future Enhancement Ideas

- Advanced model comparison in UI
- Chat history export
- Model recommendation based on task type
- Streaming responses with real-time display
- File upload support for documents
- Custom system prompts per chat
- Daily/weekly cost limits and alerts
- Cost prediction before sending message
