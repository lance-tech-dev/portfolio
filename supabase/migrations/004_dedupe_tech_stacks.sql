-- =================================================================
-- Migration File: 004_dedupe_tech_stacks.sql
-- Description: 002's seed INSERT used `ON CONFLICT (id) DO NOTHING`
-- with no id specified (id is a random gen_random_uuid() default), so
-- the conflict target never matched and re-running 002 duplicated all
-- seed rows. This removes the duplicates and adds a real uniqueness
-- guard so it can't happen again.
-- =================================================================

-- 1. Keep the earliest row per name, delete the rest
DELETE FROM public.tech_stacks a
    USING public.tech_stacks b
    WHERE a.name = b.name
      AND a.created_at > b.created_at;

-- 2. Guard against future duplicate names
ALTER TABLE public.tech_stacks
    ADD CONSTRAINT tech_stacks_name_key UNIQUE (name);
