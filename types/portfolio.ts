export type TechCategory =
  | "Frontend"
  | "Backend"
  | "DevOps & Cloud"
  | "AI & Machine Learning"
  | "Security & Identity"
  | "CMS & No-Code"
  | "Developer Tools";

export interface TechStack {
  id: string;
  name: string;
  category: TechCategory;
  icon_url?: string;
  proficiency?: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  thumbnail_url?: string;
  images: string[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type WorkSetup = "Remote" | "Onsite" | "Hybrid";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Freelance"
  | "Internship";

export interface Experience {
  id: string;
  role: string;
  company_name: string;
  company_location: string;
  sub_company_name?: string | null;
  sub_company_location?: string | null;
  setup: WorkSetup;
  employment_type: EmploymentType;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credential_url?: string | null;
  image_url?: string | null;
  issue_date?: string | null;
  category?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}