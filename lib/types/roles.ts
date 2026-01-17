// Role definitions for Learning Platform
export enum Roles {
  Admin = 'Admin',
  Instructor = 'Instructor',
  Student = 'Student',
}

export type UserRole = Roles.Admin | Roles.Instructor | Roles.Student;
