-- =================================================================
-- Migration File: 003_migrate_tech_stacks.sql
-- Description: Aligns the live `tech_stack` table with the admin UI,
-- which was redesigned around a 7-category taxonomy and queries the
-- table as `tech_stacks` (plural). Renames the table, widens the
-- category CHECK constraint, and remaps existing rows into the
-- closest matching new category.
-- =================================================================

-- 1. Rename table to match app code
ALTER TABLE IF EXISTS public.tech_stack RENAME TO tech_stacks;

-- 2. Drop the old category CHECK constraint (name looked up dynamically
--    since it was auto-generated against the old table name)
DO $$
DECLARE
    con RECORD;
BEGIN
    FOR con IN
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'public.tech_stacks'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) ILIKE '%category%'
    LOOP
        EXECUTE format('ALTER TABLE public.tech_stacks DROP CONSTRAINT %I', con.conname);
    END LOOP;
END $$;

-- 3. Remap existing rows from the old 4-category taxonomy to the new
--    7-category taxonomy used by lib/constants/tech-presets.ts
UPDATE public.tech_stacks SET category = 'DevOps & Cloud' WHERE category = 'Database & Cloud';
UPDATE public.tech_stacks SET category = 'Developer Tools' WHERE category = 'Tools & DevOps' AND name = 'Git & GitHub';
UPDATE public.tech_stacks SET category = 'DevOps & Cloud' WHERE category = 'Tools & DevOps';

-- 4. Add the new category CHECK constraint
ALTER TABLE public.tech_stacks
    ADD CONSTRAINT tech_stacks_category_check CHECK (category IN (
        'Frontend',
        'Backend',
        'DevOps & Cloud',
        'AI & Machine Learning',
        'Security & Identity',
        'CMS & No-Code',
        'Developer Tools'
    ));

-- 5. Rename indexes for consistency (optional but avoids stale names)
ALTER INDEX IF EXISTS idx_tech_stack_category RENAME TO idx_tech_stacks_category;
ALTER INDEX IF EXISTS idx_tech_stack_order RENAME TO idx_tech_stacks_order;
