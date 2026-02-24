import { supabase } from "./supabase";

export interface Comment {
  id: string;
  problemId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string | null;
  replies?: Comment[];
}

/**
 * Get all comments for a problem with nested replies
 */
export async function getCommentsByProblem(
  problemId: string,
): Promise<Comment[]> {
  try {
    // Fetch all comments and replies for this problem
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("problem_id", problemId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return [];
    }

    // Transform and organize into nested structure
    const allComments = (data || []).map((comment: any) => ({
      id: comment.id,
      problemId: comment.problem_id,
      userId: comment.user_id,
      userName: comment.user_name,
      userEmail: comment.user_email,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      parentId: comment.parent_id,
      replies: [] as Comment[],
    }));

    // Build nested structure
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    allComments.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    // Second pass: organize into parent-child structure
    allComments.forEach((comment) => {
      if (comment.parentId) {
        // This is a reply - add it to parent's replies
        const parent = commentMap.get(comment.parentId);
        if (parent && parent.replies) {
          parent.replies.push(comment);
        }
      } else {
        // This is a top-level comment
        rootComments.push(comment);
      }
    });

    return rootComments;
  } catch (error) {
    console.error("Error in getCommentsByProblem:", error);
    return [];
  }
}

/**
 * Add a new comment to a problem
 */
export async function addComment(
  problemId: string,
  userId: string,
  userName: string,
  userEmail: string,
  content: string,
): Promise<Comment | null> {
  try {
    if (!content.trim()) {
      throw new Error("Comment cannot be empty");
    }

    console.log("Adding comment with:", {
      problemId,
      userId,
      userName,
      userEmail,
      contentLength: content.length,
    });

    const { data, error, status } = await supabase
      .from("comments")
      .insert([
        {
          problem_id: problemId,
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          content: content,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding comment:", {
        error,
        status,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    if (!data) {
      console.error("No data returned from insert");
      return null;
    }

    // Transform snake_case to camelCase
    return {
      id: data.id,
      problemId: data.problem_id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error in addComment:", error);
    return null;
  }
}

/**
 * Delete a comment (only owner can delete)
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return false;
  }
}

/**
 * Update a comment (only owner can update)
 */
export async function updateComment(
  commentId: string,
  content: string,
): Promise<Comment | null> {
  try {
    if (!content.trim()) {
      throw new Error("Comment cannot be empty");
    }

    const { data, error } = await supabase
      .from("comments")
      .update({
        content: content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .select()
      .single();

    if (error) {
      console.error("Error updating comment:", error);
      return null;
    }

    // Transform snake_case to camelCase
    return {
      id: data.id,
      problemId: data.problem_id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error in updateComment:", error);
    return null;
  }
}
