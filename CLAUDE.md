# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a photography portfolio website showcasing analog/film photography projects built with Next.js 15, TypeScript, Sanity CMS, and Tailwind CSS. The project features two main photography categories: "Black & White" and "Early Color" with detailed project views and photo galleries.

## Development Commands

```bash
# Main development
yarn dev              # Start Next.js development server on localhost:3000
yarn build            # Build for production  
yarn start            # Start production server
yarn lint             # Run ESLint
yarn format           # Format code with Prettier

# Sanity CMS Studio (run from sanity/ directory)
cd sanity/
yarn dev              # Start Sanity Studio (separate port)
yarn build            # Build Sanity Studio
yarn deploy           # Deploy Studio to Sanity
```

**Important**: This project uses Yarn as the package manager - npm is blocked in package.json.

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router and TypeScript
- **Sanity CMS** (v3.67.1) for content management with custom studio
- **Zustand** for global state management with persistence
- **Framer Motion** for page transitions and animations
- **Tailwind CSS** + SCSS modules for styling
- **ImageKit** integration for optimized image delivery

### Key Architectural Patterns

**Adapter Pattern**: Services are abstracted through adapters in `src/adapters/`:
- `SanityAdapter` - CMS operations
- `NextNavigationAdapter` - Navigation handling

**State Management Strategy**:
- `src/store/projectsStore.ts` - Projects data with intelligent caching and category filtering
- `src/store/animationStore.ts` - Coordinating page transition animations
- Uses Zustand with persistence for client-side state

**Component Architecture**:
- `src/app/components/` - App-specific components  
- `src/components/ui/` - Reusable UI components
- `src/components/transitions/` - Animation components
- Server/client component separation following Next.js 15 patterns

**Image Optimization Pipeline**:
- ImageKit CDN integration for optimized delivery
- Sanity Image URLs for CMS images  
- Custom image components with loading states

### Project Structure
```
src/
├── app/                    # Next.js App Router
├── components/ui/          # Reusable UI components
├── adapters/              # Service abstraction layer
├── store/                 # Zustand state management
├── hooks/                 # Custom React hooks (useServices, useTransitionNavigation)
├── animations/            # Animation system with reusable variants
└── lib/                   # Utilities and configurations

sanity/                    # Sanity CMS Studio (independent)
├── schemas/              # Content schemas
└── components/           # Studio customizations
```

## Content Management

The project uses Sanity CMS with a custom studio configuration:
- **Sanity Studio** runs independently on a different port than the main app
- **Schema Management** through TypeScript definitions in `sanity/schemas/`
- **Real-time Updates** through Sanity's APIs with client-side caching
- Content is organized by photography categories with project-based structure

## Development Guidelines

**Code Style**: Follow cursor rules in `.cursor/rules/`:
- Use camelCase for variables/functions, PascalCase for components
- Implement strict TypeScript with proper typing
- Follow Next.js 15 App Router patterns with server/client component separation
- Use Tailwind CSS for styling with responsive, mobile-first approach

**State Management**: 
- Use Zustand for global state with TTL-based caching
- Implement optimistic updates and loading states
- Category-based project filtering with memoization

**Animation System**:
- Page transitions coordinated through `animationStore`
- Reusable animation variants in `src/animations/transitions.ts`
- Framer Motion integration for smooth UX

**Image Handling**:
- Use Next.js Image component for optimization
- ImageKit integration for CDN delivery
- Lazy loading and responsive image handling

## Common Development Tasks

**Adding New Photography Categories**:
1. Update Sanity schemas in `sanity/schemas/`
2. Add route in `src/app/[category]/`
3. Update navigation adapters and store logic
4. Test category filtering and caching

**Working with Animations**:
- Animation states managed in `src/store/animationStore.ts`
- Reusable variants in `src/animations/transitions.ts`
- Use `useTransitionNavigation` hook for coordinated page transitions

**Content Updates**:
- Use Sanity Studio for content management
- Changes reflect in real-time with client-side caching
- Cache invalidation handled automatically on route changes