# AGENTS.md

## Commands

```sh
# Development
bun dev                    # Run dev server with hot reload

# Build & Run
bun run build.ts           # Build (supports --outdir, --minify, --sourcemap, --target, --external, etc.)
bun start                  # Run production build (NODE_ENV=production)

# Lint & Format
bun lint                   # ESLint with auto-fix
bun format                 # Prettier auto-format

# Testing
bun test                   # Run all tests (bun:test framework)
bun test <file>            # Run single test file
```

## Code Style

### TypeScript
- Strict mode enabled; never use `as any` or `@ts-ignore`
- Use interfaces for object types, type unions for variants
- Enable `noUncheckedIndexedAccess` - always check array/object access

### Imports
- Use path alias `@/*` for local imports (e.g., `@/store`, `@/components/ui/button`)
- Group imports: React → external libs → path aliases → styles
- Example:
  ```tsx
  import { useState, useEffect } from 'react';
  import { create } from 'zustand';
  import { Button } from '@/components/ui/button';
  import { useWorkspaceStore } from '@/store/workspace';
  import '@/index.css';
  ```

### Naming
- **Components**: PascalCase (`WorkspacePage`, `MainContent`)
- **Files**: kebab-case for non-components, PascalCase for components
- **Variables/Functions**: camelCase (`activeComponentId`, `toggleMenu`)
- **Constants**: UPPER_SNAKE_CASE or camelCase depending on scope
- **Store hooks**: `use*Store` suffix (`useGlobalStore`, `useWorkspaceStore`)
- **Types**: PascalCase interfaces (`ComponentStatus`, `PositionState`)

### Components
- Use Radix UI primitives for accessible interactive components
- Use class-variance-authority for variant props (see `button.tsx`)
- Export component + variants pattern: `export { Button, buttonVariants }`
- Use `asChild` pattern with Radix Slot for composition

### State Management
- Use Zustand for global state (see `src/store/`)
- Store typing: `create<StateType>((set) => ({ ... }))`
- Immer allowed via Zustand's Immer middleware if needed
- Local state: React hooks (`useState`, `useReducer`, `useRef`)

### Styling
- Tailwind CSS via `bun-plugin-tailwind`
- Use `cn()` utility (`lib/utils.ts`) for class merging
- Dark mode ready with `dark:` prefix
- CSS variables in `index.css` for theming

### Error Handling
- Try/catch for async operations; log errors appropriately
- Use error boundaries for component tree failures
- Validate props with TypeScript; no runtime validation unless user input

### React Patterns
- Lazy route loading: `lazy: () => import('@/views/...')`
- Custom hooks for reusable logic (`use*` prefix)
- Effects with complete dependency arrays
- Memoize expensive calculations with `useMemo`/`useCallback`

### Routing
- Hash router (`createHashRouter`) for SPA routing
- Type routes: `RoutePath` union type in route config
- Nested routes via `children` array

### Data Fetching
- React Query (`@tanstack/react-query`) for server state
- Configure via `configs/query.config.ts`

### APIs
- Bun.serve() for backend (if adding server routes)
- bun:sqlite for SQLite, Bun.sql for Postgres
- WebSocket built-in; use Bun.websocket
