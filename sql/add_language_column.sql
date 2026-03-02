-- Add language column to existing problems table
-- This allows us to distinguish between C and C++ problems
ALTER TABLE public.problems
ADD COLUMN language VARCHAR(10) DEFAULT 'cpp';

-- Create index for faster filtering by language
CREATE INDEX IF NOT EXISTS idx_problems_language ON public.problems(language);

-- Update existing problems to be C++ (they are all C++ currently)
UPDATE public.problems SET language = 'cpp' WHERE language IS NULL;

-- Add constraint to ensure only valid languages are stored
ALTER TABLE public.problems
ADD CONSTRAINT valid_language CHECK (language IN ('c', 'cpp'));
