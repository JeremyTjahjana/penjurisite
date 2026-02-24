-- Create problems table
CREATE TABLE public.problems (
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
CREATE INDEX idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX idx_problems_created_at ON public.problems(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.problems
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to create
CREATE POLICY "Allow authenticated to create" ON public.problems
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update own
CREATE POLICY "Allow authenticated to update" ON public.problems
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated to delete" ON public.problems
  FOR DELETE
  USING (auth.role() = 'authenticated');

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
