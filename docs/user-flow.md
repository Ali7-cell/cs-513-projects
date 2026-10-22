# User Flow & Interaction Specification: BS IT 5th Semester Group Management System
University of Agriculture Faisalabad (UAF) — Department of Information Technology

## 1. Overview of Workflows
The BS IT 5th Semester Group Management System supports two primary operational workflows:
1. **Student Workflow**: Landing Page -> Section Selection (M1 or M2) -> Leader Account Creation / Login -> Group Formulation -> Proposal Submission -> Status Monitoring & Resubmission.
2. **Administrator Workflow**: Landing Page ("Login as Admin") -> Secure Faculty Authentication -> Administrative Dashboard Overview -> M1 / M2 Group Evaluation -> Proposal Approval / Rejection -> Presentation Scheduling & Marking -> PDF Export Hub -> Audit Log Inspection.

## 2. Student User Flow Diagram
```mermaid
flowchart TD
    Start([Student Visits Portal /]) --> LandingChoice{Select Section Card}
    LandingChoice -->|Start with M1| PageM1[/sections/m1/]
    LandingChoice -->|Start with M2| PageM2[/sections/m2/]
    
    PageM1 --> ClickCreate[Click 'Create Group Profile']
    PageM2 --> ClickCreate
    
    ClickCreate --> AuthCheck{Logged in as Leader?}
    AuthCheck -- No Account --> Register[Register Account /register?section=...]
    Register --> Login[Sign in with Email & Password /login]
    AuthCheck -- Has Account --> Login
    AuthCheck -- Already Logged In --> CheckDeadline{Submission Deadline Open?}
    Login --> CheckDeadline
    
    CheckDeadline -- Expired --> BlockDeadline[Blocked: Deadline Passed]
    CheckDeadline -- Open --> CheckSection{Belongs to Section?}
    CheckSection -- No --> BlockCross[Blocked: Cross-section violation]
    CheckSection -- Yes --> FillForm[Fill Group Form: Leader + Member 2 Mandatory, Optional 3-7, Drive PDF, Links]
    
    FillForm --> Validate[Client & Server Zod Validation]
    Validate --> RegNumCheck{RegNums Unique across M1/M2?}
    RegNumCheck -- Conflict --> ShowError[Highlight Conflicting Reg #] --> FillForm
    RegNumCheck -- Clear --> CommitTx[Prisma Transaction Commit]
    
    CommitTx --> ProfileView[Redirect to /groups/:id]
    ProfileView --> WaitReview[Status: PENDING_REVIEW | Pres: PENDING]
```

## 3. Administrator User Flow Diagram
```mermaid
flowchart TD
    AdminStart([Landing Page /]) --> AdminBtn[Click 'Login as Admin']
    AdminBtn --> AdminLogin[Sign In via /login?admin=true]
    AdminLogin --> VerifyRole{Is Role == ADMIN?}
    VerifyRole -- No --> Deny[403 Forbidden]
    VerifyRole -- Yes --> AdminDash[Admin Overview Dashboard /admin]
    
    AdminDash --> NavMenu{Sidebar Navigation}
    NavMenu -->|M1 Groups| TableM1[/admin/sections/m1]
    NavMenu -->|M2 Groups| TableM2[/admin/sections/m2]
    NavMenu -->|Pending Reviews| Reviews[/admin/reviews]
    NavMenu -->|Presentations| Pres[/admin/presentations]
    NavMenu -->|Schedule| Schedule[/admin/schedule]
    NavMenu -->|Deadline| Deadline[/admin/deadline]
    NavMenu -->|PDF Exports| Exports[/admin/exports]
    NavMenu -->|Audit Logs| Audits[/admin/audits]
    
    TableM1 & TableM2 --> RowActions{Row Action}
    RowActions -->|View| OpenDossier[View Full Group Profile]
    RowActions -->|Approve| DoApprove[Set status: APPROVED + Audit]
    RowActions -->|Reject| DoReject[Provide Mandatory Reason -> REJECTED + Audit]
    RowActions -->|Presentation| TogglePres[Toggle COMPLETED / PENDING + Audit]
    RowActions -->|Export PDF| DownloadPDF[Stream Group Dossier PDF]
```

## 4. Rejection, Correction & Resubmission Flow
When a group proposal requires revision:
1. **Administrative Rejection**: The instructor enters a structured rationale (e.g. "Scope too narrow for 5 members; expand system design specification").
2. **Review Status Transition**: `reviewStatus` updates to `REJECTED`; `rejectionReason` is persisted.
3. **Audit & History**: An entry is appended to `GroupReviewHistory` and `AuditLog`.
4. **Student Notification**: The group profile displays an alert card with the instructor's remarks.
5. **Resubmission**: The team leader clicks "Edit / Resubmit Group Profile" (`/groups/[id]/edit`), modifies the project details or members, and submits.
6. **State Reset**: Upon valid resubmission, `reviewStatus` resets to `PENDING_REVIEW` while presentation status remains `PENDING`.

## 5. Deadline Configuration & Student Countdown Flow
1. **Administrator Sets Cutoff**: Faculty navigates to `/admin/deadline`, selects cutoff timestamp (PKT) and title, and clicks "Save & Enforce Deadline".
2. **Persistence**: Record saved to `SubmissionDeadline` with `isActive: true`. Previous deadlines are deactivated.
3. **Public Display**: The landing page (`/`) and section portals (`/sections/m1`, `/sections/m2`) automatically render the glassmorphic countdown timer showing Days, Hours, Minutes, and Seconds.
4. **Cutoff Expiration**: When the timestamp is reached, the countdown displays "Submissions are closed".
5. **Backend Rejection**: Any direct POST/PUT request to create or edit a group is intercepted by `checkSubmissionDeadlineAllowed()` and rejected with a `403 Forbidden` response unless executed by an administrator.

## 6. Edge Cases & Boundary Handling
- **Simultaneous Submission**: If two leaders attempt to claim the same registration number concurrently, the database transaction locks the conflicting row and returns a `409 Conflict` to the slower request.
- **Incomplete Optional Rows**: Leaving Member 3 name populated without registration number (or vice versa) triggers a row-level validation error preventing partial membership insertion.
- **Section Mismatch**: A student registered under Section M1 attempting to submit via `/sections/m2/create` is blocked both at page render and in the API handler.
