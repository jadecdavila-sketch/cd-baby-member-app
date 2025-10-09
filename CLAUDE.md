# CLAUDE.md - UI Frontend Development Guide

This file provides guidance to Claude Code (claude.ai/code) when working with the CDBaby frontend.

## Project Overview

**CDBaby**

**Frontend Technology Stack:**

- **Next.js 15** + **React 19** + TypeScript with strict type checking
- **TanStack Query** for server state management and caching
- **React Hook Form** + **Zod** for form handling and validation
- **Tailwind CSS** + **shadcn/ui** + **Radix UI** for styling and accessibility
- **Vitest** for testing
- **Next-Auth** for authentication
- **Storybook** for component development and documentation

## Key Development Commands

**Quick Start:**

```bash
npm run dev              # Start development server with hot reload
npm run build           # Build for production
npm run test            # Run all tests
npm run lint            # Run linting with fixes
npm run type-check      # Run TypeScript type checking
npm run storybook       # Start Storybook for component development
```

**Testing & Quality:**

```bash
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
npm run format          # Format code with Prettier
```

## Project Structure

**Key Directories:**

- **`src/api/`**: API client with interceptors and service modules
- **`src/app/`**: Next.js app router pages and layouts
- **`src/shared/`**: Shared hooks, services, types, and utilities
- **`src/modules/`**: Feature-specific modules and providers
- **`src/legacy/`**: Legacy components (being phased out)

## Development Workflow

1. **Planning Phase**: Create plan document in root directory if needed
2. **Implementation**: Follow established patterns and conventions
3. **Testing**: Write tests alongside implementation
4. **Code Quality**: Run linting and type checking before commits

## Configuration

**Environment**: Set up `.env.local` for local development
**Authentication**: FusionAuth configuration in environment variables  
**API**: Backend API service URL configuration
**Storybook**: Component documentation and development environment

## Testing Strategy

- **Frontend**: Vitest for unit and integration tests
- **Components**: Testing Library for React component testing
- **Mocking**: Comprehensive mocking strategy with `__mocks__` directories
- **Always run tests**: `npm run test` before committing

## Architecture Patterns

### State Management Strategy

- **Server State**: TanStack Query for API data, caching, and background synchronization
- **Client State**: React Context and custom providers for global state
- **Form State**: React Hook Form for performant form handling with minimal re-renders
- **Authentication**: Next-Auth for session management

### Routing (Next.js App Router)

- **File-based routing**: Routes defined in `src/app/` directory structure
- **Layout routes**: `layout.tsx` files for shared UI elements
- **Dynamic routes**: `[id]/page.tsx` creates dynamic segments
- **Route Groups**: `(group)/` for organizational purposes without affecting URL
- **Protected Routes**: Authentication guards using middleware and layout components

### Form Management & Validation

- **React Hook Form**: Performant forms with minimal re-renders
- **Zod Integration**: Runtime validation with TypeScript-first schema definition
- **Type Safety**: Single source of truth for data schemas and types
- **Validation Pattern**: Use `@hookform/resolvers` for seamless integration

### UI Components & Styling

- **Tailwind CSS**: Utility-first approach for rapid development
- **shadcn/ui**: Copy-pasteable component library built on Radix UI
- **Radix UI**: Accessibility-compliant primitives (ARIA, keyboard navigation, focus management)
- **Design System**: Consistent theming and component patterns

### Data Fetching Patterns

- **TanStack Query**: Declarative data fetching with automatic caching
- **Query Keys**: Structured naming for cache management
- **Optimistic Updates**: UI updates before server confirmation
- **Error Boundaries**: Graceful error handling and user feedback

### Custom Hooks & Utilities

- **Hook Naming**: Use camelCase naming convention (e.g., `useCustomer.ts`, `useRelease.ts`)
- **TanStack Query Integration**: Custom hooks wrap query/mutation logic with proper caching
- **Type Safety**: Hooks return properly typed data with loading/error states
- **Reusability**: Design hooks for composition and reuse across components
- **Location**: Organize reuseable hooks in `src/shared/hooks/` with comprehensive tests

### Authentication & Authorization

- **FusionAuth**: JWT-based authentication for user management
- **Next-Auth**: Session handling and provider integration
- **Route Protection**: Authentication guards using middleware and auth utilities
- **Token Management**: Automatic token handling via request interceptors

## Code Standards & Linting

### Import Order Rules

The project enforces strict import ordering through ESLint. Imports must be organized as follows:

1. **External libraries** (React, third-party packages)
2. **Internal modules** (relative imports from project)
3. **Type-only imports** (using `import type`)

**Example:**

```typescript
// ✅ Correct import order
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useExampleForm } from './use-example-form';

import type { ExampleFormData } from '@/shared/schemas';
```

**Common Linting Rules:**

- Use nullish coalescing (`??`) instead of logical OR (`||`) for safer defaults
- Add descriptive `id` attributes to clickable elements like buttons
- Follow consistent import grouping and sorting

### Running Code Quality Checks

```bash
npm run lint            # Auto-fix linting issues
npm run type-check      # TypeScript validation
npm run test           # Run all tests
```

## Component Mocking Guidelines

When creating mock components for testing:

1. **Location**: Create mocks in `__mocks__` folder within the component directory
2. **Structure**:
   - Main mock component file: `component-name.tsx`
   - Barrel export: `index.ts` to mimic actual file structure
3. **Implementation**:
   - Simple functional component (no memo, props, or complex logic)
   - Include `data-testid` attribute for testing
   - Export structure should match the original component

## Code Guidelines

- **Order Front End imports according to eslintimport/order**
