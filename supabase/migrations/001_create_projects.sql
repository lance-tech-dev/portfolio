-- =================================================================
-- Migration File: 001_create_projects.sql
-- Description: Complete, canonical projects table matching main branch schema.
-- =================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    thumbnail_url TEXT,
    image_url TEXT,
    demo_url TEXT,
    live_url TEXT,
    github_url TEXT,
    tags TEXT[] DEFAULT '{}',
    tech_stack TEXT[] DEFAULT '{}',
    order_index INT DEFAULT 0,
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects (order_index ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Public Read & Admin Write)
DROP POLICY IF EXISTS "Allow public select on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow all operations on projects" ON public.projects;

CREATE POLICY "Allow public select on projects"
    ON public.projects FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow all operations on projects"
    ON public.projects FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

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
INSERT INTO public.projects (
    title,
    slug,
    description,
    thumbnail_url,
    demo_url,
    github_url,
    tech_stack,
    display_order,
    order_index,
    is_published,
    is_featured
)
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
        1,
        true,
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
        2,
        true,
        true
    )
ON CONFLICT (slug) DO NOTHING;