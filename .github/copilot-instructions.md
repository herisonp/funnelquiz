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

### State Management & Persistence Architecture

- **Primary Store**: `useEditorStore` (Zustand) for real-time editor state
- **Client-side Persistence**: `StorageManager` with LZ-String compression for localStorage
- **Auto-save System**: `useAutoSave` hook with debounced saves and backup creation
- **Data Recovery**: `useQuizRecovery` for loading and validating saved data with fallback to backups

**Critical Pattern**: All editor operations mark state as changed (`hasUnsavedChanges: true`) and trigger auto-save. Recovery system handles corrupted data gracefully.

## Essential Development Patterns

### Drag & Drop System (@dnd-kit)

- **Elements Sidebar**: `DraggableElement` components with both click-to-add and drag functionality
- **Canvas**: `SortableElement` and `DropZone` for precise element placement
- **Steps Reordering**: `StepsVerticalNavigation` with sortable step items
- **Sensors**: Configured for mouse, touch, and keyboard accessibility

Key files: `useEditorDragDrop`, `EditorLayout`, custom CSS in `src/styles/drag-drop.css`

### Element Architecture Pattern

Elements use **polymorphic JSON content** with type-safe handling:

```typescript
// Registry pattern in src/lib/element-definitions.ts
export const AVAILABLE_ELEMENTS: ElementDefinition[]

// Type guards in src/types/composed.ts
export function isTextElementContent(content: unknown): content is TextElementContent

// Universal renderer with mode switching
<ElementRenderer element={element} mode="editor" | "public" />
```

### Storage & Data Management

- **Storage Manager**: Singleton with compression, quota monitoring, backup management
- **Schema Validation**: Zod schemas in `src/schemas/quiz-schema.ts` for data integrity
- **Export/Import**: `QuizExportService` and `QuizImportService` for JSON-based data portability
- **Response Tracking**: `useQuizResponseStore` for quiz submissions with validation

### Editor Store Operations

```typescript
// Element management with automatic reordering
addElement(type, order?) // Inserts at specific position
moveElement(elementId, newOrder) // Drag & drop reordering
updateElement(elementId, updates) // Content changes

// Step management (MVP limit: 5 steps, minimum: 1)
addStep() // Creates new step, auto-switches to it
reorderSteps(stepIds) // From drag & drop operations
```

## Critical Implementation Details

### Color & Typography System

Quiz appearance uses **dual field system** for backward compatibility:

- Direct fields: `primaryColor`, `backgroundColor`, `textColor`, `titleColor`, `primaryFont`, `headingFont`, `baseFontSize`
- Object fields: `colors: QuizColors`, `fonts: QuizFonts`

Both are updated simultaneously. Google Fonts integration via `useGoogleFonts` hook.

### Validation Architecture

- **Editor Validation**: `useQuizValidation` for real-time feedback
- **Response Validation**: `QuizResponseValidator` for public quiz submissions
- **Step Validation**: Individual step completeness checking for navigation control

### Component Patterns

- **Shadcn/ui Foundation**: All base components use Shadcn with consistent theming
- **Universal Rendering**: Same components work in editor and public modes via `mode` prop
- **Wrapper Pattern**: `ElementWrapper` provides selection, deletion, and drag handles in editor

## Development Workflow

### Essential Commands

```bash
# Development with hot reload
npm run dev

# Database management
docker-compose up -d        # Start PostgreSQL
npm run db:push            # Sync schema (development)
npm run db:migrate         # Create migration (production-ready)
npm run db:studio          # Visual database browser
npm run db:reset           # Reset with seed data

# Build pipeline
npm run build              # Production build with type checking
npm run lint              # ESLint validation
```

### Environment Setup

```env
DATABASE_URL="postgresql://funnelquiz:funnelquiz123@localhost:5432/funnelquiz"
```

Docker Compose handles PostgreSQL with persistent volumes. Database schema auto-applies via Prisma.

## Project-Specific Context

### Business Domain

Marketing conversion funnel tool - focus on **user engagement and data collection**, not quiz scoring. Features prioritize form completion rates and response quality.

### MVP Constraints

- Client-side only (no API routes yet)
- 5 steps maximum per quiz
- 3 element types: TEXT, MULTIPLE_CHOICE, NAVIGATION_BUTTON
- localStorage persistence with 5MB quota management

### File Organization

```
src/
├── components/{editor,quiz,ui,common}/  # Domain-grouped components
├── hooks/                              # Domain-specific hooks (useEditor*, useQuiz*)
├── lib/                               # Business logic (element-definitions, storage-manager, validators)
├── stores/                            # Zustand stores for global state
├── types/                             # Domain-separated TypeScript definitions
└── styles/                            # CSS modules for drag-drop, preview-mode
```

## Next.js App Router Specifics

- **Server Components by default** - only add `"use client"` when needed for interactivity
- **Native Navigation**: Use `useRouter`, `usePathname`, `Link` from `next/navigation`
- **Route Structure**: `/editor` for builder, `/quiz/[id]` for public forms, `/quiz/preview/*` for preview modes
