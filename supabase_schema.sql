-- Create problems table
CREATE TABLE IF NOT EXISTS public.problems (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  time_limit TEXT NOT NULL DEFAULT '1 s',
  memory_limit TEXT NOT NULL DEFAULT '256 MB',
  description TEXT NOT NULL,
  constraints TEXT,
  input_desc TEXT NOT NULL,
  output_desc TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  examples JSONB DEFAULT '[]'::jsonb,
  solution TEXT NOT NULL,
  youtube_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_created_at ON public.problems(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DO $$
BEGIN
  CREATE POLICY "Allow public read access" ON public.problems
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policy to allow authenticated users to create
DO $$
BEGIN
  CREATE POLICY "Allow authenticated to create" ON public.problems
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policy to allow authenticated users to update own
DO $$
BEGIN
  CREATE POLICY "Allow authenticated to update" ON public.problems
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policy to allow authenticated users to delete
DO $$
BEGIN
  CREATE POLICY "Allow authenticated to delete" ON public.problems
    FOR DELETE
    USING (auth.role() = 'authenticated');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Sample data insert (uncomment to use)
-- INSERT INTO public.problems (id, title, time_limit, memory_limit, description, constraints, input_desc, output_desc, difficulty, examples, solution)
-- VALUES (
--   '01a-input-output',
--   '01A. Input dan Output pada C++',
--   '1 s',
--   '256 MB',
--   'Bahasa Pemrograman C++ memiliki pustaka untuk input/output...',
--   '-100 juta < a, b, c, d < 100 juta',
--   'Masukan adalah sebuah baris berisi empat buah bilangan bulat: a b c d',
--   'Keluaran adalah sebuah baris berisi rataan dari keempat bilangan',
--   'easy',
--   '[{"input": "1 3 4 5", "output": "3.25", "explanation": "Rataan dari 1, 3, 4, 5 adalah (1+3+4+5)/4 = 3.25"}]'::jsonb,
--   '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int a, b, c, d;\n    cin >> a >> b >> c >> d;\n    \n    double rataan = (a + b + c + d) / 4.0;\n    \n    cout << fixed << setprecision(2) << rataan << endl;\n    \n    return 0;\n}'
-- );

-- ============================================
-- GPA System Tables
-- ============================================

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sks INTEGER NOT NULL CHECK (sks > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight NUMERIC NOT NULL CHECK (weight >= 0 AND weight <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.grade_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  letter_grade TEXT NOT NULL,
  minimum_score NUMERIC NOT NULL CHECK (minimum_score >= 0 AND minimum_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  ALTER TABLE public.grade_criteria
    ADD CONSTRAINT grade_criteria_unique_grade UNIQUE (course_id, letter_grade);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.student_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
  score NUMERIC NULL CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  ALTER TABLE public.student_scores
    ADD CONSTRAINT student_scores_unique_component UNIQUE (course_id, component_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_courses_user_id ON public.courses(user_id);
CREATE INDEX IF NOT EXISTS idx_components_course_id ON public.components(course_id);
CREATE INDEX IF NOT EXISTS idx_grade_criteria_course_id ON public.grade_criteria(course_id);
CREATE INDEX IF NOT EXISTS idx_student_scores_course_id ON public.student_scores(course_id);
CREATE INDEX IF NOT EXISTS idx_student_scores_component_id ON public.student_scores(component_id);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_scores ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY "Courses: users manage own" ON public.courses
    FOR ALL
    USING (user_id = auth.uid()::text)
    WITH CHECK (user_id = auth.uid()::text);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Components: users manage own" ON public.components
    FOR ALL
    USING (
      course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()::text)
    )
    WITH CHECK (
      course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()::text)
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Grade criteria: users manage own" ON public.grade_criteria
    FOR ALL
    USING (
      course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()::text)
    )
    WITH CHECK (
      course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()::text)
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Student scores: users manage own" ON public.student_scores
    FOR ALL
    USING (
      course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()::text)
    )
    WITH CHECK (
      course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()::text)
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
