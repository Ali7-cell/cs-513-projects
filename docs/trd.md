# Technical Requirements Document (TRD): BS IT 5th Semester Group Management System
University of Agriculture Faisalabad (UAF) — Department of Information Technology

## 1. System Environment & Runtime Stack
The technical architecture of the BS IT 5th Semester Group Management System is built with modern, LTS-supported open-source frameworks:
- **Node.js**: v18.17.0+ or v20.x+ LTS runtime.
- **Next.js**: v14.2.15 (App Router with React Server Components and Route Handlers).
- **TypeScript**: v5.6.3 with strict type checking enabled (`strict: true`, `noImplicitAny: true`).
- **Database Engine**: PostgreSQL 15+ hosted on Neon Serverless Postgres with autoscaling and branching.
- **ORM / Query Builder**: Prisma ORM v5.21.1 with Prisma Client.
- **Styling Framework**: Tailwind CSS v3.4.14 with PostCSS, custom glassmorphism backdrops, and academic emerald/gold tokens.
- **Component Icons**: Lucide React.
- **Validation**: Zod v3.23.8 for runtime input and schema contracts.
- **Authentication**: NextAuth v4.24.10 with CredentialsProvider and encrypted JWT strategy.
- **Cryptographic Security**: bcryptjs v3.0.3 for salt-hashed password generation.
- **PDF Engine**: jsPDF v4.2.1 for server-side generation of printable documents with embedded official UAF seals.

## 2. Infrastructure & Hosting Architecture
- **Application Deployment Target**: Compatible with Node.js container hosts (Vercel, Railway, Render, Docker).
- **Database Deployment**: Neon Serverless PostgreSQL with connection pooling (`pgbouncer=true` on port 5432) and direct migration URL (`DIRECT_URL`).
- **Storage Strategy**: Group project documents are referenced as validated external HTTPS links (Google Drive, GitHub, Live URLs). Optional attachments are processed through the file upload service with metadata persisted in the `ProjectAttachment` table in PostgreSQL. In-app PDF exports are generated on-the-fly and streamed directly to clients as binary buffers.

## 3. Environment Variables Specification
The system requires the following environment variables defined in `.env` (mirrored in `.env.example`):
```bash
# Neon PostgreSQL Connection URLs
DATABASE_URL="postgresql://neondb_owner:***@ep-broad-fire-b30vky3w-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:***@ep-broad-fire-b30vky3w.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="uaf_jwt_secret_key_super_secure_random_hash_2026"

# Neon Auth Configuration (Optional Integration)
NEON_BRANCH=production
NEON_AUTH_BASE_URL=https://ep-broad-fire-b30vky3w.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth
NEON_AUTH_JWKS_URL=https://ep-broad-fire-b30vky3w.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth/.well-known/jwks.json
```

## 4. Application Tier & Service Layer Design
The codebase is structured according to domain-driven separation of concerns:
- **Presentation Tier (`/src/app`)**: Route Handlers, React Server Components (RSC) for zero-JS initial renders, and interactive Client Components for forms, modals, and countdown timers.
- **Service Tier (`/src/lib/services`)**: Reusable business logic containing `group-create.service.ts`, `group-query.service.ts`, `review.service.ts`, `presentation.service.ts`, `deadline.service.ts`, `stats.service.ts`, and `audit.service.ts`.
- **Validation Tier (`/src/lib/validation`)**: Strict Zod schemas enforcing data contracts, URL safety, and member count boundaries.
- **Reporting Tier (`/src/lib/pdf`)**: In-memory PDF synthesis using jsPDF, utilizing vector drawing for headers, page numbers, and typographic hierarchies.

## 5. Database Concurrency & Invariant Enforcement
- **Transactional Atomicity**: Group formulation, member insertion, project details, review history, and audit logging execute within an atomic `prisma.$transaction()` block. If any step fails (e.g. duplicate registration number collision), the entire transaction rolls back.
- **Isolation Level**: Read Committed with optimistic conflict checks in `findConflictingRegNumbers()`.
- **Membership Reservation Logic**: Active registration numbers are reserved only if `isActive == true` and group `reviewStatus != 'REJECTED'`. This guarantees that rejected groups release their reservations, allowing members to be re-assigned or resubmitted.
- **Deadlock Mitigation**: In multi-record membership mutations, records are ordered deterministically by registration number before query execution.

## 6. Performance & Scalability Targets
- **Target Response Time**: < 250ms for cached group listings; < 500ms for database transactional writes and search queries.
- **Query Optimization**: Foreign keys indexed; compound indexes on `(regNumber, isActive)` and unique index on `(sectionId, groupName)`.
- **Database Connection Management**: Prisma connection pool tuned for Neon serverless architecture to avoid connection exhaustion.
- **Memory Footprint**: < 200MB active RAM during concurrent PDF streaming.
- **Timezone Standardization**: All business logic and UI timers operate on `Asia/Karachi` (PKT).
- **Asset Optimization**: High-resolution UAF logo optimized for web delivery (< 30KB) and embedded into server-side PDF exports.

## 7. Build Pipeline & Deployment Verification
The application uses the standard Next.js optimization compiler:
- Webpack tree shaking for Lucide icons and UI primitives.
- Dynamic route segment caching for static assets.
- Production bundle verification via `npm run build` producing optimized stand-alone server routes.

## 8. Backup & Disaster Recovery
- Point-in-time recovery enabled with continuous automated WAL archiving on Neon.
- Database branch snapshots configured prior to schema migrations and exam evaluation sessions.
- Audit trail isolation ensures administrative grading cannot be wiped or overridden without a trace.
