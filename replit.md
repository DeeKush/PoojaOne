# PoojaOne - Pandit Booking Platform

## Overview

PoojaOne is a production-ready web application for booking verified pandits (priests) for home and office poojas in Bangalore. The platform targets busy working professionals in areas like Whitefield, Koramangala, HSR Layout, and Indiranagar. It features a hybrid booking system that can auto-confirm simple bookings while flagging complex ones for manual review.

The application offers five core pooja services at launch: Griha Pravesh, Satyanarayan Pooja, Lakshmi Pooja, Ganesh Pooja, and Rudrabhishek. Users can choose between priest-only service or full-service with materials, and optionally specify language preferences (Kannada, Hindi, Telugu).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure
**Monorepo Architecture**: The codebase is organized as a monorepo with clear separation between client, server, and shared code:
- `/client` - React frontend with TypeScript
- `/server` - Node.js/Express backend with TypeScript
- `/shared` - Shared schema definitions and types using Drizzle-Zod
- `/attached_assets` - Static assets including generated images

**Build System**: Uses Vite for client bundling and esbuild for server bundling, with a custom build script that bundles select dependencies to optimize cold start times. The application is optimized for production deployment with separate development and production modes.

### Frontend Architecture
**Framework**: React 18 with TypeScript in SPA mode using Wouter for client-side routing.

**UI System**: Built on shadcn/ui (New York variant) with Radix UI primitives, providing a comprehensive component library with consistent styling. The design follows a premium devotional aesthetic with navy blue primary color and gold accents, balancing modern and traditional elements.

**Design System**:
- Typography: Inter/Poppins for body text, Cormorant Garamond/Playfair Display for devotional headings
- Spacing: Tailwind's spacing scale (4, 6, 8, 12, 16, 20, 24 units) for consistent rhythm
- Mobile-first approach with responsive breakpoints
- Custom CSS variables for theming with light mode support

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Form state managed via React Hook Form with Zod validation.

**Routing Strategy**: Client-side routing with four main routes:
- Home (`/`) - Hero section with pooja listings
- Pooja Details (`/pooja/:slug`) - Individual pooja information
- Check Availability (`/check-availability`) - Booking form
- Booking Status (`/booking/:id`) - Confirmation page

### Backend Architecture
**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with the following endpoints:
- `GET /api/poojas` - List all active poojas
- `GET /api/poojas/:slug` - Get pooja details
- `GET /api/zones` - List all active zones
- `POST /api/bookings` - Create booking with hybrid confirmation logic

**Request Handling**: Custom middleware for JSON parsing with raw body capture (for potential webhook support), request logging with timing, and static file serving in production.

**Development Mode**: Vite integration for HMR and fast refresh during development, with automatic template reloading.

### Data Layer
**ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations.

**Schema Design**: The database schema includes:
- `zones` - Service coverage areas
- `poojas` - Available pooja services with pricing ranges
- `priests` - Pandit profiles with language support
- `priestZones` - Many-to-many relationship between priests and zones
- `availabilitySlots` - Time-based availability tracking
- `bookings` - Customer bookings with status tracking
- `admins` - Administrative user accounts

**Storage Abstraction**: Interface-based storage layer (`IStorage`) allowing for easy swapping of implementation (currently in-memory for development, designed for PostgreSQL in production).

**Validation**: Shared Zod schemas using drizzle-zod for consistent validation between client and server, with frontend-specific extensions for UI validation (phone numbers, email, pincode).

### Hybrid Booking Logic
The platform implements intelligent booking confirmation:
- **Auto-confirmation criteria**: Simple bookings that meet predefined conditions are instantly confirmed
- **Pending confirmation**: Complex bookings (e.g., unavailable language in chosen slot) are flagged for manual review by operations team
- **Status tracking**: Bookings progress through states: pending_confirmation, confirmed, completed, cancelled

### Design Philosophy
**Premium Devotional**: The UI balances modern usability with respectful, elevated aesthetics that honor religious traditions. Inspired by premium platforms like Airbnb (trust), Headspace (calm), and Stripe (simplicity).

**Trust-First**: Clear information hierarchy, transparent pricing ranges (no payment integration yet), and professional presentation to build user confidence.

**Mobile-Optimized**: Given 60%+ mobile usage expectation, the design prioritizes touch interactions and vertical scrolling.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TanStack Query for data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Backend**: Express.js, Node.js built-in modules (http, fs, path, crypto)

### Database & ORM
- **Database**: PostgreSQL (via `@neondatabase/serverless` for Neon/Turso compatibility)
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Schema Validation**: Zod with drizzle-zod integration

### UI Component Libraries
- **Component Primitives**: Extensive Radix UI library (@radix-ui/react-*) for accessible, unstyled components
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for variant management
- **Icons**: Lucide React for icon system
- **Utilities**: clsx and tailwind-merge for className composition

### Form Handling & Validation
- **Forms**: React Hook Form for form state management
- **Validation**: @hookform/resolvers for Zod integration with forms
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **Build Tools**: Vite (frontend), esbuild (backend), tsx for TypeScript execution
- **Type Checking**: TypeScript with strict mode enabled
- **Code Quality**: ESLint configuration (implied from setup)

### Replit-Specific Integration
- **Development Plugins**: @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner for enhanced development experience

### Session & Security (Prepared for future use)
- **Session Management**: express-session, connect-pg-simple (for PostgreSQL session store)
- **Authentication**: passport, passport-local (not yet implemented)

### Additional Utilities
- **ID Generation**: nanoid for unique identifiers
- **Carousel**: embla-carousel-react for image carousels
- **Command Menu**: cmdk for command palette functionality

Note: The application references Turso DB in documentation but uses PostgreSQL-compatible drivers, allowing flexibility in database provider choice (Neon, Turso, or standard PostgreSQL).