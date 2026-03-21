# System Patterns: Deep AI

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Artifacts   │  │   Streaming  │      │
│  │  Components  │  │   System     │  │   Handler    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Server Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js API │  │  Server      │  │   Auth.js    │      │
│  │   Routes     │  │  Actions     │  │   Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AI Gateway  │  │   Database   │  │    Storage   │      │
│  │  (Providers) │  │  (Neon PG)   │  │  (Vercel Blob)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Server-First Architecture
**Pattern**: React Server Components (RSC) for data fetching, Client Components for interactivity

**Implementation**:
- Server Components fetch data and handle mutations
- Client Components handle user interactions and state
- Server Actions for form submissions and API calls

**Example**:
```typescript
// Server Component (app/(chat)/page.tsx)
export default async function ChatPage() {
  const session = await auth();
  const chats = await getChats(session.user.id);
  return <Chat chats={chats} />;
}

// Client Component (components/chat.tsx)
'use client';
export function Chat({ chats }) {
  const [messages, setMessages] = useState([]);
  // Handle user interactions
}
```

**Benefits**:
- Improved performance (less JavaScript sent to client)
- Better SEO and initial load time
- Simplified data fetching
- Reduced client-side complexity

### 2. Streaming Response Pattern
**Pattern**: Real-time AI response streaming using Server-Sent Events

**Implementation**:
- AI SDK handles streaming infrastructure
- `useChat` hook manages message state and streaming
- UI updates progressively as tokens arrive

**Example**:
```typescript
// lib/ai/providers.ts
export const provider = createProvider({
  // Provider configuration
});

// components/chat.tsx
const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
  // Handles streaming automatically
});
```

**Benefits**:
- Perceived performance improvement
- Better user experience
- Reduced time to first token
- Progressive content display

### 3. Artifact System Pattern
**Pattern**: Multi-modal content handling with specialized renderers

**Implementation**:
- Base artifact interface with common properties
- Specialized artifacts for different content types
- Separate client and server implementations

**Example**:
```typescript
// lib/types.ts
interface Artifact {
  id: string;
  type: 'text' | 'code' | 'image' | 'sheet';
  content: string;
  title?: string;
}

// artifacts/code/client.tsx
export function CodeArtifact({ artifact }) {
  return <CodeEditor content={artifact.content} />;
}

// artifacts/code/server.ts
export async function handleCodeArtifact(content) {
  // Server-side processing
}
```

**Benefits**:
- Extensible content system
- Separation of concerns
- Type-safe artifact handling
- Easy to add new artifact types

### 4. Provider Abstraction Pattern
**Pattern**: Unified API for multiple AI providers

**Implementation**:
- Single interface for all providers
- Provider-specific configurations
- Dynamic provider selection

**Example**:
```typescript
// lib/ai/providers.ts
export const providers = {
  openai: createOpenAIProvider(),
  anthropic: createAnthropicProvider(),
  google: createGoogleProvider(),
};

// lib/ai/models.ts
export const models = {
  'gpt-4': { provider: 'openai', model: 'gpt-4' },
  'claude-3': { provider: 'anthropic', model: 'claude-3' },
};
```

**Benefits**:
- Easy provider switching
- Consistent API across providers
- Simplified configuration
- Future-proof architecture

### 5. Form Handling Pattern
**Pattern**: Server Actions for mutations with optimistic updates

**Implementation**:
- Server Actions for database operations
- Optimistic UI updates
- Error handling and rollback

**Example**:
```typescript
// app/(chat)/actions.ts
'use server';
export async function sendMessage(formData: FormData) {
  const message = formData.get('message');
  await db.insert(messages).values({ content: message });
  revalidatePath('/chat');
}

// components/multimodal-input.tsx
const handleSubmit = async (e) => {
  // Optimistic update
  setMessages(prev => [...prev, newMessage]);
  
  // Server action
  await sendMessage(formData);
};
```

**Benefits**:
- Type-safe mutations
- Automatic revalidation
- Simplified form handling
- Better error handling

### 6. Component Composition Pattern
**Pattern**: Atomic design with composable components

**Implementation**:
- Base UI primitives (shadcn/ui)
- Composed components for features
- Layout components for structure

**Example**:
```typescript
// components/ui/button.tsx (Base)
export function Button({ variant, size, ...props }) {
  return <button className={buttonVariants({ variant, size })} {...props} />;
}

// components/message-actions.tsx (Composed)
export function MessageActions({ message }) {
  return (
    <div>
      <Button variant="ghost" onClick={handleCopy}>Copy</Button>
      <Button variant="ghost" onClick={handleRegenerate}>Regenerate</Button>
    </div>
  );
}
```

**Benefits**:
- Reusable components
- Consistent design system
- Easy maintenance
- Rapid development

## Critical Implementation Paths

### 1. Message Flow
```
User Input → MultimodalInput → Server Action → AI Gateway → 
Streaming Response → useChat Hook → Messages Component → 
UI Update (Progressive)
```

### 2. Authentication Flow
```
User Request → Auth.js Middleware → Session Check → 
Protected Route → Database Query → Response
```

### 3. Artifact Generation Flow
```
AI Response → Artifact Detection → Server Processing → 
Artifact Storage → Client Rendering → User Interaction
```

### 4. Chat Persistence Flow
```
New Message → Database Insert → Chat History Update → 
Sidebar Refresh → Real-time Sync
```

## Architecture Decisions

### 1. Next.js App Router
**Decision**: Use App Router instead of Pages Router

**Rationale**:
- Server Components by default
- Improved performance
- Better data fetching patterns
- Future-proof architecture

**Trade-offs**:
- Learning curve for new patterns
- Some libraries may not be compatible
- Different mental model from Pages Router

### 2. Drizzle ORM
**Decision**: Use Drizzle instead of Prisma

**Rationale**:
- Type-safe SQL-like syntax
- Better performance
- Smaller bundle size
- Excellent TypeScript support

**Trade-offs**:
- Smaller community than Prisma
- Less tooling available
- Manual migration management

### 3. shadcn/ui Components
**Decision**: Use shadcn/ui instead of custom components

**Rationale**:
- Accessible by default
- Customizable design system
- Copy-paste approach
- Excellent documentation

**Trade-offs**:
- Initial setup required
- Need to maintain component copies
- Learning curve for customization

### 4. AI SDK Integration
**Decision**: Use Vercel AI SDK for AI integration

**Rationale**:
- Unified API for multiple providers
- Built-in streaming support
- React hooks for chat UI
- Excellent Next.js integration

**Trade-offs**:
- Vendor lock-in to Vercel ecosystem
- Limited to supported providers
- May need custom solutions for edge cases

## Data Flow Patterns

### 1. Server Component Data Flow
```
Request → Layout (Server) → Page (Server) → 
Data Fetching → Component Props → Render
```

### 2. Client Component Data Flow
```
User Interaction → State Update → Effect → 
API Call → State Update → Re-render
```

### 3. Streaming Data Flow
```
AI Response → Stream Chunk → useChat Hook → 
Message Update → Progressive Render → 
Stream Complete → Final State
```

## Error Handling Patterns

### 1. Server-Side Error Handling
```typescript
try {
  const result = await dbOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Database error:', error);
  return { success: false, error: error.message };
}
```

### 2. Client-Side Error Handling
```typescript
const { error } = useChat({
  onError: (error) => {
    toast.error('Failed to send message');
    console.error('Chat error:', error);
  },
});
```

### 3. Streaming Error Handling
```typescript
const { messages } = useChat({
  onFinish: (message) => {
    if (message.role === 'assistant') {
      // Handle completion
    }
  },
});
```

## Performance Patterns

### 1. Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Lazy loading of artifacts

### 2. Caching Strategies
- Server Component caching
- API response caching
- Static generation where possible

### 3. Optimization Techniques
- Image optimization with Next.js Image
- Font optimization with next/font
- Bundle analysis and optimization

---

*These patterns ensure maintainability, scalability, and excellent user experience across the application.*