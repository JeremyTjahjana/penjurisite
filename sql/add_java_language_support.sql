-- Allow Java as a valid value for problems.language
-- Safe to run multiple times

ALTER TABLE public.problems
DROP CONSTRAINT IF EXISTS valid_language;

ALTER TABLE public.problems
ADD CONSTRAINT valid_language CHECK (language IN ('c', 'cpp', 'java'));
