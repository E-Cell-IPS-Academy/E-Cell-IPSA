import type { Timestamp } from "firebase/firestore";

export type UserType =
  | "student"
  | "entrepreneur"
  | "professional"
  | "alumni"
  | "other";

export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface UserProject {
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

/** A single user document. Named `UserRecord` to avoid shadowing DOM types. */
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  userType: UserType;
  status: UserStatus;
  interests: string[];
  skills: string[];

  // Student specific
  institution?: string;
  course?: string;
  year?: string;
  studentId?: string;
  gpa?: number;

  // Professional specific
  company?: string;
  position?: string;
  experience?: string;
  salary?: string;

  // Contact & Social
  location: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;

  // Platform activity
  joinedDate: string;
  lastLogin?: string;
  isVerified: boolean;
  eventsAttended: number;
  blogsRead: number;
  profileCompletion: number;

  // Additional details
  achievements: string[];
  certifications: string[];
  projects: UserProject[];

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserStats {
  total: number;
  students: number;
  entrepreneurs: number;
  professionals: number;
  alumni: number;
  active: number;
  inactive: number;
  verified: number;
  newThisMonth: number;
}

export const USER_TYPES: UserType[] = [
  "student",
  "entrepreneur",
  "professional",
  "alumni",
  "other",
];

export const USER_STATUSES: UserStatus[] = [
  "active",
  "inactive",
  "suspended",
  "pending",
];

export const USER_TYPE_TONE: Record<
  UserType,
  "info" | "success" | "warning" | "neutral"
> = {
  student: "info",
  entrepreneur: "warning",
  professional: "success",
  alumni: "warning",
  other: "neutral",
};

export const STATUS_TONE: Record<
  UserStatus,
  "success" | "neutral" | "danger" | "warning"
> = {
  active: "success",
  inactive: "neutral",
  suspended: "danger",
  pending: "warning",
};

export const EMPTY_USER: Omit<UserRecord, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  email: "",
  avatar: "",
  bio: "",
  userType: "student",
  status: "pending",
  interests: [],
  skills: [],
  institution: "",
  course: "",
  year: "",
  studentId: "",
  company: "",
  position: "",
  experience: "",
  location: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  instagram: "",
  twitter: "",
  facebook: "",
  joinedDate: "",
  isVerified: false,
  eventsAttended: 0,
  blogsRead: 0,
  profileCompletion: 0,
  achievements: [],
  certifications: [],
  projects: [],
};
