-- =================================================================
-- Migration File: 001projects.sql
-- Description: Creates projects table with RLS policies and seed data.
-- =================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    tags TEXT[] DEFAULT '{}',
    order_index INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for Optimized Queries
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects (order_index ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Public Read-Only RLS Policy
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
CREATE POLICY "Allow public read access to projects"
    ON public.projects
    FOR SELECT
    USING (true);

-- 5. Auto-Update Timestamp Trigger
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_projects_updated_at();

-- 6. Initial Seed Data
INSERT INTO public.projects (title, slug, description, image_url, live_url, github_url, tags, order_index, is_featured)
VALUES
    (
        'TQ Devs Digital',
        'tq-devs-digital',
        'Beyond Code, Beyond Limits. Full-service digital agency and web application platform built for modern business scaling.',
        '/projects/tq-devs.png',
        'https://tqdevs.com',
        'https://github.com/lanceachacoso/tq-devs-digital',
        ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
        1,
        true
    ),
    (
        'RJM Medical Supplies',
        'rjm-medical-supplies',
        'E-commerce & order management system engineered for medical equipment distribution and inventory tracking.',
        '/projects/rjm-medical.png',
        'https://rjmmedical.com',
        'https://github.com/lanceachacoso/rjm-medical',
        ARRAY['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        2,
        true
    )
ON CONFLICT (id) DO NOTHING;