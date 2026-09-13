-- =================================================================
-- Migration File: 002tech_stack.sql
-- Description: Creates tech_stack table with RLS policies and seed data.
-- =================================================================

-- 1. Create Tech Stack Table
CREATE TABLE IF NOT EXISTS public.tech_stack (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Database & Cloud', 'Tools & DevOps')),
    icon_name TEXT,
    description TEXT,
    order_index INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for Optimized Queries
CREATE INDEX IF NOT EXISTS idx_tech_stack_category ON public.tech_stack (category);
CREATE INDEX IF NOT EXISTS idx_tech_stack_order ON public.tech_stack (order_index ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;

-- 4. Public Read-Only RLS Policy
DROP POLICY IF EXISTS "Allow public read access to tech_stack" ON public.tech_stack;
CREATE POLICY "Allow public read access to tech_stack"
    ON public.tech_stack
    FOR SELECT
    USING (true);

-- 5. Auto-Update Timestamp Trigger
CREATE OR REPLACE FUNCTION update_tech_stack_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tech_stack_updated_at ON public.tech_stack;
CREATE TRIGGER trg_tech_stack_updated_at
    BEFORE UPDATE ON public.tech_stack
    FOR EACH ROW
    EXECUTE FUNCTION update_tech_stack_updated_at();

-- 6. Initial Seed Data
INSERT INTO public.tech_stack (name, category, icon_name, description, order_index, is_featured)
VALUES
    -- Frontend
    ('TypeScript', 'Frontend', 'SiTypescript', 'Strongly typed JavaScript for scalable web apps', 1, true),
    ('Next.js (App Router)', 'Frontend', 'SiNextdotjs', 'React framework for SSR, SSG, and Server Components', 2, true),
    ('React', 'Frontend', 'SiReact', 'Component-based UI development', 3, true),
    ('Tailwind CSS', 'Frontend', 'SiTailwindcss', 'Utility-first CSS framework for rapid styling', 4, true),

    -- Backend
    ('Node.js', 'Backend', 'SiNodedotjs', 'Event-driven JavaScript runtime environment', 5, true),
    ('Express.js', 'Backend', 'SiExpress', 'Minimalist web framework for Node.js', 6, true),
    ('REST & GraphQL APIs', 'Backend', 'SiGraphql', 'Modern API architectures and integrations', 7, true),

    -- Database & Cloud
    ('PostgreSQL', 'Database & Cloud', 'SiPostgresql', 'Relational database management system', 8, true),
    ('Supabase', 'Database & Cloud', 'SiSupabase', 'Open source backend-as-a-service with Postgres', 9, true),
    ('Prisma ORM', 'Database & Cloud', 'SiPrisma', 'Type-safe database client for TypeScript', 10, true),

    -- Tools & DevOps
    ('Git & GitHub', 'Tools & DevOps', 'SiGithub', 'Version control and collaborative workflow', 11, true),
    ('Docker', 'Tools & DevOps', 'SiDocker', 'Containerization for consistent deployment environments', 12, true),
    ('Vercel', 'Tools & DevOps', 'SiVercel', 'Cloud platform for frontend deployment and hosting', 13, true)
ON CONFLICT (id) DO NOTHING;