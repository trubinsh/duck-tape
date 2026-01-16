# Project Guidelines

## Project Overview
This is a React application built with **Vite**, **TypeScript** and **Mantine**. It uses **React Router** for navigation and **@tabler/icons** for iconography. 
Project is an all-in-one application for developers that provides data transformation, generation, vlaidation, etc. tools. All processing is done 
client-side, without any backend services.

## Tech Stack
- **Framework**: React 19+ (Vite)
- **Components**: Mantine@8.3.12
- **Icons**: Tabler Icons (`@tabler/icons`)
- **Routing**: React Router DOM

## Code Style & Standards

### Components
- **Functional Components**: Use `function ComponentName() {}` or `export function ComponentName() {}` instead of arrow functions where appropriate.
- **File Naming**: Use kebab-case for files (e.g., `app-sidebar.tsx`) and PascalCase for component names.
- **Imports**: 
  - Use absolute paths with the `@/` alias (e.g., `@/components/ui/button`).
  - Group imports: React first, then external libraries, then internal components/utils.
- **Props**: Use `React.ComponentProps<"element">` for extending standard HTML elements.

### State Management
- Use `useState` and `useReducer` for local state.
- Use `useContext` sparingly for global state (e.g., Sidebar state).

## Directory Structure
- `src/assets/`: Static assets like images and SVGs.
- `src/pages/`: Page-level components.
- `src/lib/`: Utility functions and shared logic.

## UI Principles
- **Retractability**: Sidebar is not collapsible.
- **Responsiveness**: Use `useIsMobile` hook for mobile-specific layouts.
- **Navigation**: Use `Link` from `react-router-dom` for internal navigation.
- **Placeholders**: Use `LoadingOverlay` components during data loading.
- **Error Handling**: 
  - Use `ErrorBoundary` for global error handling.
  - Use `useError` hook for local error handling.
  - Use `Dialog` component for error messages.

## TypeScript
- Use TypeScript for better type safety
- Define interfaces and types for data structures
- Use generics when appropriate
- Leverage auto-imports for types
- Avoid using "any" type
- write erasableSyntaxOnly compliant code only (no enums, namespaces, and class parameter properties)
