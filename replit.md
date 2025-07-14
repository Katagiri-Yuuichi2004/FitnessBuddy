# FitConnect - Fitness Dating App

## Overview

FitConnect is a modern fitness-focused dating application built with React, Express.js, and PostgreSQL. The app helps users find workout partners and romantic connections based on shared fitness goals, preferences, and location. It features a swipe-based matching system, real-time messaging, and comprehensive user profiles focused on fitness attributes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with standard HTTP methods
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite middleware integration

### Database Architecture
- **Primary Database**: PostgreSQL (via Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Data Validation**: Zod schemas for runtime validation
- **Storage Pattern**: Abstracted storage interface with in-memory implementation for development

## Key Components

### Data Models
- **Users**: Complete fitness profiles with goals, workout preferences, experience levels, and location data
- **Matches**: Bidirectional matching system with status tracking (pending, matched, rejected)
- **Messages**: Real-time messaging between matched users with read status

### Core Features
- **Discovery System**: Location-based user discovery with swipe interface
- **Matching Algorithm**: Mutual like system for creating connections
- **Messaging Platform**: Real-time chat interface between matched users
- **Profile Management**: Comprehensive fitness-focused profile editing

### UI Components
- **Match Cards**: Tinder-style swipe interface for user discovery
- **Chat Interface**: Real-time messaging with typing indicators
- **Navigation**: Responsive navigation with mobile-first design
- **Profile Forms**: Dynamic form handling with validation

## Data Flow

### User Discovery Flow
1. Frontend requests nearby users from `/api/users/:id/nearby`
2. Backend queries users based on location and exclusion list
3. User interactions (swipe left/right) create match records
4. Mutual matches unlock messaging capabilities

### Messaging Flow
1. Messages sent via POST to `/api/messages`
2. Real-time updates through query invalidation
3. Conversation history retrieved from `/api/conversations/:userId`
4. Read status tracking for message delivery confirmation

### Profile Management
1. User data fetched from `/api/users/:id`
2. Profile updates via PUT requests with Zod validation
3. Image uploads handled through profile image fields
4. Fitness preferences stored as JSON arrays

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Component variant management

### Data and State
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Schema validation and type inference
- **React Hook Form**: Form state management

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Production bundling
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite middleware integration with Express
- **Database**: Neon PostgreSQL with connection pooling
- **Asset Serving**: Vite handles static assets and client-side routing
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds optimized React bundle
- **Backend**: ESBuild creates Node.js bundle
- **Static Assets**: Served from Express with client-side routing fallback
- **Database**: Production PostgreSQL with connection pooling

### Key Configuration
- **TypeScript**: Strict mode with path aliases for clean imports
- **Tailwind**: Custom design system with CSS variables
- **Drizzle**: PostgreSQL dialect with migration management
- **Vite**: Custom aliases and build optimization