# Personal CRM Application

## Overview

This is a Personal CRM (Customer Relationship Management) application designed to help users manage their contacts and set reminders for maintaining relationships. The application features a clean, minimalist interface inspired by Apple's Human Interface Guidelines, focusing on productivity and usability. Users can add contacts with details like names, birthdays, and custom reminder intervals, then track when to reach out to maintain connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable components following the "new-york" style variant.

**Styling**: 
- Tailwind CSS for utility-first styling with custom theme extensions
- Design system following Apple Human Interface Guidelines emphasizing clarity, minimalism, and content-first hierarchy
- Custom CSS variables for theming with support for light/dark modes
- System font stack prioritizing native platform fonts

**State Management**:
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Hook Form with Zod resolver for form state and validation
- Local component state using React hooks

**Routing**: Wouter for lightweight client-side routing.

**Type Safety**: Full TypeScript implementation with strict mode enabled, shared types between frontend and backend via the `@shared` directory.

### Backend Architecture

**Runtime**: Node.js with Express.js framework.

**API Design**: RESTful API with the following endpoints:
- `GET /api/contacts` - Retrieve all contacts
- `GET /api/contacts/:id` - Retrieve single contact
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update existing contact
- `DELETE /api/contacts/:id` - Delete contact

**Validation**: Zod schemas for runtime type validation and data parsing, shared between client and server.

**Development vs Production**:
- Development mode uses Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets from the `dist/public` directory
- Separate entry points (`index-dev.ts` and `index-prod.ts`) for different environments

### Data Storage

**ORM**: Drizzle ORM for type-safe database operations.

**Database Schema**: PostgreSQL with a single `contacts` table containing:
- `id` - UUID primary key (auto-generated)
- `name` - Text field for contact name (required)
- `birthday` - Date field for birthday (optional)
- `last_contact` - Date field for last interaction (required)
- `reminder_interval` - Integer field for days between reminders (required)

**Database Access Pattern**: Repository pattern implemented via the `DbStorage` class, providing an interface (`IStorage`) for data operations and abstracting database implementation details.

### Design System

**Visual Hierarchy**:
- Typography scale from 13px captions to 32px page titles
- System font stack for native platform feel
- Generous whitespace with Tailwind spacing units (2, 3, 4, 6, 8, 12)
- Maximum content width of `max-w-6xl` for readability

**Component Patterns**:
- Card-based layouts with rounded corners (`rounded-xl`)
- Elevation through subtle shadows and borders
- Hover and active states for interactive feedback
- Responsive design considerations with mobile breakpoint at 768px

**Color System**:
- HSL-based color tokens supporting both light and dark themes
- CSS custom properties for runtime theming
- Semantic color naming (primary, secondary, muted, accent, destructive)
- Outline borders using alpha-based transparency

### External Dependencies

**Database Service**: 
- Neon Serverless PostgreSQL via `@neondatabase/serverless` package
- Connection pooling for efficient database access
- Configured via `DATABASE_URL` environment variable

**UI Component Libraries**:
- Radix UI primitives for accessible component foundations (dialogs, dropdowns, popovers, etc.)
- Lucide React for consistent iconography
- date-fns for date manipulation and formatting with Russian locale support

**Development Tools**:
- Replit-specific plugins for development (cartographer, dev banner, runtime error overlay)
- Drizzle Kit for database migrations
- ESBuild for production bundling
- PostCSS with Autoprefixer for CSS processing

**Form Handling**:
- React Hook Form for performant form state management
- Hookform Resolvers for integrating Zod validation schemas

**Quality Assurance**:
- TypeScript for compile-time type checking
- Zod for runtime validation
- Shared schema definitions ensuring type consistency across the stack