# Security Architecture & Threat Model: BS IT 5th Semester Group Management System
University of Agriculture Faisalabad (UAF) — Department of Information Technology

## 1. Executive Security Policy
The BS IT 5th Semester Group Management System handles institutional academic project submissions, student identification records, and faculty grading evaluations. Security controls are implemented directly at the application service and database tiers rather than relying on frontend obscurity or client-side checks.

## 2. Authentication & Credential Protection
- **Cryptographic Hashing**: User passwords are encrypted using `bcryptjs` with an adaptive salt work factor of 12 rounds. Plaintext passwords are never stored in memory or persisted to disk.
- **Session Tokens**: Sessions utilize encrypted, HTTP-only, `SameSite=Lax` JSON Web Tokens (JWT) signed using a 256-bit server secret (`NEXTAUTH_SECRET`) to prevent Cross-Site Scripting (XSS) token theft.
- **Credential Masking**: Sensitive credential fields (`passwordHash`, private tokens) are excluded from all Prisma select queries returned to the client.
- **Session Hijacking Mitigation**: JWT cookies are tied to user identifiers and validated on every sensitive server-side Route Handler and Server Action.
- **Secure Password Reset**: Passwords require a minimum length of 6 characters and complexity enforcement. Default development passwords are isolated to local test seeds.

## 3. Role-Based Access Control (RBAC) Matrix
The application enforces strict server-side RBAC across two core user roles:

| Action / Resource | Unauthenticated | Student (Own Section) | Student (Other Section) | Administrator |
| :--- | :--- | :--- | :--- | :--- |
| View Landing Page (`/`) | Allowed | Allowed | Allowed | Allowed |
| View Section Roster (`/sections/*`) | Allowed | Allowed | Allowed | Allowed |
| Register Student Leader Account | Allowed | Denied | Denied | Denied |
| Create Group Profile | Denied (401) | Allowed | Denied (403) | Allowed |
| View Group Profile | Allowed | Allowed | Allowed | Allowed |
| Edit / Resubmit Group Profile | Denied (401) | Allowed (Creator) | Denied (403) | Allowed |
| Approve / Reject Group | Denied (401) | Denied (403) | Denied (403) | Allowed |
| Toggle Presentation Status | Denied (401) | Denied (403) | Denied (403) | Allowed |
| Schedule Presentation Session | Denied (401) | Denied (403) | Denied (403) | Allowed |
| Configure Submission Deadline | Denied (401) | Denied (403) | Denied (403) | Allowed |
| Export Individual Group PDF | Denied (401) | Allowed (Creator) | Denied (403) | Allowed |
| Export Section-Wide PDF | Denied (401) | Denied (403) | Denied (403) | Allowed |
| View System Audit Trail | Denied (401) | Denied (403) | Denied (403) | Allowed |
| Download Project Attachments | Denied (401) | Allowed | Allowed | Allowed |

## 4. Input Sanitization & Injection Prevention
- **SQL Injection Prevention**: All database interactions execute via Prisma ORM parameterized queries. Raw string concatenations inside SQL statements are prohibited across the entire codebase.
- **Cross-Site Scripting (XSS)**: React JSX automatically encodes user inputs prior to DOM injection. Project descriptions and group names are sanitized before rendering or inclusion in PDF buffers.
- **URL Scheme Validation**: Project external links (Google Drive PDF, GitHub, Website) are strictly validated against `https://` protocols via Zod schemas. Malicious schemes such as `javascript:`, `vbscript:`, or `data:` are blocked at parse time.
- **Data Normalization**: Registration numbers are trimmed and converted to uppercase on input to prevent duplicate bypasses via casing manipulation (e.g. `2022-ag-1234` vs `2022-AG-1234`).
- **CSRF Defense**: State-changing POST, PUT, and PATCH routes require authenticated sessions and validate NextAuth anti-forgery headers.

## 5. File Upload & Storage Security
- **Strict MIME & Extension Whitelist**: Only document formats (`.pdf`, `.ppt`, `.pptx`, `.doc`, `.docx`) matching permitted MIME types (`application/pdf`, `application/msword`, etc.) are accepted.
- **Size Enforcing**: Upload requests are constrained to a maximum of 15MB.
- **Path Traversal Protection**: Uploaded files receive sanitized timestamped random identifiers; client-supplied file paths are never used in filesystem operations.
- **No Direct Execution**: The upload directory disables server-side script execution, and attachments are served with appropriate content-type headers.
- **Malware Signature Checks**: File headers and extensions are cross-validated during the multipart form parsing phase.

## 6. Deadline Tamper Resistance
- **Server-Side Enforcement**: The submission cutoff is enforced in `group-create.service.ts` and `api/groups` handlers. Modifying browser clocks or frontend state cannot bypass an expired deadline.
- **Timezone Standardization**: Deadlines are configured and rendered against Pakistan Standard Time (Asia/Karachi, UTC+5) while stored in standard UTC timestamps in PostgreSQL.
- **Administrative Override Policy**: Only authorized instructors can bypass an expired deadline, and every override generates an explicit audit log record.

## 7. Audit Logging & Non-Repudiation
Every state-altering administrative and group lifecycle action generates an immutable audit record in PostgreSQL containing:
- `actorUserId`: The authenticated user ID responsible for the change.
- `action`: e.g. `GROUP_CREATED`, `GROUP_RESUBMITTED`, `UPDATE_GROUP_REVIEW_STATUS`, `UPDATE_PRESENTATION_STATUS`, `DEADLINE_CONFIGURED`.
- `entityType`: The modified entity (`Group`, `Presentation`, `SubmissionDeadline`).
- `entityId`: Unique identifier of the target record.
- `previousValue` and `newValue`: JSON-serialized snapshots of the state change.
- `createdAt`: High-precision server timestamp.

## 8. Security Headers & Network Hygiene
The application deploys standard HTTP security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 9. Incident Response & Threat Mitigation
- **Credential Brute-Force**: IP and account rate limiting locks out excessive failed authentication attempts.
- **Data Loss Prevention**: Database backups and point-in-time recovery (PITR) are enabled on Neon PostgreSQL.
- **Disclosure Controls**: Stack traces and database internals are suppressed in production HTTP responses.
