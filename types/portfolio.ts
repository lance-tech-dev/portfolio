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