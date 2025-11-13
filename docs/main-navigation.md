# Project Documentation - Learn Quiz English

> **Purpose**: This documentation serves as the single source of truth for all development standards, patterns, and practices. All AI assistants and developers must follow these guidelines when contributing to the project.

## 📚 Documentation Structure

### 01. [Project Overview](./01-project-overview.md)
High-level overview of the project architecture, technology stack, and design decisions.

### 02. Architecture
- [Feature-Based Structure](./02-architecture/01-feature-based-structure.md) ⭐
- [Shared Resources](./02-architecture/02-shared-resources.md)
- [API Routes](./02-architecture/03-api-routes.md)

### 03. Code Standards
- [Design Patterns](./03-code-standards/01-design-patterns.md)
- [Component Architecture](./03-code-standards/02-component-architecture.md)
- [Naming Conventions](./03-code-standards/03-naming-conventions.md)

### 04. TypeScript
- [TypeScript Practices](./04-typescript/01-typescript-practices.md)
- [Validation](./04-typescript/02-validation.md)

### 05. Error Handling
- [Error Patterns](./05-error-handling/01-error-patterns.md)
- [Security](./05-error-handling/02-security.md)

### 06. Performance
- [Optimization](./06-performance/01-optimization.md)

### 07. Examples & Templates
- [Feature Creation](./08-examples/01-feature-creation.md)
- [Templates](./08-examples/02-templates.md)

---

## 🚀 Quick Start for AI Assistants

When working on this project:

1. **Always read** the relevant documentation section before generating code
2. **Follow** the feature-based structure outlined in `02-architecture/01-feature-based-structure.md`
3. **Use** TypeScript strictly with proper type definitions
4. **Apply** the naming conventions from `03-code-standards/03-naming-conventions.md`
5. **Implement** error handling as specified in `05-error-handling/01-error-patterns.md`

## 🎯 Core Principles

- **Feature Isolation**: Each feature is self-contained with its own components, hooks, services, and types
- **Type Safety**: Strict TypeScript with no `any` types
- **Consistency**: Follow established patterns across all features
- **Performance**: Server components by default, client components only when necessary
- **Security**: RLS policies, input validation, and secure API routes

## 📦 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand, TanStack Query
- **UI Library**: Shadcn/ui (Radix UI + Tailwind CSS)
- **Authentication**: Supabase Auth
- **Payment**: LemonSqueezy
- **Storage**: AWS S3 (Cloudflare R2)

---

## 📝 Contributing

Before making any changes:
1. Review the relevant documentation
2. Ensure your code follows all standards
3. Update documentation if adding new patterns
4. Test thoroughly before committing

## 🔍 Finding Information

- **Component patterns**: `03-code-standards/02-component-architecture.md`
- **API structure**: `02-architecture/03-api-routes.md`
- **Type definitions**: `04-typescript/01-typescript-practices.md`
- **Error handling**: `05-error-handling/01-error-patterns.md`
- **Examples**: `08-examples/` directory

---

Last Updated: November 2025
Version: 1.0.0