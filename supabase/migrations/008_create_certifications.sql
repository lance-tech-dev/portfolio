-- =================================================================
-- Migration File: 008_create_certifications.sql
-- Description: Certification entries for the admin Certifications tab
-- and the public homepage/certifications page.
-- =================================================================

CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    credential_url TEXT,
    image_url TEXT,
    issue_date DATE,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_display_order ON public.certifications (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_certifications_issue_date ON public.certifications (issue_date DESC);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on certifications" ON public.certifications;
CREATE POLICY "Allow public select on certifications"
    ON public.certifications FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on certifications" ON public.certifications;
CREATE POLICY "Allow authenticated write on certifications"
    ON public.certifications FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_certifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_certifications_updated_at ON public.certifications;
CREATE TRIGGER trg_certifications_updated_at
    BEFORE UPDATE ON public.certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_certifications_updated_at();
