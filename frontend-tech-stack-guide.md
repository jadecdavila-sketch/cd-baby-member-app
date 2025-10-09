# Frontend Tech Stack Guide - Unosquare Boards

## Overview

This document provides a comprehensive overview of a frontend technology stack built with **Next.js 14+ App Router**.

## Core Framework

### Next.js

- **App Router**: Modern file-based routing with enhanced layouts and streaming
- **React Server Components**: Improved performance with server-side rendering by default
- **Turbopack**: Ultra-fast bundler for development (optional, webpack in production)
- **Built-in Optimizations**: Automatic image, font, and script optimizations
- **TypeScript First**: Native TypeScript support with zero configuration

**Key Features:**

- Server and Client Components for optimal performance
- Streaming UI with Suspense boundaries
- Built-in SEO optimization with metadata API
- Automatic code splitting and lazy loading
- Edge Runtime support for global deployment

**Next.js Configuration:**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### TypeScript

- **Strict Configuration**: All strict type checking options enabled
- **Path Mapping**: Comprehensive alias configuration for clean imports
- **App Router Types**: Full type safety for route parameters and metadata
- **Server Component Types**: Proper typing for async server components

**Key TypeScript Settings:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Routing & Navigation

### App Router File-Based Routing

Next.js App Router provides powerful file-based routing with enhanced features:

**Route Structure:**

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page
├── globals.css                   # Global styles
├── (authenticated)/              # Route group for protected routes
│   ├── layout.tsx               # Authentication layout
│   ├── dashboard/
│   │   ├── page.tsx            # /dashboard
│   │   ├── loading.tsx         # Loading UI
│   │   └── error.tsx           # Error UI
│   └── items/
│       └── [itemId]/
│           ├── page.tsx        # /items/[itemId]
│           ├── loading.tsx
│           └── error.tsx
├── api/                         # API Route Handlers
│   ├── items/
│   │   └── route.ts            # /api/items
│   └── auth/
│       └── route.ts            # /api/auth
└── auth/
    └── callback/
        └── page.tsx            # /auth/callback
```

### Route Groups and Layouts

**Authentication Layout:**

```typescript
// app/(authenticated)/layout.tsx
import { AuthProvider } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <AuthProvider session={session}>
      <div className="min-h-screen bg-background">
        <nav>{/* Navigation */}</nav>
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
```

## Server & Client Components

### Server Components (Default)

Server Components render on the server and can access backend resources directly:

```typescript
// app/boards/[boardId]/page.tsx
import { getBoard } from "@/lib/api/boards";
import { BoardView } from "./board-view";

export default async function BoardPage({
  params: { boardId },
}: {
  params: { boardId: string };
}) {
  // This runs on the server
  const board = await getBoard(boardId);

  return <BoardView board={board} />;
}

export async function generateMetadata({
  params: { boardId },
}: {
  params: { boardId: string };
}) {
  const board = await getBoard(boardId);

  return {
    title: `${board.name} - Unosquare Boards`,
    description: `Manage tasks on the ${board.name} board`,
  };
}
```

### Client Components

Client Components run in the browser and handle interactivity:

```typescript
// components/board-view.tsx
"use client";

import { useState } from "react";
import { useBoardQuery, useUpdateCard } from "@/hooks/api/boards";

export function BoardView({ board: initialBoard }) {
  const { data: board, isLoading } = useBoardQuery(initialBoard.id, {
    initialData: initialBoard,
  });

  const updateCard = useUpdateCard();

  const handleCardUpdate = async (cardId: string, data: any) => {
    await updateCard.mutateAsync({ id: cardId, data });
  };

  if (isLoading) return <BoardSkeleton />;

  return (
    <div className="board-container">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onCardUpdate={handleCardUpdate}
        />
      ))}
    </div>
  );
}
```

## State Management

### TanStack Query

- **Server State**: Comprehensive server state management with automatic caching
- **Background Syncing**: Automatic data refetching and synchronization
- **Optimistic Updates**: UI updates before server confirmation
- **SSR Integration**: Perfect integration with Next.js Server Components
- **Developer Tools**: Integrated query devtools for debugging

**Setup with App Router:**

```typescript
// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Jotai

- **Atomic State**: Bottom-up atomic state management approach
- **SSR Support**: Proper hydration with Next.js Server Components
- **TypeScript Integration**: Excellent TypeScript support with type-safe atoms
- **Derived State**: Computed values through derived atoms
- **Performance**: Minimal re-renders with atomic updates

**Jotai with App Router:**

```typescript
// lib/atoms/board-atoms.ts
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

export const selectedBoardIdAtom = atom<string | null>(null);

export const boardQueryAtom = atomWithQuery((get) => ({
  queryKey: ["board", get(selectedBoardIdAtom)],
  queryFn: async ({ queryKey: [, boardId] }) => {
    if (!boardId) return null;
    const response = await fetch(`/api/boards/${boardId}`);
    return response.json();
  },
  enabled: !!get(selectedBoardIdAtom),
}));
```

### React Hook Form 7.53.0

- **Performant Forms**: Minimal re-renders with uncontrolled components
- **Server Actions**: Integration with Next.js Server Actions
- **Validation Integration**: Seamless Zod resolver integration
- **TypeScript Support**: Full type safety for form data and validation

**Form with Server Actions:**

```typescript
// components/create-board-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBoard } from "@/app/actions/board-actions";
import { createBoardSchema } from "@/lib/schemas/board";

export function CreateBoardForm() {
  const form = useForm({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <form action={createBoard}>
      <input {...form.register("name")} />
      <input {...form.register("description")} />
      <button type="submit">Create Board</button>
    </form>
  );
}
```

## UI & Styling

### Tailwind CSS

- **Utility-First**: Rapid development with utility classes
- **Dark Mode**: Class-based dark mode support with `next-themes`
- **Custom Configuration**: Extended with shadcn/ui design system
- **CSS Variables**: HSL-based color system for consistent theming
- **JIT Compilation**: Just-in-time compilation for optimal bundle size
- **PostCSS Integration**: Seamless integration with Next.js build pipeline
- **Responsive Design**: Mobile-first responsive utilities
- **Custom Animations**: Built-in animation utilities with `tailwindcss-animate`
- **Component Styling**: Scoped component styling without CSS-in-JS overhead

**Tailwind Configuration:**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // ... more colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

**CSS Architecture with Tailwind:**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .btn {
    @apply ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50;
  }
}
```

**Utility Usage Patterns:**

```typescript
// Component styling with Tailwind utilities
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        "hover:shadow-md transition-shadow duration-200",
        "dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive design with breakpoint prefixes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
    Card content
  </div>
</div>;
```

### Radix UI Components

Comprehensive set of accessible, unstyled component primitives:

- **@radix-ui/react-dialog** - Modal dialogs
- **@radix-ui/react-dropdown-menu** - Dropdown menus
- **@radix-ui/react-popover** - Popover components
- **@radix-ui/react-select** - Select inputs
- **@radix-ui/react-checkbox** - Checkbox inputs
- **@radix-ui/react-radio-group** - Radio button groups
- **@radix-ui/react-switch** - Toggle switches
- **@radix-ui/react-toast** - Toast notifications
- **@radix-ui/react-tooltip** - Tooltips

### shadcn/ui

- **Pre-built Components**: Copy-pasteable components built on Radix UI
- **App Router Ready**: Fully compatible with Next.js App Router
- **Customizable**: Full control over component styling and behavior
- **Accessible**: ARIA-compliant components out of the box
- **Design System**: Consistent theming with CSS variables

**Configuration (components.json):**

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components/ui",
    "utils": "@/lib/utils"
  }
}
```

### Theme Management

- **next-themes 0.3.0**: Perfect integration with Next.js App Router
- **System Preference**: Automatic detection of user's system theme
- **SSR Safe**: No flash of unstyled content
- **Theme Switching**: Smooth transitions between light and dark modes

**Theme Setup:**

```typescript
// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

## API Integration

### Route Handlers

Next.js App Router provides powerful API Route Handlers:

```typescript
// app/api/boards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

const createBoardSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boards = await getBoardsForUser(session.user.id);
  return NextResponse.json(boards);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validatedData = createBoardSchema.parse(body);

  const board = await createBoard({
    ...validatedData,
    userId: session.user.id,
  });

  return NextResponse.json(board);
}
```

### Server Actions

Modern form handling with Server Actions:

```typescript
// app/actions/board-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { createBoardSchema } from "@/lib/schemas/board";

export async function createBoard(formData: FormData) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validatedFields = createBoardSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const board = await createBoard({
    ...validatedFields.data,
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
  redirect(`/boards/${board.id}`);
}
```

### Client-Side API Integration

```typescript
// lib/api/boards.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const boardQueryKeys = {
  all: ["boards"] as const,
  lists: () => [...boardQueryKeys.all, "list"] as const,
  list: (filters: string) => [...boardQueryKeys.lists(), { filters }] as const,
  details: () => [...boardQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...boardQueryKeys.details(), id] as const,
};

export function useBoardsQuery() {
  return useQuery({
    queryKey: boardQueryKeys.lists(),
    queryFn: async () => {
      const response = await fetch("/api/boards");
      if (!response.ok) throw new Error("Failed to fetch boards");
      return response.json();
    },
  });
}

export function useBoardQuery(id: string) {
  return useQuery({
    queryKey: boardQueryKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/boards/${id}`);
      if (!response.ok) throw new Error("Failed to fetch board");
      return response.json();
    },
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBoardData) => {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create board");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKeys.lists() });
    },
  });
}
```

### Server-Side Data Fetching

**Important**: For server-side pages (Server Components), use the native `fetch` API instead of axios to leverage Next.js built-in caching.

```typescript
// Server Component - use fetch with cache options
const response = await fetch(`${API_URL}/api/releases`, {
  cache: 'force-cache', // Static data (default)
});

const response = await fetch(`${API_URL}/api/releases`, {
  next: { revalidate: 60 }, // Revalidate every 60 seconds
});

const response = await fetch(`${API_URL}/api/releases`, {
  cache: 'no-store', // Always fetch fresh
});
```

**Cache Options:**

- `cache: 'force-cache'` - Cache indefinitely (default for GET)
- `cache: 'no-store'` - No caching, always fetch fresh
- `next: { revalidate: seconds }` - Time-based revalidation

## Authentication

### NextAuth.js 5.0 (Auth.js)

- **App Router Native**: Built specifically for Next.js App Router
- **Multiple Providers**: Support for OAuth, credentials, and more
- **Server Components**: Direct session access in Server Components
- **Middleware**: Route protection at the edge
- **TypeScript**: Full type safety for session data

**Configuration:**

```typescript
// lib/auth-config.ts
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
});
```

**Middleware:**

```typescript
// middleware.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  // Additional middleware logic
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Development Tools

### Testing Framework

#### Vitest + Testing Library

- **Fast Execution**: Native ESM support with Vite's speed
- **Jest Compatible**: Familiar API with better performance
- **Component Testing**: React Testing Library integration
- **Coverage**: Built-in coverage reporting

**Configuration:**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
```

**Testing Libraries:**

- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM
- **@testing-library/user-event**: User interaction simulation
- **@vitest/coverage-v8**: Native V8 coverage provider

### Unit Testing Strategy

**File Organization:**

- Test files colocated with source code in `__tests__` folders
- Naming convention: `component.test.tsx` or `hook.test.ts`
- Mock files in `__mocks__` folders alongside tests

**Testing Patterns:**

```typescript
// Component Testing
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SomeComponent } from '../some-component';

vi.mock('../use-some-hook');

describe('SomeComponent', () => {
  beforeEach(() => {
    vi.mocked(useSomeHook).mockReturnValue({
      someMethod: vi.fn(),
      someValue: false,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  it('renders correctly when someValue is false', () => {
    render(<SomeComponent />);
    expect(screen.getByText(/default content/i)).toBeInTheDocument();
  });
});
```

**Hook Testing:**

```typescript
// Custom Hook Testing
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useSomeHook } from '../use-some-hook';

describe('useSomeHook', () => {
  it('returns initial value correctly', () => {
    const { result } = renderHook(() => useSomeHook());
    expect(result.current.someValue).toBe(false);
  });
});
```

**Async Testing:**

```typescript
// Testing Async Behavior
import { render, screen, waitFor } from '@testing-library/react';

it('displays data after async fetch', async () => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({ data: 'fetched content' }),
  } as Response);

  render(<SomeComponent />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/fetched content/i)).toBeInTheDocument();
  });
});
```

**Best Practices:**

- **Test Isolation**: Reset mocks and clean up DOM in `afterEach`
- **Accessible Queries**: Use `getByRole`, `getByText` for accessibility
- **Test Behavior**: Focus on what the component does, not how
- **Avoid Over-Mocking**: Mock only external dependencies
- **Cover Edge Cases**: Test loading, error, and missing prop states
- **Focused Tests**: Each test should verify one behavior

**Common Pitfalls:**

- Not resetting mocks causes test interference
- Overusing `getByTestId` instead of semantic queries
- Testing implementation details rather than behavior
- Ignoring cleanup leading to memory leaks

#### Playwright (E2E Testing)

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### Code Quality

#### ESLint

- **Next.js Integration**: Built-in Next.js specific rules
- **App Router Rules**: Proper linting for Server/Client Components
- **TypeScript Rules**: Full TypeScript linting support
- **React Rules**: Comprehensive React and hooks linting

**Configuration:**

```javascript
// eslint.config.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Custom rules
    },
  },
];

export default eslintConfig;
```

**Key ESLint Plugins:**

- **@next/eslint-plugin-next**: Next.js specific rules
- **@typescript-eslint/eslint-plugin**: TypeScript linting
- **eslint-plugin-react**: React-specific rules
- **eslint-plugin-react-hooks**: React Hooks rules

#### Prettier

- **Code Formatting**: Consistent code formatting across the project
- **Tailwind Integration**: Automatic Tailwind class sorting
- **Next.js Support**: Proper formatting for App Router files

```javascript
// prettier.config.js
/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};
```

### Build Tools

#### Next.js Build System

- **Turbopack**: Fast development bundler (optional)
- **Webpack**: Production-ready bundling with optimizations
- **SWC**: Fast TypeScript and JavaScript compilation
- **Bundle Analyzer**: Built-in bundle analysis tools

**Build Commands:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true next build"
  }
}
```

#### Additional Tools

- **@next/bundle-analyzer**: Bundle size analysis
- **sharp**: Optimized image processing
- **autoprefixer**: CSS vendor prefixing
- **postcss**: CSS processing pipeline

## Performance & Optimization

### Next.js Built-in Optimizations

- **Automatic Code Splitting**: Route-based splitting by default
- **Image Optimization**: Next.js Image component with WebP support
- **Font Optimization**: Automatic font loading optimization
- **Script Optimization**: Optimized third-party script loading

**Image Optimization:**

```typescript
import Image from "next/image";

export function UserAvatar({ user }: { user: User }) {
  return (
    <Image
      src={user.avatar}
      alt={user.name}
      width={40}
      height={40}
      className="rounded-full"
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  );
}
```

## Path Aliases

Comprehensive path mapping for clean imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/api/*": ["./src/api/*"],
      "@/app/*": ["./src/app/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/shared/components/*": ["./src/shared/components/*"],
      "@/shared/hooks/*": ["./src/shared/hooks/*"],
      "@/shared/services/*": ["./src/shared/services/*"],
      "@/shared/types/*": ["./src/shared/types/*"],
      "@/shared/utils/*": ["./src/shared/utils/*"],
      "@/shared/constants/*": ["./src/shared/constants/*"]
    }
  }
}
```

## Architecture Patterns

### File Structure

```
src/
├── api/
│   ├── __tests__/
│   │   └── api.test.ts
│   ├── src/
│   │   ├── interceptors/
│   │   └── some-api/
│   │       ├── __tests__/
│   │       │   ├── some-api.test.ts
│   │       │   └── use-some-api.test.ts
│   │       ├── __mocks__/
│   │       │   ├── some-api.ts
│   │       │   └── use-some-api.ts
│   │       ├── some-api.ts
│   │       ├── use-some-api.ts
│   │       └── index.ts
│   ├── api.ts                                    # axios GET/POST/PUT/PATCH/DELETE, incorporates interceptors
│   └── index.ts
├── app/                                          # Next.js App Router
│   ├── (authenticated)/                          # Route group for protected routes
│   │   ├── layout.tsx                            # Authentication layout
│   │   ├── dashboard/
│   │   │   ├── page.tsx                          # /dashboard
│   │   │   ├── loading.tsx                       # Loading UI
│   │   │   └── error.tsx                         # Error UI
│   │   └── items/
│   │       └── [itemId]/
│   │           ├── page.tsx                      # /items/[itemId]
│   │           ├── loading.tsx
│   │           └── error.tsx
│   ├── api/                                      # API Route Handlers
│   │   ├── items/
│   │   │   └── route.ts                          # /api/items
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts                      # NextAuth.js handlers
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx                          # /auth/signin
│   ├── layout.tsx                                # Root layout
│   ├── page.tsx                                  # Home page
│   └── globals.css                               # Global styles
├── modules/
│   └── some-module/
│       ├── __tests__/
│       │   ├── some-module.test.tsx
│       │   └── use-some-module.test.tsx
│       ├── __mocks__/
│       │   ├── some-module.tsx
│       │   ├── use-some-module.tsx
│       │   └── index.ts
│       └── components/
│           └── some-sub-component/
│           ├── __tests__/
│           │   ├── some-module.test.tsx
│           │   └── use-some-module.test.tsx
│           ├── __mocks__/
│           │   └── some-module.tsx
│           ├── index.ts
│           ├── some-sub-component.tsx
│           └── use-some-sub-component.ts
│       ├── some-module.tsx
│       ├── use-some-module.tsx
│       └── index.ts
└── shared/
    ├── components/
    │   ├── ui/                                   # Shadcn components
    │   │   ├── alert/
    │   │   └── dialog/
    │   └── form/                                 # Opinionated form components using RHF
    │       └── rhf-text-field/
    │           ├── __tests__/
    │           │   └── rhf-text-field.test.tsx
    │           ├── __mocks__/
    │           │   └── rhf-text-field.tsx
    │           ├── rhf-text-field.tsx
    │           └── index.tsx
    ├── constants/
    │   │── some-constants.ts                     # Single source export all constants
    │   └── index.ts                              # Single source export all constants
    ├── hooks/
    │   ├── __tests__/
    │   │   └── use-some-hook.test.ts
    │   ├── __mocks__/
    │   │   └── use-some-hook.ts
    │   ├── use-some-hook.ts
    │   └── index.ts                              # Single source export all hooks
    ├── services/
    │   └── some-service/
    │       ├── __tests__/
    │       │   └── some-service.test.ts
    │       ├── __mocks__/
    │       │   ├── some-service.ts
    │       │   └── index.ts
    │       ├── some-service.ts
    │       └── index.ts
    ├── types/
    │   ├── some-types.ts
    │   └── index.ts                              # Single source export all types
    └── utils/
        ├── __tests__/
        │   └── some-util.test.ts
        ├── __mocks__/
        │   ├── some-util.ts
        │   └── index.ts
        ├── some-util.ts
        └── index.ts                              # Single source export all utils
```

### Component Architecture

- **Server Components First**: Use Server Components by default
- **Client Components**: Only when needed for interactivity
- **Composition Pattern**: Prefer composition over inheritance
- **Props Interface**: Clear TypeScript interfaces for all props

### Data Fetching Strategy

- **Server Components**: Direct database/API calls
- **Client Components**: TanStack Query for caching and state management
- **Server Actions**: Form submissions and mutations
- **Route Handlers**: External API integration

### State Management Pattern

- **Server State**: TanStack Query for API data and caching
- **Client State**: Jotai atoms for global client-side state
- **Form State**: React Hook Form for form management
- **Theme State**: next-themes for dark/light mode
- **URL State**: Next.js router for navigation state

## Package Requirements

### Engine Requirements

```json
{
  "engines": {
    "node": ">=18.17.0",
    "npm": ">=9.0.0"
  }
}
```

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.6.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "next-auth": "5.0.0-beta.4",
    "jotai": "^2.6.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "@hookform/error-message": "^2.0.1",
    "zod": "^3.22.0",
    "tailwindcss": "^3.4.0",
    "next-themes": "^0.3.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "react-error-boundary": "^4.0.11",
    "cmdk": "^0.2.0",
    "sonner": "^1.0.0"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^14.3.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@playwright/test": "^1.42.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    "@storybook/nextjs": "^7.0.0"
  }
}
```

## Development Workflow

### Git Hooks with Husky

Automated code quality checks before commits and pushes:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check && npm run test",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

**Setup Commands:**

```bash
# Install husky
npx husky-init && npm install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add pre-push hook
npx husky add .husky/pre-push "npm run type-check && npm run test"
```

### Lint-staged Configuration

Automatic code formatting and linting on staged files:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "git add"],
    "*.{md,json,yml,yaml}": ["prettier --write", "git add"],
    "*.{css,scss}": ["prettier --write", "git add"]
  }
}
```

### Package.json Scripts Enhancement

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix",
    "lint:check": "next lint",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "analyze": "ANALYZE=true next build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "prepare": "husky install",
    "postinstall": "husky install"
  }
}
```

### Commit Convention

Using conventional commits for automated changelog generation:

```json
{
  "devDependencies": {
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0"
  }
}
```

**commitlint.config.js:**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting
        'refactor', // Code refactoring
        'test', // Adding tests
        'chore', // Maintenance
      ],
    ],
  },
};
```

### Code Quality Enhancements

**Enhanced ESLint Configuration:**

```javascript
// eslint.config.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking'
  ),
  {
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // React specific rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'error',

      // Import organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
```

**Enhanced Prettier Configuration:**

```javascript
// prettier.config.js
/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.js',
};
```

### Environment Configuration

**Environment Variables Management:**

```bash
# .env.local (for local development)
NEXT_PUBLIC_API_URL=http://localhost:3001
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# .env.example (committed to repo)
NEXT_PUBLIC_API_URL=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
```

**Environment Validation:**

```typescript
// src/shared/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  AZURE_AD_CLIENT_ID: z.string().min(1),
  AZURE_AD_CLIENT_SECRET: z.string().min(1),
  AZURE_AD_TENANT_ID: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

### Error Handling Patterns

**Global Error Boundary:**

```typescript
// src/shared/components/error-boundary.tsx
'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function ErrorFallback({
  error,
  resetErrorBoundary
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
        <pre className="mt-2 text-sm text-gray-600">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Send to error tracking service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

**API Error Handling:**

```typescript
// src/shared/utils/api-error.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'API request failed',
      response.status,
      error.code
    );
  }

  return response.json();
}
```

This comprehensive Next.js App Router frontend stack provides a modern, performant, and maintainable foundation, emphasizing server-side rendering, type safety, accessibility, and developer experience with robust development workflows and quality assurance processes.
