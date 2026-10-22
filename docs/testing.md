# Quality Assurance & Testing Suite: BS IT 5th Semester Group Management System
University of Agriculture Faisalabad (UAF) — Department of Information Technology

## 1. Overview & Test Strategy
The BS IT 5th Semester Group Management System employs automated unit, integration, and security verification tests to ensure strict enforcement of academic business rules, database constraints, and authorization boundaries.

Testing spans across five primary tiers:
- **Unit Verification**: Zod schema validation rules, registration number casing normalization, URL protocol scheme checks, and date calculation utilities.
- **Service & Transaction Testing**: Prisma database transactions, intra-group uniqueness enforcement, cross-section registration uniqueness, and deadline cutoff gates.
- **Integration & Security Testing**: Route handler access restrictions, role-based session authorization (Student vs Admin), and PDF buffer generation integrity.
- **Visual & Usability Testing**: Responsive layout behavior on mobile and desktop, glassmorphism contrast, keyboard navigation, and toast notifications.
- **Failure Recovery Testing**: Network timeouts during database writes, deadlocks under concurrent submission load, and transaction rollback verification.

## 2. Test Scenarios & Acceptance Matrix

| Test ID | Category | Description | Input Conditions | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Authorization | Cross-section group creation blocked | M1 student submits group with `sectionCode: "M2"` | Server rejects with `403 Forbidden` |
| **TC-02** | Authorization | Unauthenticated admin access blocked | Unauthenticated GET to `/api/admin/stats` | Redirect to login / `401 Unauthorized` |
| **TC-03** | Authorization | Student cannot mark presentation | Student submits PATCH to `/api/admin/presentation` | Server rejects with `403 Forbidden` |
| **TC-04** | Validation | Missing Leader rejected | Group payload submitted without Leader | Zod validation fails (`400 Bad Request`) |
| **TC-05** | Validation | Missing Member 2 rejected | Group payload with Leader only (1 member total) | Zod validation fails (`400 Bad Request`) |
| **TC-06** | Validation | Optional Members (3-7) allowed | Valid 2, 3, 4, 5, 6, and 7 member payloads | Accepted (`201 Created`) |
| **TC-07** | Validation | Exceeding 7 members rejected | Group submitted with 8 members | Rejected with `400 Bad Request` |
| **TC-08** | Invariant | Intra-group duplicate regNumber | Group has Leader: `2022-AG-1111`, Member 2: `2022-AG-1111` | Rejected: "Duplicate registration number within group" |
| **TC-09** | Invariant | Global regNumber collision | Leader `2022-AG-2222` already active in Group A; Group B submits `2022-AG-2222` | Transaction aborts: `409 Conflict` |
| **TC-10** | Invariant | Resubmission clears conflict | Rejected Group A releases members; members can re-register | Registration succeeds |
| **TC-11** | Workflow | Presentation status toggle | Admin marks group presentation `COMPLETED` | Status updates to `COMPLETED` + AuditLog created |
| **TC-12** | Export | Section M1 PDF contains only M1 | Admin requests M1 PDF export | Only M1 records present; 0 M2 records |
| **TC-13** | Export | Section M2 PDF contains only M2 | Admin requests M2 PDF export | Only M2 records present; 0 M1 records |
| **TC-14** | URL Security | Disallow dangerous protocol schemes | Website link: `javascript:alert(1)` | Zod blocks URL (`400 Bad Request`) |
| **TC-15** | Persistence | Real-time counts accuracy | PostgreSQL aggregate query | Dashboard counters equal exact row counts |
| **TC-16** | Deadline | Expired deadline rejects submissions | Submission attempt after cutoff timestamp | Server returns `403 Forbidden: Deadline closed` |
| **TC-17** | Scheduling | Presentation scheduling updates DB | Admin schedules presentation date, time, and venue | Record saved in `PresentationSchedule` & `Presentation` |
| **TC-18** | Rejection | Rejection reason mandated | Admin clicks reject with blank reason | Client and API reject (`400 Bad Request`) |
| **TC-19** | Upload | Exceeding 15MB file rejected | Upload file with size > 15MB | API returns `400 Bad Request: File exceeds limit` |
| **TC-20** | Upload | Executable files rejected | Upload file ending in `.exe` or `.sh` | API returns `400 Bad Request: Invalid extension` |
| **TC-21** | Concurrency | Race condition registration test | Two concurrent submissions with identical registration number | One succeeds (201), one aborts (409) |
| **TC-22** | Formatting | Registration uppercase conversion | Submission with lowercase `2022-ag-9999` | Stored as uppercase `2022-AG-9999` |

## 3. Test Runner & Execution Commands
Automated test scripts and TypeScript compilation validation:
```bash
# 1. Full TypeScript type checking
npx tsc --noEmit

# 2. Production build verification
npm run build

# 3. Database schema push and client regeneration
npx prisma db push

# 4. Database test seeding
npm run db:seed
```

## 4. Manual Regression Test Plan
1. **Public Landing**: Open `/` and verify two cards: "Start with M1" and "Start with M2", plus "Login as Admin" at top. Verify no admin dashboard is rendered on `/`.
2. **Leader Sign Up**: Navigate to `/register?section=m1`, enter student details, submit, and confirm redirect to `/login`.
3. **Group Submission**: Log in as student, fill group details, leader and member 2 info, enter valid Google Drive HTTPS link, submit, and confirm redirect to `/groups/[id]`.
4. **Duplicate Prevention**: Try submitting the same registration number in another group. Verify the system throws: `"This registration number is already assigned to another group."`
5. **Admin Evaluation**: Log in as `admin.it@uaf.edu.pk` with `UafSecurePass2026!`. Approve a group, reject another with feedback, mark a presentation completed, and schedule an upcoming presentation.
6. **PDF Generation**: Verify downloading individual group PDF dossier and section-wide PDF report. Ensure UAF logo and table headers are cleanly rendered.
7. **Deadline Verification**: Change deadline cutoff to past time; verify countdown displays "Submissions closed" and create requests are blocked.
8. **Audit Trail Verification**: Verify every administrative and student submission action generates an entry in `/admin/audits`.

## 5. Continuous Integration & Quality Gates
- **Type Safety Gate**: Every pull request must pass `npx tsc --noEmit` with zero errors.
- **Build Gate**: `npm run build` must succeed without warnings or dynamic runtime failures.
- **Schema Gate**: Prisma schema must be in sync with the PostgreSQL database.
- **Audit Verification Gate**: Critical admin operations must verify audit log generation before merging.
