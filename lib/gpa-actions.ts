"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";

export interface Course {
  id: string;
  name: string;
  sks: number;
  createdAt: string;
}

export interface ComponentItem {
  id: string;
  courseId: string;
  name: string;
  weight: number;
  createdAt: string;
}

export interface GradeCriterionItem {
  id: string;
  courseId: string;
  letterGrade: string;
  minimumScore: number;
  createdAt: string;
}

export interface StudentScoreItem {
  id: string;
  courseId: string;
  componentId: string;
  score: number | null;
  createdAt: string;
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session.userId) {
    throw new Error("User not authenticated");
  }
  return session.userId;
}

export async function getCourses(): Promise<Course[]> {
  const userId = await requireUserId();

  const { data, error } = await supabaseServer
    .from("courses")
    .select("id, name, sks, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return (data || []).map((course) => ({
    id: course.id,
    name: course.name,
    sks: course.sks,
    createdAt: course.created_at,
  }));
}

export async function createCourse(
  name: string,
  sks: number,
): Promise<Course | null> {
  const userId = await requireUserId();

  const { data, error } = await supabaseServer
    .from("courses")
    .insert([
      {
        user_id: userId,
        name,
        sks,
      },
    ])
    .select("id, name, sks, created_at")
    .single();

  if (error) {
    console.error("Error creating course:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    sks: data.sks,
    createdAt: data.created_at,
  };
}

export async function updateCourse(
  courseId: string,
  updates: Partial<Pick<Course, "name" | "sks">>,
): Promise<boolean> {
  await requireUserId();

  const { error } = await supabaseServer
    .from("courses")
    .update({
      name: updates.name,
      sks: updates.sks,
    })
    .eq("id", courseId);

  if (error) {
    console.error("Error updating course:", error);
    return false;
  }

  return true;
}

export async function deleteCourse(courseId: string): Promise<boolean> {
  await requireUserId();

  const { error } = await supabaseServer
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) {
    console.error("Error deleting course:", error);
    return false;
  }

  return true;
}

export async function getComponents(
  courseId: string,
): Promise<ComponentItem[]> {
  await requireUserId();

  const { data, error } = await supabaseServer
    .from("components")
    .select("id, course_id, name, weight, created_at")
    .eq("course_id", courseId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching components:", error);
    return [];
  }

  return (data || []).map((component) => ({
    id: component.id,
    courseId: component.course_id,
    name: component.name,
    weight: Number(component.weight),
    createdAt: component.created_at,
  }));
}

export async function upsertComponent(
  courseId: string,
  component: Partial<ComponentItem> & Pick<ComponentItem, "name" | "weight">,
): Promise<ComponentItem | null> {
  await requireUserId();

  if (component.id) {
    const { data, error } = await supabaseServer
      .from("components")
      .update({
        name: component.name,
        weight: component.weight,
      })
      .eq("id", component.id)
      .select("id, course_id, name, weight, created_at")
      .single();

    if (error) {
      console.error("Error updating component:", error);
      return null;
    }

    return {
      id: data.id,
      courseId: data.course_id,
      name: data.name,
      weight: Number(data.weight),
      createdAt: data.created_at,
    };
  }

  const { data, error } = await supabaseServer
    .from("components")
    .insert([
      {
        course_id: courseId,
        name: component.name,
        weight: component.weight,
      },
    ])
    .select("id, course_id, name, weight, created_at")
    .single();

  if (error) {
    console.error("Error creating component:", error);
    return null;
  }

  return {
    id: data.id,
    courseId: data.course_id,
    name: data.name,
    weight: Number(data.weight),
    createdAt: data.created_at,
  };
}

export async function deleteComponent(componentId: string): Promise<boolean> {
  await requireUserId();

  const { error } = await supabaseServer
    .from("components")
    .delete()
    .eq("id", componentId);

  if (error) {
    console.error("Error deleting component:", error);
    return false;
  }

  return true;
}

export async function getGradeCriteria(
  courseId: string,
): Promise<GradeCriterionItem[]> {
  await requireUserId();

  const { data, error } = await supabaseServer
    .from("grade_criteria")
    .select("id, course_id, letter_grade, minimum_score, created_at")
    .eq("course_id", courseId)
    .order("minimum_score", { ascending: false });

  if (error) {
    console.error("Error fetching grade criteria:", error);
    return [];
  }

  return (data || []).map((criterion) => ({
    id: criterion.id,
    courseId: criterion.course_id,
    letterGrade: criterion.letter_grade,
    minimumScore: Number(criterion.minimum_score),
    createdAt: criterion.created_at,
  }));
}

export async function upsertGradeCriterion(
  courseId: string,
  criterion: Partial<GradeCriterionItem> &
    Pick<GradeCriterionItem, "letterGrade" | "minimumScore">,
): Promise<GradeCriterionItem | null> {
  await requireUserId();

  if (criterion.id) {
    const { data, error } = await supabaseServer
      .from("grade_criteria")
      .update({
        letter_grade: criterion.letterGrade,
        minimum_score: criterion.minimumScore,
      })
      .eq("id", criterion.id)
      .select("id, course_id, letter_grade, minimum_score, created_at")
      .single();

    if (error) {
      console.error("Error updating grade criteria:", error);
      return null;
    }

    return {
      id: data.id,
      courseId: data.course_id,
      letterGrade: data.letter_grade,
      minimumScore: Number(data.minimum_score),
      createdAt: data.created_at,
    };
  }

  const { data, error } = await supabaseServer
    .from("grade_criteria")
    .insert([
      {
        course_id: courseId,
        letter_grade: criterion.letterGrade,
        minimum_score: criterion.minimumScore,
      },
    ])
    .select("id, course_id, letter_grade, minimum_score, created_at")
    .single();

  if (error) {
    console.error("Error creating grade criteria:", error);
    return null;
  }

  return {
    id: data.id,
    courseId: data.course_id,
    letterGrade: data.letter_grade,
    minimumScore: Number(data.minimum_score),
    createdAt: data.created_at,
  };
}

export async function deleteGradeCriterion(
  criterionId: string,
): Promise<boolean> {
  await requireUserId();

  const { error } = await supabaseServer
    .from("grade_criteria")
    .delete()
    .eq("id", criterionId);

  if (error) {
    console.error("Error deleting grade criterion:", error);
    return false;
  }

  return true;
}

export async function getStudentScores(
  courseId: string,
): Promise<StudentScoreItem[]> {
  await requireUserId();

  const { data, error } = await supabaseServer
    .from("student_scores")
    .select("id, course_id, component_id, score, created_at")
    .eq("course_id", courseId);

  if (error) {
    console.error("Error fetching student scores:", error);
    return [];
  }

  return (data || []).map((score) => ({
    id: score.id,
    courseId: score.course_id,
    componentId: score.component_id,
    score: score.score === null ? null : Number(score.score),
    createdAt: score.created_at,
  }));
}

export async function upsertStudentScore(
  courseId: string,
  componentId: string,
  score: number | null,
): Promise<StudentScoreItem | null> {
  await requireUserId();

  const { data, error } = await supabaseServer
    .from("student_scores")
    .upsert(
      [
        {
          course_id: courseId,
          component_id: componentId,
          score,
        },
      ],
      { onConflict: "course_id,component_id" },
    )
    .select("id, course_id, component_id, score, created_at")
    .single();

  if (error) {
    console.error("Error upserting student score:", error);
    return null;
  }

  return {
    id: data.id,
    courseId: data.course_id,
    componentId: data.component_id,
    score: data.score === null ? null : Number(data.score),
    createdAt: data.created_at,
  };
}
