# Database Schema & Data Dictionary: BS IT 5th Semester

## 1. Overview & Relational Architecture
The persistence tier uses PostgreSQL hosted on Neon, managed via Prisma ORM. The relational model models academic administrative workflows, enforcing section isolation, group membership limits (2 to 7 members), unique student registration numbers, decoupled review vs presentation states, and audit trails.

## 2. Entity-Relationship Diagram (ERD)
```mermaid
erDiagram
    User ||--o{ Group : "creates"
    User ||--o{ AuditLog : "acts in"
    Section ||--o{ Group : "contains"
    Group ||--|{ GroupMember : "has members (2-7)"
    Group ||--|| Project : "specifies"
    Group ||--|| Presentation : "tracked in"
    Group ||--o{ GroupReviewHistory : "history"

    User {
        String id PK
        String fullName
        String email UK
        String passwordHash
        Role role "STUDENT | ADMIN"
        String sectionCode "M1 | M2 (nullable for admin)"
        DateTime createdAt
        DateTime updatedAt
    }

    Section {
        String id PK
        String code UK "M1 | M2"
        String name "Section M1 | Section M2"
        String semester "5th Semester"
        String program "BS Information Technology"
        DateTime createdAt
        DateTime updatedAt
    }

    Group {
        String id PK
        String groupName
        String sectionId FK
        String createdById FK
        ReviewStatus reviewStatus "PENDING_REVIEW | APPROVED | REJECTED"
        String rejectionReason "nullable"
        DateTime createdAt
        DateTime updatedAt
    }

    GroupMember {
        String id PK
        String groupId FK
        String fullName
        String regNumber "e.g. 2022-AG-1234"
        MemberRole role "LEADER | MEMBER"
        Int displayOrder "1 to 7"
        Boolean isActive "true by default"
        DateTime createdAt
    }

    Project {
        String id PK
        String groupId FK UK
        String ideaName
        String description
        String projectPdfUrl "nullable"
        String githubUrl "nullable"
        String websiteUrl "nullable"
        DateTime createdAt
        DateTime updatedAt
    }

    Presentation {
        String id PK
        String groupId FK UK
        PresentationStatus status "PENDING | COMPLETED"
        String markedById FK "nullable"
        DateTime markedAt "nullable"
        DateTime createdAt
        DateTime updatedAt
    }

    AuditLog {
        String id PK
        String actorUserId FK
        String action "PRESENTATION_UPDATE | REVIEW_UPDATE"
        String entityType "GROUP | PRESENTATION"
        String entityId
        String previousValue "nullable JSON"
        String newValue "nullable JSON"
        DateTime createdAt
    }
```

## 3. Data Dictionary & Column Specifications
### Table: `users`
- `id`: CUID/UUID, Primary Key.
- `fullName`: VarChar(120), Not Null. Full legal name.
- `email`: VarChar(150), Unique, Not Null. University email.
- `passwordHash`: VarChar(255), Not Null. Bcrypt salted hash.
- `role`: Enum (`STUDENT`, `ADMIN`), Default `STUDENT`.
- `sectionCode`: VarChar(10), Nullable (set to `M1` or `M2` for students).

### Table: `groups`
- `id`: CUID/UUID, Primary Key.
- `groupName`: VarChar(100), Not Null.
- `sectionId`: Foreign Key -> `sections.id`, OnDelete Restrict.
- `createdById`: Foreign Key -> `users.id`, OnDelete Restrict.
- `reviewStatus`: Enum (`PENDING_REVIEW`, `APPROVED`, `REJECTED`), Default `PENDING_REVIEW`.
- `rejectionReason`: Text, Nullable. Mandatory when `reviewStatus` is `REJECTED`.

### Table: `group_members`
- `id`: CUID/UUID, Primary Key.
- `groupId`: Foreign Key -> `groups.id`, OnDelete Cascade.
- `fullName`: VarChar(120), Not Null.
- `regNumber`: VarChar(50), Not Null. Normalized registration number (e.g. `2022-AG-5678`).
- `role`: Enum (`LEADER`, `MEMBER`), Not Null. Display order 1 is always `LEADER`.
- `displayOrder`: Integer (1 to 7), Not Null.
- `isActive`: Boolean, Default true. Set to false if group is cancelled or rejected so registration numbers can be released.

## 4. Integrity Constraints & Invariants
1. **Section Isolation**: Group records strictly link to a single `Section` record. M1 and M2 cannot share groups.
2. **Global Registration Number Uniqueness**: A normalized `regNumber` can only be present in at most one active (`isActive = true`) group membership across the entire system.
3. **Team Size Boundaries**: Application and database transactions guarantee that each group has at least 2 members (Leader + Member 2) and no more than 7 members total.
4. **Decoupled Statuses**: `reviewStatus` and `presentation.status` are stored in separate columns/tables, guaranteeing independent state tracking.
