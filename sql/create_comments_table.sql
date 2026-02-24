-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_comments_problem_id ON public.comments(problem_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- IMPORTANT: RLS is DISABLED on this table
-- Security is handled via Next.js Server Actions:
-- 1. Server actions verify Clerk authentication
-- 2. Only authenticated users can create/delete comments
-- 3. Users can only delete their own comments (verified server-side)
-- This is safe because authentication is verified on the backend before any DB operations
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
