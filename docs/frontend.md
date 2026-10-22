# Frontend Architecture & Component Guide: BS IT 5th Semester

## 1. Overview & Visual Design System
The frontend is engineered with Next.js 14 App Router, React 18, and Tailwind CSS. The visual language implements a refined academic neumorphism ("Soft UI") tailored for the University of Agriculture Faisalabad (UAF) Department of Information Technology.

Key visual attributes include:
- **Palette**: Deep academic navy (`#12345B`), deep blue (`#0B2545`), academic accent blue (`#1769AA`), clean background (`#F3F6FB`), soft surface (`#E9EEF5`), and restrained gold (`#E6B84A`).
- **Surface Elevation**: Subtle dual drop-shadows creating soft convex cards and concave inset input elements without muddy borders or low-contrast text.
- **Brand Typography**: Inter sans-serif font pairing crisp weights (medium 500, semibold 600, bold 700) with clear tabular figures for registration numbers.

## 2. Directory Layout & 60-Line Compliance
To guarantee strict compliance with the maximum 60 lines of code per file requirement, components are organized into focused atomic directories:
```
src/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   ├── sections/[code]/
│   │   ├── groups/[id]/
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── m1/
│   │   │   ├── m2/
│   │   │   └── exports/
│   └── api/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── brand-mark.tsx
│   │   └── user-nav.tsx
│   ├── sections/
│   │   ├── section-tabs.tsx
│   │   ├── section-card.tsx
│   │   └── section-header.tsx
│   ├── groups/
│   │   ├── form-header.tsx
│   │   ├── leader-fields.tsx
│   │   ├── member-row.tsx
│   │   ├── project-fields.tsx
│   │   ├── url-fields.tsx
│   │   └── group-card.tsx
│   └── admin/
│       ├── stat-card.tsx
│       ├── filter-bar.tsx
│       ├── group-table-header.tsx
│       ├── group-table-row.tsx
│       ├── confirm-modal.tsx
│       └── pdf-actions.tsx
```

## 3. Routing & Page Architecture
1. **Public/Login Route (`/login`)**:
   - Institutional portal login with tabbed selector for Student vs Administrator.
   - Embeds UAF emblem, bold "IT" department identifier, and validation alerts.
2. **Dashboard Overview (`/`)**:
   - Welcome banner displaying authenticated student's full name, semester, and section.
   - Quick section toggle between M1 and M2.
   - Summary cards displaying active group rosters and upcoming presentations.
3. **Section Hub (`/sections/[code]`)**:
   - Explicit routes `/sections/m1` and `/sections/m2`.
   - Distinct list of approved/pending groups for the selected section.
   - Prominent "Create Group Profile" trigger button.
4. **Group Profile View (`/groups/[id]`)**:
   - Comprehensive group dossier displaying leader, roster (2-7 members), project synopsis, external links.
   - Status indicators for Group Review (`PENDING_REVIEW`, `APPROVED`, `REJECTED`) and Presentation (`PENDING`, `COMPLETED`).
5. **Admin Section Control (`/admin/m1`, `/admin/m2`)**:
   - Searchable, filterable data tables with in-line status modification triggers.

## 4. State Management, Forms & Validation
- **Form Architecture**: React Hook Form coupled with Zod resolver handles the group submission form.
- **Dynamic Member Controls**: Members 3 through 7 are managed via dynamic array fields. Users can append or remove optional member entries without re-rendering the entire form.
- **Client Sanitization**: Registration numbers are auto-capitalized and trimmed as the user types (e.g. `2022-AG-1234`).
- **Validation Feedback**: Inline error labels appear immediately under the offending input with accessible ARIA attributes (`aria-invalid="true"`).

## 5. UI Micro-Interactions & Accessibility
- **Transitions**: Smooth 150ms-200ms cubic-bezier transitions on hover, focus, and state toggles.
- **Reduced Motion**: All animations wrapped in `@media (prefers-reduced-motion: reduce)` fallbacks.
- **Contrast Ratios**: Body text meets WCAG AA standards (minimum 4.5:1 ratio against `#F3F6FB`).
- **Loading Skeletons**: Neumorphic pulse skeletons occupy table rows and cards during server fetches.
