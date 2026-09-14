-- =================================================================
-- Migration File: 005_create_experience.sql
-- Description: Work experience entries for the admin Experience tab.
-- Supports an optional sub-company (e.g. deployed/outsourced to a
-- client site under a different company + location than the employer
-- of record), and an open-ended "currently working here" end date.
-- =================================================================

CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_location TEXT NOT NULL,
    sub_company_name TEXT,
    sub_company_location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT false,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (is_current OR end_date IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_experience_start_date ON public.experience (start_date DESC);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Public can read (for the future public Experience section); only
-- authenticated (admin) sessions can write. Unlike the older
-- projects/tech_stacks tables, writes are NOT open to the anon role.
DROP POLICY IF EXISTS "Allow public select on experience" ON public.experience;
CREATE POLICY "Allow public select on experience"
    ON public.experience FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on experience" ON public.experience;
CREATE POLICY "Allow authenticated write on experience"
    ON public.experience FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_experience_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_experience_updated_at ON public.experience;
CREATE TRIGGER trg_experience_updated_at
    BEFORE UPDATE ON public.experience
    FOR EACH ROW
    EXECUTE FUNCTION update_experience_updated_at();
