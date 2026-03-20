# Tech Context: Chatbot

## Technologies Used

### Core Framework
- **Next.js 16.0.10**: Latest React framework with App Router
- **React 19.0.1**: Latest React version with enhanced features
- **TypeScript 5.6.3**: Strict type checking enabled
- **Node.js**: Server runtime (implied by Next.js)

### Package Management
- **pnpm 9.12.3**: Fast, disk space efficient package manager
- **Lock Files**: Both `pnpm-lock.yaml` and `bun.lock` present (bun.lock likely from template)

### UI & Styling
- **Tailwind CSS 4.1.13**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Framer Motion / Motion**: Animation library
- **Geist**: Font family

### AI Integration
- **Vercel AI SDK 6.0.37**: Unified API for AI providers
- **@ai-sdk/gateway 3.0.15**: AI Gateway integration
- **@ai-sdk/openai 3.0.41**: OpenAI provider
- **@ai-sdk/react 3.0.39**: React hooks for AI

### Database & ORM
- **Drizzle ORM 0.34.0**: TypeScript ORM
- **Neon Serverless Postgres**: PostgreSQL database
- **postgres 3.4.4**: PostgreSQL client

### Authentication
- **Auth.js 5.0.0-beta.25**: Authentication library (NextAuth v5)
- **bcrypt-ts**: Password hashing

### Storage
- **Vercel Blob 0.24.1**: File storage service

### Code Editors
- **CodeMirror 6**: Code editor for artifacts
  - @codemirror/lang-javascript
  - @codemirror/lang-python
  - @codemirror/theme-one-dark

### Rich Text Editing
- **ProseMirror**: Rich text editor framework
  - prosemirror-model
  - prosemirror-state
  - prosemirror-view
  - prosemirror-markdown
  - prosemirror-example-setup

### Data Visualization
- **@xyflow/react 12.10.0**: Flow diagram library
- **react-data-grid 7.0.0-beta.47**: Spreadsheet/grid component
- **Katex 0.16.25**: Math rendering

### Utilities
- **date-fns 4.1.0**: Date utilities
- **nanoid 5.1.3**: ID generation
- **zod 3.25.76**: Schema validation
- **fast-deep-equal**: Deep equality checking
- **papaparse 5.5.2**: CSV parsing

### Development Tools
- **Biome 2.3.11**: Fast formatter and linter (via ultracite)
- **ultracite 7.0.11**: Biome configuration wrapper
- **Playwright 1.50.1**: E2E testing framework
- **Changesets**: Version management and changelogs
- **tsx**: TypeScript execution

### Monitoring & Analytics
- **@vercel/analytics 1.3.1**: Analytics tracking
- **@vercel/otel 1.12.0**: OpenTelemetry integration
- **@opentelemetry/api**: Distributed tracing

### Other Dependencies
- **sonner**: Toast notifications
- **swr**: Data fetching
- **cmdk**: Command palette
- **embla-carousel-react**: Carousel component
- **react-resizable-panels**: Resizable panel layouts
- **shiki 3.21.0**: Syntax highlighting
- **streamdown**: Markdown streaming
- **botid**: Bot detection
- **resumable-stream**: Resumable streaming
- **redis 5.0.0**: Caching (optional)

## Development Setup

### Prerequisites
```bash
# Required
- Node.js (implied by Next.js)
- pnpm 9.12.3
- PostgreSQL database (Neon)

# Optional
- Vercel CLI (for deployment)
- Redis (for caching)
```

### Environment Variables
Required in `.env.local`:
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# AI Gateway (non-Vercel deployments)
AI_GATEWAY_API_KEY=...

# Storage
BLOB_READ_WRITE_TOKEN=...

# Optional providers
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_API_KEY=...
```

### Installation & Running
```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:migrate

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Available Scripts
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - Run ultracite linter
- `pnpm fix` - Fix code with ultracite
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:push` - Push schema changes
- `pnpm db:pull` - Pull schema from database
- `pnpm test` - Run Playwright tests

### Code Quality Tools
- **Biome/Ultracite**: Fast formatting and linting
- **TypeScript**: Strict type checking
- **Playwright**: E2E testing

## Technical Constraints

### Framework Constraints
1. **Next.js 16 App Router**
   - Must use Server Components by default
   - Client Components require `'use client'` directive
   - Server Actions require `'use server'` directive
   - File-based routing with specific conventions

2. **React 19**
   - Newer version with potential breaking changes
   - Enhanced Server Components support
   - Improved concurrent features

3. **TypeScript 5.6**
   - Strict mode enabled
   - Must follow strict type checking rules
   - No `any` types allowed (per ultracite rules)

### Performance Constraints
1. **Bundle Size**
   - Optimize for Core Web Vitals
   - Use dynamic imports for heavy components
   - Lazy load artifacts and editors

2. **Streaming Requirements**
   - AI responses must stream
   - UI must update progressively
   - Handle streaming errors gracefully

3. **Database Performance**
   - Use connection pooling
   - Optimize queries with indexes
   - Cache frequently accessed data

### Security Constraints
1. **Authentication**
   - All routes protected by default
   - Session-based authentication
   - CSRF protection enabled

2. **Data Validation**
   - Validate all user inputs
   - Sanitize data before storage
   - Use Zod for schema validation

3. **Environment Variables**
   - Never commit secrets to git
   - Use `.env.local` for local development
   - Use Vercel environment variables for production

### Accessibility Constraints
1. **WCAG Compliance**
   - Must meet WCAG 2.1 AA standards
   - Keyboard navigation support
   - Screen reader compatibility
   - High contrast themes

2. **Component Accessibility**
   - Use semantic HTML
   - ARIA attributes where needed
   - Focus management
   - Color contrast requirements

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No IE11 support

## Tool Usage Patterns

### Development Workflow
1. **Code Editing**
   - VS Code as primary editor
   - Biome for formatting on save
   - TypeScript for type checking

2. **Testing**
   - Playwright for E2E tests
   - Tests in `tests/` directory
   - Run with `pnpm test`

3. **Database Management**
   - Drizzle Kit for migrations
   - Drizzle Studio for data viewing
   - Manual SQL when needed

4. **Deployment**
   - Vercel for hosting
   - Automatic deployments from git
   - Preview deployments for PRs

### Code Organization
```
app/                    # Next.js App Router
├── (auth)/            # Authentication routes
├── (chat)/            # Chat routes
└── api/               # API routes

components/            # React components
├── ui/               # Base UI components
├── ai-elements/      # AI-specific components
└── elements/         # Reusable elements

lib/                   # Shared utilities
├── ai/               # AI integration
├── db/               # Database utilities
└── editor/           # Editor utilities

artifacts/             # Artifact handlers
├── text/             # Text artifacts
├── code/             # Code artifacts
├── image/            # Image artifacts
└── sheet/            # Spreadsheet artifacts

tests/                 # Test files
├── e2e/              # E2E tests
└── pages/            # Page objects
```

### Naming Conventions
- **Files**: kebab-case (e.g., `chat-header.tsx`)
- **Components**: PascalCase (e.g., `ChatHeader`)
- **Functions**: camelCase (e.g., `handleSendMessage`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_MESSAGES`)
- **Types**: PascalCase (e.g., `ChatMessage`)
- **Interfaces**: PascalCase with `I` prefix optional

### Import Patterns
```typescript
// External libraries
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

// Internal modules
import { Button } from '@/components/ui/button';
import { auth } from '@/app/(auth)/auth';

// Types
import type { Chat, Message } from '@/lib/types';
```

## Dependencies Summary

### Production Dependencies (68 packages)
- Core: Next.js, React, TypeScript
- AI: AI SDK, OpenAI, Anthropic, Google providers
- UI: shadcn/ui, Radix UI, Tailwind CSS, Framer Motion
- Database: Drizzle ORM, postgres, Neon
- Auth: Auth.js, bcrypt-ts
- Storage: Vercel Blob
- Editors: CodeMirror, ProseMirror
- Utilities: date-fns, nanoid, zod, etc.

### Development Dependencies (12 packages)
- Linting: Biome, ultracite
- Testing: Playwright
- Build: tsx, postcss, tailwindcss
- Versioning: Changesets
- Types: TypeScript, @types/*

---

*This tech stack enables rapid development of production-ready AI chatbot applications with excellent performance, accessibility, and developer experience.*