-- =================================================================
-- Migration File: 006_restrict_writes_to_authenticated.sql
-- Description: `projects` and `tech_stacks` currently allow the
-- public anon role to insert/update/delete rows (a leftover from the
-- original "Allow all operations ... TO public" policies), meaning
-- anyone holding the public anon key could write to either table.
-- This restricts writes to authenticated (admin) sessions only, same
-- as the `experience` table added in 005. Public read is unchanged.
-- =================================================================

DROP POLICY IF EXISTS "Allow all operations on projects" ON public.projects;
CREATE POLICY "Allow authenticated write on projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on tech_stack" ON public.tech_stacks;
CREATE POLICY "Allow authenticated write on tech_stacks"
    ON public.tech_stacks FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
