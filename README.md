# UAF BS IT 5th Semester Group Management System
University of Agriculture Faisalabad (UAF) — Department of Information Technology

Official full-stack web application for the **University of Agriculture Faisalabad (UAF)**, Department of Information Technology, to manage BS Information Technology 5th Semester student sections (M1 and M2), project group registrations, faculty proposal reviews, live deadline cutoffs, presentation evaluations, and official PDF reporting.

---

## 1. Key Features
- **Modern Glassmorphism UI**: High-end frosted glass aesthetic (`backdrop-blur-xl`, `border-white/40`, subtle ambient gradients) themed with official UAF forest green (`#135835`), gold, and crisp typography.
- **Strict Section Segregation**: Complete separation of Section M1 and Section M2 student rosters, project allocations, and PDF exports.
- **Dedicated Public Landing Page**: Features UAF seal, BS IT 5th Semester branding, live deadline countdown timer in Asia/Karachi (PKT), "Login as Admin" portal trigger, and two prominent container cards: **Start with M1** and **Start with M2**.
- **Student Leader Account System**: Leaders can register new accounts (`/register`) with automatic section assignment and university registration number linking.
- **Strict Group Constraints**:
  - Exactly 1 Team Leader and 1 Member 2 are mandatory.
  - Optional Members 3 to 7.
  - Overall team size strictly 2 to 7 members.
- **Global Registration Number Uniqueness**: Registration numbers are validated and enforced across all active groups in both M1 and M2. Rejected groups release reservations upon resubmission.
- **Decoupled Dual Status Architecture**:
  - Review Status: `PENDING_REVIEW`, `APPROVED`, `REJECTED`.
  - Presentation Status: `PENDING`, `COMPLETED`.
- **Administrative Control Suite (`/admin`)**:
  - Live statistics queried directly from PostgreSQL.
  - M1 and M2 independent tables with all 13 columns (Group Name, Leader, Members, Project Idea, Description, Drive PDF, Links, Statuses, Submission Date, Actions).
  - Inline approval, rejection with mandatory remarks, and presentation completion marking.
  - Upcoming presentation scheduler (date, time, venue, notes).
  - Real-time submission deadline manager with server-side cutoff enforcement.
  - Comprehensive immutable audit trail (`/admin/audits`).
- **Server-Side PDF Engine**: One-click download for Single Group Dossier PDFs and Section-wide Matrix PDFs with official UAF emblem and vector layouts.

---

## 2. Technology Stack
- **Framework**: Next.js 14.2.15 (App Router with Server Components & Route Handlers)
- **Language**: TypeScript 5.6.3 (Strict Mode)
- **Database**: PostgreSQL 15+ hosted on Neon Serverless Postgres
- **ORM**: Prisma ORM v5.21.1 with connection pooling
- **Styling**: Tailwind CSS v3.4.14 with glassmorphism backdrop tokens
- **Authentication**: NextAuth v4.24.10 (JWT strategy) + bcryptjs password hashing
- **Schema Validation**: Zod v3.23.8
- **Icons**: Lucide React
- **Document Export**: jsPDF v4.2.1

---

## 3. Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- Neon PostgreSQL database instance (already configured in `.env`)

### Installation & Run
1. Install dependencies:
   ```bash
   npm install
   ```

2. Synchronize database schema:
   ```bash
   npx prisma db push
   ```

3. Seed initial sections and demo accounts:
   ```bash
   npm run db:seed
   ```

4. Build and verify:
   ```bash
   npm run build
   ```

5. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Default Seed Accounts for Testing
- **Department Administrator**:
  - Email: `admin.it@uaf.edu.pk`
  - Password: `UafSecurePass2026!`
  - Role: `ADMIN`
- **Student Leader (Section M1)**:
  - Email: `student.m1@uaf.edu.pk`
  - Password: `UafSecurePass2026!`
  - Role: `STUDENT` (Section M1)
- **Student Leader (Section M2)**:
  - Email: `student.m2@uaf.edu.pk`
  - Password: `UafSecurePass2026!`
  - Role: `STUDENT` (Section M2)

---

## 5. Architectural Documentation
Comprehensive documentation is located in the `/docs` directory (each document >= 60 lines):
- [System Design](docs/system-design.md)
- [Frontend Architecture](docs/frontend.md)
- [Backend Specification](docs/backend.md)
- [Security Architecture](docs/security.md)
- [Product Requirements Document (PRD)](docs/prd.md)
- [Technical Requirements Document (TRD)](docs/trd.md)
- [Database Schema & ERD](docs/database-schema.md)
- [User Workflows](docs/user-flow.md)
- [API Reference](docs/api-reference.md)
- [Testing & Acceptance Matrix](docs/testing.md)
