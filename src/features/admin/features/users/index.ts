/**
 * Users Feature - Admin
 * Following: docs/02-architecture/01-feature-based-structure.md
 * 
 * Public API exports for the users feature
 */

// Components
export * from './components';

// Hooks
export * from './hooks';

// Pages
export * from './pages';

// Types
export type { User, UpdateUserInput } from './types';
export type { UpdateUserFormData } from './types/validation';

// Services (generally not exported, used internally by hooks)
// If needed by other features, export through shared layer
