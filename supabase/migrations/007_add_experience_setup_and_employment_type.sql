-- =================================================================
-- Migration File: 007_add_experience_setup_and_employment_type.sql
-- Description: Adds work setup (Remote/Onsite/Hybrid) and employment
-- type (Full-time/Part-time/Contract/Freelance/Internship) to
-- experience entries. Existing rows backfill to sensible defaults.
-- =================================================================

ALTER TABLE public.experience
    ADD COLUMN IF NOT EXISTS setup TEXT NOT NULL DEFAULT 'Onsite',
    ADD COLUMN IF NOT EXISTS employment_type TEXT NOT NULL DEFAULT 'Full-time';

ALTER TABLE public.experience
    ADD CONSTRAINT experience_setup_check
        CHECK (setup IN ('Remote', 'Onsite', 'Hybrid'));

ALTER TABLE public.experience
    ADD CONSTRAINT experience_employment_type_check
        CHECK (employment_type IN (
            'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'
        ));
