// Role definitions for Learning Platform
export enum Roles {
  Admin = 'ROLE_ADMIN',
  Instructor = 'ROLE_INSTRUCTOR',
  Student = 'ROLE_STUDENT',
  Staff = 'ROLE_STAFF',
}

export type UserRole = Roles.Admin | Roles.Instructor | Roles.Student | Roles.Staff;
