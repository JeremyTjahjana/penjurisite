-- Add youtube_link column to existing problems table
ALTER TABLE public.problems
ADD COLUMN youtube_link TEXT;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_created_at ON public.problems(created_at);
