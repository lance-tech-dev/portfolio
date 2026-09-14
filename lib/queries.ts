import { supabaseServer } from "@/lib/supabase-server";
import { Certification, Experience, Project, TechStack } from "@/types/portfolio";

export async function getPublicProjects(): Promise<Project[]> {
  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Project[];
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabaseServer
    .from("experience")
    .select("*")
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });

  if (error || !data) return [];
  return data as Experience[];
}

export async function getTechStacks(): Promise<TechStack[]> {
  const { data, error } = await supabaseServer
    .from("tech_stacks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as TechStack[];
}

export async function getCertifications(): Promise<Certification[]> {
  const { data, error } = await supabaseServer
    .from("certifications")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("issue_date", { ascending: false });

  if (error || !data) return [];
  return data as Certification[];
}
