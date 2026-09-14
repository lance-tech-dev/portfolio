-- =================================================================
-- Migration File: 009_add_certification_category.sql
-- Description: Optional free-text category (e.g. "AI", "Engineering",
-- "Cloud") for grouping certifications on the public page. Left
-- freeform rather than a fixed enum since cert domains vary widely.
-- =================================================================

ALTER TABLE public.certifications
    ADD COLUMN IF NOT EXISTS category TEXT;
