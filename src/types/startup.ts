// Create /src/types/startup.ts
export interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  logo: string;
  coverImage: string;
  website: string;
  industry: string;
  stage: string;
  foundedYear: number;
  location: string;
  teamSize: string;
  funding: string;
  valuation?: string;
  founders: Founder[];
  keyMetrics: KeyMetric[];
  achievements: string[];
  challengesSolved: string[];
  futureGoals: string[];
  socialLinks: SocialLinks;
  weekFeatured: string; // ISO date string
  weekNumber: number;
  year: number;
  featured: boolean;
}

export interface Founder {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedIn?: string;
  twitter?: string;
}

export interface KeyMetric {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

export interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface StartupFilter {
  industry: string;
  stage: string;
  year: string;
  search: string;
}
