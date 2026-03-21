# Active Context: Deep AI

## Current Work Focus

### Initial Setup Phase
- **Date**: March 19, 2026
- **Status**: Setting up Memory Bank documentation system
- **Priority**: High - Establishing project context for future work

### Active Tasks
1. **Memory Bank Creation** (In Progress)
   - Creating core documentation files
   - Establishing project context
   - Documenting architecture and patterns

### Recent Changes
- **March 19, 2026**: Created memory-bank directory structure
- **March 19, 2026**: Added projectbrief.md - Foundation document defining project scope
- **March 19, 2026**: Added productContext.md - User experience and product goals

## Project Status

### Current State
- **Repository**: Deep AI v3.1.0
- **Framework**: Next.js 16.0.10 with React 19.0.1
- **Language**: TypeScript 5.6.3
- **Package Manager**: pnpm 9.12.3
- **Build System**: Turbopack (via `next dev --turbo`)

### Key Files Identified
- **Entry Points**:
  - `app/(chat)/page.tsx` - Main chat interface
  - `app/(auth)/login/` - Authentication pages
  - `app/(auth)/register/` - User registration

- **Core Components**:
  - `components/chat.tsx` - Main chat component
  - `components/messages.tsx` - Message display
  - `components/message.tsx` - Individual message
  - `components/app-sidebar.tsx` - Navigation sidebar
  - `components/multimodal-input.tsx` - Input handling

- **AI Integration**:
  - `lib/ai/providers.ts` - AI provider configuration
  - `lib/ai/models.ts` - Model definitions
  - `lib/ai/prompts.ts` - System prompts
  - `lib/ai/tools/` - AI tool implementations

- **Data Layer**:
  - `lib/db/` - Database schemas and migrations
  - `drizzle.config.ts` - ORM configuration
  - `lib/artifacts/server.ts` - Artifact handling

- **Artifacts System**:
  - `artifacts/text/` - Text document artifacts
  - `artifacts/code/` - Code artifacts
  - `artifacts/image/` - Image artifacts
  - `artifacts/sheet/` - Spreadsheet artifacts

### Environment Configuration
- **Database**: Neon Serverless Postgres
- **Storage**: Vercel Blob
- **Authentication**: Auth.js with multiple providers
- **AI Gateway**: Vercel AI Gateway for model access

## Active Decisions and Considerations

### Architecture Decisions
1. **Server Components**: Using React Server Components for improved performance
2. **Streaming**: Real-time AI response streaming via AI SDK
3. **Artifact System**: Multi-modal content support (text, code, images, sheets)
4. **Provider Abstraction**: Unified API for multiple AI providers

### Technical Constraints
- **Next.js 16**: Latest version with App Router
- **React 19**: Newer React version with enhanced features
- **TypeScript**: Strict type checking enabled
- **Accessibility**: WCAG compliance required

### Dependencies of Note
- **AI SDK 6.0.37**: Core AI integration
- **Drizzle ORM**: Database ORM
- **shadcn/ui**: Component library
- **Tailwind CSS 4**: Styling
- **Playwright**: E2E testing

## Patterns and Preferences

### Code Organization
- Feature-based directory structure
- Server actions for mutations
- Server components for data fetching
- Client components for interactivity

### Naming Conventions
- Files: kebab-case (e.g., `chat-header.tsx`)
- Components: PascalCase (e.g., `ChatHeader`)
- Functions: camelCase (e.g., `handleSendMessage`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_MESSAGES`)

### Testing Strategy
- E2E tests with Playwright
- Component testing patterns
- Test files in `tests/` directory

## Learnings and Insights

### Project Insights
1. **Template Architecture**: Well-structured for extensibility
2. **AI Integration**: Clean abstraction over multiple providers
3. **Component System**: Modular and reusable design
4. **Type Safety**: Comprehensive TypeScript coverage

### Best Practices Observed
- Clear separation of concerns
- Server-first rendering approach
- Accessibility-first component design
- Comprehensive error handling

## Next Steps

### Immediate Tasks
1. Complete Memory Bank setup (activeContext.md - done)
2. Create systemPatterns.md
3. Create techContext.md
4. Create progress.md

### Future Considerations
- Review existing codebase for potential improvements
- Identify extension points for new features
- Document any discovered patterns
- Track project evolution

---

*Last Updated: March 19, 2026, 7:23 PM IST*