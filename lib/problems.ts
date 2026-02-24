import { supabase } from "./supabase";

export interface Problem {
  id: string;
  title: string;
  timeLimit: string;
  memoryLimit: string;
  description: string;
  constraints?: string;
  input: string;
  output: string;
  difficulty: "easy" | "medium" | "hard";
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  solution: string;
  youtubeLink?: string;
}

export async function getAllProblems(): Promise<Problem[]> {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching problems:", error);
    return [];
  }

  // Transform Supabase data to match Problem interface
  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    timeLimit: item.time_limit,
    memoryLimit: item.memory_limit,
    description: item.description,
    constraints: item.constraints || undefined,
    input: item.input_desc,
    output: item.output_desc,
    difficulty: item.difficulty,
    examples: item.examples || [],
    solution: item.solution,
    youtubeLink: item.youtube_link || undefined,
  }));
}

export async function getProblemById(id: string): Promise<Problem | null> {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching problem:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    timeLimit: data.time_limit,
    memoryLimit: data.memory_limit,
    description: data.description,
    constraints: data.constraints || undefined,
    input: data.input_desc,
    output: data.output_desc,
    difficulty: data.difficulty,
    examples: data.examples || [],
    solution: data.solution,
    youtubeLink: data.youtube_link || undefined,
  };
}

export async function createProblem(
  problem: Omit<Problem, "id">,
): Promise<Problem | null> {
  const { data, error } = await supabase
    .from("problems")
    .insert([
      {
        title: problem.title,
        time_limit: problem.timeLimit,
        memory_limit: problem.memoryLimit,
        description: problem.description,
        constraints: problem.constraints,
        input_desc: problem.input,
        output_desc: problem.output,
        difficulty: problem.difficulty,
        examples: problem.examples,
        solution: problem.solution,
        youtube_link: problem.youtubeLink,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating problem:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    timeLimit: data.time_limit,
    memoryLimit: data.memory_limit,
    description: data.description,
    constraints: data.constraints || undefined,
    input: data.input_desc,
    output: data.output_desc,
    difficulty: data.difficulty,
    examples: data.examples || [],
    solution: data.solution,
    youtubeLink: data.youtube_link || undefined,
  };
}

export async function updateProblem(
  id: string,
  problem: Partial<Omit<Problem, "id">>,
): Promise<Problem | null> {
  const updateData: any = {};

  if (problem.title) updateData.title = problem.title;
  if (problem.timeLimit) updateData.time_limit = problem.timeLimit;
  if (problem.memoryLimit) updateData.memory_limit = problem.memoryLimit;
  if (problem.description) updateData.description = problem.description;
  if (problem.constraints !== undefined)
    updateData.constraints = problem.constraints;
  if (problem.input) updateData.input_desc = problem.input;
  if (problem.output) updateData.output_desc = problem.output;
  if (problem.difficulty) updateData.difficulty = problem.difficulty;
  if (problem.examples) updateData.examples = problem.examples;
  if (problem.solution) updateData.solution = problem.solution;
  if (problem.youtubeLink !== undefined)
    updateData.youtube_link = problem.youtubeLink;

  const { data, error } = await supabase
    .from("problems")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating problem:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    timeLimit: data.time_limit,
    memoryLimit: data.memory_limit,
    description: data.description,
    constraints: data.constraints || undefined,
    input: data.input_desc,
    output: data.output_desc,
    difficulty: data.difficulty,
    examples: data.examples || [],
    solution: data.solution,
    youtubeLink: data.youtube_link || undefined,
  };
}
