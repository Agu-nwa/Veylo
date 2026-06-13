export type UserRole = "CUSTOMER" | "RIDER" | "BUSINESS" | "ADMIN";

export type AccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "CLOSED";

export interface SessionUser {
  userId: string;
  role: UserRole;
  email?: string;
}
