# Funnel Quiz - Copilot Instructions

## Project Overview

Funnel Quiz is a Next.js application for creating interactive marketing survey forms with drag-and-drop visual editor. This is NOT a traditional quiz app - it's a conversion funnel tool that collects user information through engaging multi-step forms.

## Core Architecture

### Two-Interface System

- **Editor Interface** (`/editor`): Visual drag-and-drop builder for creating quizzes
- **Public Interface** (`/quiz/[id]`): Published forms accessible via unique URLs

### Data Model (Prisma)

```
Quiz -> Steps (ordered screens) -> Elements (form components)
Response -> Answers (user submissions)
```

Element types: `TEXT`, `MULTIPLE_CHOICE`, `NAVIGATION_BUTTON` with JSON content field for type-specific properties.

### State Management Pattern

- **Zustand store** (`useEditorStore`) for editor state management
- **Client-side quiz creation** with mock data structure during MVP phase
- Elements use polymorphic JSON content field - type-specific interfaces in `src/types/composed.ts`

## Key Development Patterns

### Component Architecture

- **Shadcn/ui base**: Always use Shadcn components as foundation
- **Element system**: Dynamic rendering via `src/lib/element-definitions.ts` registry
- **Editor components**: Drag-and-drop with `@dnd-kit` for element placement

### TypeScript Conventions

- Type definitions split by domain in `src/types/` (composed, api, components, etc.)
- Prisma types extended with relations (e.g., `QuizWithSteps`, `StepWithElements`)
- Element content uses discriminated unions for type safety

### Next.js App Router Usage

- **Server Components by default**, Client Components only when needed ("use client")
- Use Next.js native navigation: `useRouter`, `usePathname`, `Link` from `next/navigation`
- **NEVER** use `react-router-dom` or external routing libraries

## Development Workflow

### Database Setup

```bash
# Start PostgreSQL (Docker)
docker-compose up -d

# Database operations
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset with seed data
```

### Development Commands

```bash
npm run dev          # Start with Turbopack
npm run build        # Production build
npm run lint         # ESLint check
```

### Environment Variables

Database URL follows Docker Compose setup:
`DATABASE_URL="postgresql://funnelquiz:funnelquiz123@localhost:5432/funnelquiz"`

## Critical Implementation Details

### Element Content Pattern

Each `Element.content` is polymorphic JSON. Use type guards and interfaces from `src/types/composed.ts`:

```typescript
interface TextElementContent {
  text: string;
  fontSize?: "sm" | "base" | "lg" | "xl" | "2xl";
  // ...
}
```

### Editor Store Integration

Components should use `useEditorStore` for quiz state. Key methods:

- `setQuiz()`, `setCurrentStep()`
- `addElement()`, `updateElement()`, `removeElement()`
- `selectElement()` for properties panel

### UI Component Strategy

- Use Tailwind CSS with Shadcn color system (background, foreground, primary, etc.)
- Follow responsive-first design
- Maintain accessibility through Shadcn base components

## Project-Specific Context

### Business Logic

This is a **marketing conversion tool**, not an educational quiz. Focus on user engagement, data collection, and funnel optimization rather than scoring or correctness.

### MVP Scope

Currently implementing core editor functionality. API routes and persistence are planned but not yet implemented - editor uses mock data structures.

### Reference Applications

- WordPress Plugin Elementor-style drag-and-drop interface
- Similar to Inlead Digital and FunnelFox platforms

## File Organization Patterns

- Components grouped by domain: `editor/`, `quiz/`, `ui/`, `common/`
- Hooks follow domain naming: `useEditorStore`, `useQuizEditor`, `useQuizPersistence`
- Types mirror component organization with clear separation of concerns
