-- Add parent_id column to support reply comments
ALTER TABLE public.comments 
ADD COLUMN parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- Create index for faster queries on parent_id
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);

-- This allows nested comments (replies) while maintaining referential integrity
