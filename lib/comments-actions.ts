"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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
 * Server action to add a comment (with Clerk auth verification)
 */
export async function addCommentAction(
  problemId: string,
  content: string,
): Promise<Comment | null> {
  try {
    // Verify user is logged in with Clerk
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      console.error("User not authenticated - userId is null");
      throw new Error("User not authenticated");
    }

    if (!content.trim()) {
      throw new Error("Comment cannot be empty");
    }

    // Get full user info from Clerk
    const user = await currentUser();

    if (!user) {
      console.error("User not found in Clerk");
      throw new Error("User not found");
    }

    // Get user info from Clerk user object
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const userName =
      `${firstName} ${lastName}`.trim() || user.username || "Anonymous User";
    const userEmail = user.emailAddresses?.[0]?.emailAddress || "";

    console.log("Adding comment (server-side verified):", {
      problemId,
      userId,
      userName,
      userEmail,
      contentLength: content.length,
    });

    const insertData = {
      problem_id: problemId,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      content: content,
    };

    console.log("Insert data:", insertData);

    const { data, error, status } = await supabase
      .from("comments")
      .insert([insertData])
      .select()
      .single();

    console.log("Supabase response:", { data, error, status });

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

    console.log("Comment added successfully:", data);

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
    console.error("Error in addCommentAction:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}

/**
 * Server action to add a reply to a comment
 */
export async function addReplyAction(
  problemId: string,
  parentId: string,
  content: string,
): Promise<Comment | null> {
  try {
    // Verify user is logged in with Clerk
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      console.error("User not authenticated - userId is null");
      throw new Error("User not authenticated");
    }

    if (!content.trim()) {
      throw new Error("Reply cannot be empty");
    }

    // Get full user info from Clerk
    const user = await currentUser();

    if (!user) {
      console.error("User not found in Clerk");
      throw new Error("User not found");
    }

    // Get user info from Clerk user object
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const userName =
      `${firstName} ${lastName}`.trim() || user.username || "Anonymous User";
    const userEmail = user.emailAddresses?.[0]?.emailAddress || "";

    console.log("Adding reply (server-side verified):", {
      problemId,
      parentId,
      userId,
      userName,
      contentLength: content.length,
    });

    const insertData = {
      problem_id: problemId,
      parent_id: parentId,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      content: content,
    };

    const { data, error } = await supabase
      .from("comments")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Error adding reply:", {
        error,
        message: error.message,
        details: error.details,
      });
      return null;
    }

    if (!data) {
      console.error("No data returned from insert");
      return null;
    }

    console.log("Reply added successfully:", data);

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
      parentId: data.parent_id,
      replies: [],
    };
  } catch (error) {
    console.error("Error in addReplyAction:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return null;
  }
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
 * Delete a comment (server-side verification)
 */
export async function deleteCommentAction(commentId: string): Promise<boolean> {
  try {
    // Verify user is logged in
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // First verify the comment belongs to this user
    const { data: comment } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    console.log("Delete check:", {
      commentId,
      userId,
      commentUserId: comment?.user_id,
      match: comment?.user_id === userId,
    });

    if (!comment || comment.user_id !== userId) {
      console.error("User not authorized to delete this comment", {
        comment,
        userId,
      });
      return false;
    }

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
    console.error("Error in deleteCommentAction:", error);
    return false;
  }
}
