-- SQL Schema to initialize the leads table for the SMS Retention website survey.
-- Run this in your Supabase project's SQL Editor (https://supabase.com dashboard).

-- 1. Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    answers JSONB,
    status TEXT DEFAULT 'qualified',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (public/survey takers) to insert lead records
CREATE POLICY "Allow public insert" ON public.leads
    FOR INSERT 
    WITH CHECK (true);

-- 4. Policy: Allow service role / authenticated admins to view/modify records
CREATE POLICY "Allow admin read/write" ON public.leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
