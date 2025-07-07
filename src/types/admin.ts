// Create /src/types/admin.ts
export interface AdminCredential {
  username: string;
  password: string;
  role: AdminRole;
  permissions: Permission[];
}

export type AdminRole = "Super Admin" | "Content Admin" | "Event Admin";

export type Permission =
  | "manage_events"
  | "manage_users"
  | "manage_content"
  | "view_analytics"
  | "manage_settings";

export interface AdminSession {
  username: string;
  role: AdminRole;
  loginTime: string;
  permissions: Permission[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  highlights: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalStudents: number;
  totalStartups: number;
  monthlyGrowth: number;
}
