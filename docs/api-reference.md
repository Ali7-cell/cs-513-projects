# API Reference & Endpoint Specification: BS IT 5th Semester

## 1. Overview & General Conventions
The backend provides typed Next.js App Router Route Handlers and Server Actions. All endpoints communicate using standard JSON payloads over HTTPS and return consistent HTTP status codes.

### Standard Error Response Shape
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Member 2 registration number is already assigned to another group.",
    "field": "members.1.regNumber"
  }
}
```

## 2. Authentication & Identity Endpoints
### `POST /api/auth/[...nextauth]`
Handles session authentication using credentials.
- **Request Body**:
  ```json
  {
    "email": "student@uaf.edu.pk",
    "password": "SecurePassword123"
  }
  ```
- **Response `200 OK`**: Issues encrypted `next-auth.session-token` cookie.
- **Response `401 Unauthorized`**: Invalid email or password.

---

## 3. Group Operations Endpoints
### `GET /api/groups`
Retrieves a paginated list of project groups.
- **Query Parameters**:
  - `section` (string, required): `m1` or `m2`.
  - `status` (string, optional): `PENDING_REVIEW`, `APPROVED`, `REJECTED`.
  - `presentation` (string, optional): `PENDING`, `COMPLETED`.
  - `search` (string, optional): Substring match against group or project name.
  - `page` (number, default 1): Page number.
  - `limit` (number, default 10): Items per page.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "clx123abc",
        "groupName": "NextGen AI Lab",
        "section": "M1",
        "leaderName": "Muhammad Ali Liaqat",
        "leaderRegNum": "2022-AG-8812",
        "memberCount": 5,
        "ideaName": "Smart Agriculture IoT Hub",
        "reviewStatus": "APPROVED",
        "presentationStatus": "PENDING"
      }
    ],
    "pagination": { "total": 24, "page": 1, "pages": 3 }
  }
  ```

### `POST /api/groups`
Creates a new group profile and registers all members in a single transaction.
- **Authorization**: Authenticated `STUDENT` matching the target section.
- **Request Body**:
  ```json
  {
    "groupName": "NextGen AI Lab",
    "sectionCode": "M1",
    "ideaName": "Smart Agriculture IoT Hub",
    "description": "Comprehensive IoT monitoring system for crop yield optimization...",
    "projectPdfUrl": "https://drive.google.com/file/d/sample/view",
    "githubUrl": "https://github.com/uaf-it/sample-iot",
    "websiteUrl": "https://iot-uaf.vercel.app",
    "members": [
      { "fullName": "Muhammad Ali Liaqat", "regNumber": "2022-AG-8812", "role": "LEADER" },
      { "fullName": "Usman Tariq", "regNumber": "2022-AG-8813", "role": "MEMBER" },
      { "fullName": "Hamza Bilal", "regNumber": "2022-AG-8814", "role": "MEMBER" }
    ]
  }
  ```
- **Response `201 Created`**: Returns created group object and ID.
- **Response `409 Conflict`**: If any `regNumber` is already assigned to an active group.

---

## 4. Administrative Control Endpoints
### `GET /api/admin/stats`
Computes real-time system counts directly from PostgreSQL.
- **Authorization**: Authenticated `ADMIN`.
- **Response `200 OK`**:
  ```json
  {
    "totalM1": 18,
    "totalM2": 22,
    "totalGroups": 40,
    "pendingReviews": 5,
    "approvedGroups": 33,
    "rejectedGroups": 2,
    "presentationsPending": 28,
    "presentationsCompleted": 12
  }
  ```

### `PATCH /api/admin/groups/[id]/presentation`
Updates the presentation completion status.
- **Authorization**: Authenticated `ADMIN`.
- **Request Body**: `{ "status": "COMPLETED" }` or `{ "status": "PENDING" }`
- **Response `200 OK`**: Confirms status transition and records an audit log entry.

---

## 5. Document Export Endpoints
### `GET /api/export/group/[id]`
Streams an individual group profile formatted as an A4 PDF.
- **Authorization**: Authenticated `ADMIN`.
- **Headers**: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="BSIT-M1-Group-NextGen.pdf"`.

### `GET /api/export/section/[code]`
Streams the complete section roster and project summaries formatted as an A4 PDF report.
- **Authorization**: Authenticated `ADMIN`.
- **Headers**: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="BSIT-5th-M1-Groups.pdf"`.
