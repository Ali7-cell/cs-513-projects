export const SECTIONS = [
  {
    code: "M1",
    name: "Section M1",
    semester: "5th Semester",
    program: "BS Information Technology",
  },
  {
    code: "M2",
    name: "Section M2",
    semester: "5th Semester",
    program: "BS Information Technology",
  },
];

export const INITIAL_USERS = [
  {
    fullName: "Sir Ramish Saleem",
    email: "admin.it@uaf.edu.pk",
    role: "ADMIN" as const,
    sectionCode: null,
  },
  {
    fullName: "Muhammad Ali Liaqat",
    email: "student.m2@uaf.edu.pk",
    role: "STUDENT" as const,
    sectionCode: "M2",
  },
  {
    fullName: "Usman Tariq",
    email: "student.m1@uaf.edu.pk",
    role: "STUDENT" as const,
    sectionCode: "M1",
  },
];
