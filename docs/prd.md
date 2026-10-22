# Product Requirements Document (PRD): BS IT 5th Semester Group Management System
University of Agriculture Faisalabad (UAF) — Department of Information Technology

## 1. Problem Statement & Background
The Department of Information Technology at the University of Agriculture Faisalabad (UAF) conducts capstone and semester project evaluations for 5th-semester BS Information Technology students across two morning sections: Section M1 and Section M2. 

Historically, project group registration and presentation coordination suffered from:
- Duplicate student registrations across multiple groups and sections.
- Disorganized tracking of project proposals, documentation links, and presentation evaluations.
- Lack of section isolation leading to accidental cross-section record mixing and reporting errors.
- Inefficient manual paper reporting and absence of audit trails for faculty evaluations.
- Missing centralized enforcement of departmental deadlines, resulting in disputed submissions.

## 2. Product Objectives
- **Strict Section Segregation**: Fully isolate Section M1 and Section M2 groups and reports while providing authorized instructors with a unified administrative control center.
- **Enforced Group Integrity**: Enforce team constraints (2 to 7 members, mandatory leader and member 2) with system-wide registration number uniqueness across both M1 and M2.
- **Transparent Status Tracking**: Decouple Group Review Status (`PENDING_REVIEW`, `APPROVED`, `REJECTED`) from Presentation Status (`PENDING`, `COMPLETED`).
- **Submission Deadline Enforcement**: Provide server-side deadline enforcement with live countdown timers displayed in Pakistan Standard Time (Asia/Karachi).
- **Presentation Scheduling**: Coordinate examination sessions with assigned dates, times, venues, and student instructions.
- **Professional Institutional Reporting**: Deliver one-click individual group PDF dossiers and comprehensive section-wide PDF registers featuring official UAF branding.

## 3. User Personas & Roles
### 3.1 Student Team Leader
- **Demographics**: 5th Semester BS IT student enrolled in Section M1 or M2.
- **Goals**: Create an account, register project title and description, assign team members, submit proposal documents before the cutoff deadline, and track evaluation progress.
- **Pain Points**: Confusion over assigned members, lack of clarity regarding rejection reasons, and anxiety over deadline cutoffs.

### 3.2 Student Team Member
- **Demographics**: 5th Semester BS IT student collaborating on a group project.
- **Goals**: Confirm their registration number is reserved in their group and view project status.

### 3.3 Course Instructor / Department Administrator
- **Demographics**: Faculty member or departmental coordinator managing BS IT 5th Semester coursework.
- **Goals**: Monitor registration statistics in real time, review project proposals, provide actionable rejection feedback, schedule presentations, mark presentation outcomes, and export official PDF rosters for department records.
- **Pain Points**: Duplicate registration conflicts, unformatted spreadsheets, lack of accountability logs for mark changes, and manual document tracking.

## 4. Functional Requirements
### 4.1 Authentication & Account Management
- **FR-01**: Team leaders must register with their Full Name, institutional email, password, assigned section (M1/M2), and official university registration number (e.g. `2022-AG-1234`).
- **FR-02**: Passwords must be hashed using bcrypt with salt rounds of 12. Plaintext passwords must never be stored or logged.
- **FR-03**: Role-based access control must differentiate between `STUDENT` and `ADMIN` privileges. Student accounts can never escalate their privileges.
- **FR-04**: Dedicated administrative login route (`/login?admin=true`) directs authorized faculty to the protected dashboard (`/admin`).

### 4.2 Group Creation & Validation
- **FR-05**: A group must specify a unique Group Name within its assigned section.
- **FR-06**: Team Leader (Member 1) is mandatory with Full Name and normalized UAF Registration Number.
- **FR-07**: Member 2 is mandatory with Full Name and normalized UAF Registration Number.
- **FR-08**: Members 3, 4, 5, 6, and 7 are optional. Each optional row must contain both Name and Reg # or be completely blank.
- **FR-09**: Total group size must be between 2 and 7 members inclusive.
- **FR-10**: Every university registration number must be globally unique across active groups in both M1 and M2. Duplicate registration numbers inside the same group or across groups must be rejected with user-friendly error messages.
- **FR-11**: Project Idea Name and a comprehensive multiline Project Description (minimum 20 characters) are mandatory.
- **FR-12**: Google Drive PDF link must be a valid HTTPS URL with clear instructions regarding document view permissions.
- **FR-13**: Optional project attachments (PDF, PPT, PPTX, DOC, DOCX up to 15MB) are supported with metadata stored in PostgreSQL.

### 4.3 Review & Presentation Lifecycle
- **FR-14**: Newly submitted groups default to `PENDING_REVIEW` review status and `PENDING` presentation status.
- **FR-15**: Administrators can approve or reject groups. Rejection mandates explanatory feedback.
- **FR-16**: Rejected groups may be corrected and resubmitted by the leader, resetting status to `PENDING_REVIEW` and generating a review history audit record.
- **FR-17**: Presentation status is decoupled from review status and can be toggled between `PENDING` and `COMPLETED` with timestamp and actor tracking.
- **FR-18**: Administrators can schedule presentation sessions with date, time (Asia/Karachi), and venue.

### 4.4 Deadline Enforcement
- **FR-19**: Administrators can configure, modify, activate, or deactivate a submission deadline.
- **FR-20**: The public interface must render a live countdown timer showing days, hours, minutes, and seconds.
- **FR-21**: Group creation and resubmission requests submitted after deadline expiration must be rejected at the server API level.

### 4.5 PDF Reporting & Exports
- **FR-22**: Authorized users can export an individual group dossier as a formatted A4 PDF containing the UAF seal, team roster, project details, and statuses.
- **FR-23**: Administrators can export a section-wide PDF register for Section M1 or M2 with repeating headers and clickable links.

## 5. Non-Functional Requirements
- **Performance**: Public landing page and section views load in under 1.2 seconds. Database queries use indexes on `regNumber` and `sectionId`.
- **Security**: Complete protection against SQL injection (Prisma parameterized queries), XSS, CSRF, and path traversal. Strict authorization checks on all Route Handlers.
- **Design & Aesthetics**: Refined glassmorphism interface with backdrop blurs, subtle borders, UAF academic forest green (`#135835`) and gold palette, smooth transitions, and responsive mobile drawers.
- **Reliability & Source of Truth**: PostgreSQL (Neon) serves as the persistent transactional source of truth; no browser localStorage is used for core records.
- **Timezone Standardization**: All display clocks and countdowns synchronize on Asia/Karachi (PKT).
