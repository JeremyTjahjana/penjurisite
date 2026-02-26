"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getProblemById, Problem } from "@/lib/problems";
import { getCommentsByProblem, Comment } from "@/lib/comments";
import { toast } from "react-hot-toast";
import {
  addCommentAction,
  addReplyAction,
  deleteCommentAction,
} from "@/lib/comments-actions";

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useUser();
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState(false);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  const { id } = use(params);
  const normalizedId = decodeURIComponent(id).trim();

  useEffect(() => {
    const fetchProblem = async () => {
      const data = await getProblemById(normalizedId);
      setProblem(data);
      setLoading(false);
    };
    fetchProblem();
  }, [normalizedId]);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      const data = await getCommentsByProblem(normalizedId);
      setComments(data);
      setCommentsLoading(false);
    };
    fetchComments();
  }, [normalizedId]);

  if (loading) {
    return (
      <section className="flex flex-1 flex-col bg-zinc-100 px-4 py-6 md:px-10 md:py-12">
        <div className="text-center py-12">
          <p className="text-xs text-zinc-600 md:text-sm">Memuat soal...</p>
        </div>
      </section>
    );
  }

  if (!problem) {
    notFound();
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(problem.solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Anda harus login untuk berkomentar");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }

    setSubmittingComment(true);

    const newComment = await addCommentAction(normalizedId, commentContent);

    if (newComment) {
      setComments([newComment, ...comments]);
      setCommentContent("");
      toast.success("Komentar berhasil ditambahkan!");
    } else {
      toast.error("Gagal menambahkan komentar");
    }

    setSubmittingComment(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    setConfirmingDelete(commentId);
  };

  const handleSubmitReply = async (
    e: React.FormEvent,
    parentCommentId: string,
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error("Anda harus login untuk membalas komentar");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Balasan tidak boleh kosong");
      return;
    }

    setSubmittingReply(true);

    const newReply = await addReplyAction(
      normalizedId,
      parentCommentId,
      replyContent,
    );

    if (newReply) {
      // Update comments tree with new reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Balasan berhasil ditambahkan!");
    } else {
      toast.error("Gagal menambahkan balasan");
    }

    setSubmittingReply(false);
  };

  return (
    <section className="flex flex-1 flex-col bg-zinc-100 px-4 py-6 md:px-10 md:py-12">
      <Link
        href="/problems"
        className="mb-6 inline-flex w-fit items-center gap-2 text-xs font-medium text-blue-600 hover:underline md:text-sm"
      >
        ← Kembali ke daftar soal
      </Link>

      <div className="mx-auto w-full max-w-4xl rounded-lg bg-white px-5 py-6 shadow-sm md:px-12 md:py-10">
        <h2 className="border-b-2 border-zinc-900 pb-3 text-center text-xl font-semibold text-zinc-900 md:text-2xl">
          {problem.title}
        </h2>

        <div className="mb-6 mt-6 border-l-4 border-zinc-500 bg-zinc-50 p-3 font-mono text-xs text-zinc-700 md:p-4 md:text-sm">
          <div>Time limit: {problem.timeLimit}</div>
          <div>Memory limit: {problem.memoryLimit}</div>
        </div>

        <div className="space-y-6 text-xs text-zinc-800 md:text-sm">
          <div>
            <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
              Deskripsi
            </h3>
            <div className="whitespace-pre-line leading-relaxed">
              {problem.description}
            </div>
          </div>

          {problem.constraints && (
            <div>
              <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
                Batasan
              </h3>
              <p className="whitespace-pre-line leading-relaxed">
                {problem.constraints}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
              Masukan
            </h3>
            <p className="whitespace-pre-line leading-relaxed">
              {problem.input}
            </p>
          </div>

          <div>
            <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
              Keluaran
            </h3>
            <p className="whitespace-pre-line leading-relaxed">
              {problem.output}
            </p>
          </div>

          {problem.examples.map((example, index) => (
            <div key={index}>
              <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
                Contoh Masukan {index + 1}
              </h3>
              <div className="inline-block whitespace-pre-line rounded bg-zinc-100 px-3 py-2 font-mono text-xs md:px-4 md:py-3 md:text-sm">
                {example.input}
              </div>

              <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
                Contoh Keluaran {index + 1}
              </h3>
              <div className="inline-block whitespace-pre-line rounded bg-zinc-100 px-3 py-2 font-mono text-xs md:px-4 md:py-3 md:text-sm">
                {example.output}
              </div>

              {example.explanation && (
                <>
                  <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
                    Penjelasan Contoh {index + 1}
                  </h3>
                  <p className="leading-relaxed">{example.explanation}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-8">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 md:px-6 md:py-3 md:text-base"
          >
            {showSolution ? "Sembunyikan Solusi" : "Lihat Solusi"}
          </button>

          {showSolution && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
                  Solusi
                </h3>
                <button
                  onClick={handleCopy}
                  className="rounded bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-300 md:px-4 md:py-2 md:text-sm"
                >
                  {copied ? "✓ Tersalin!" : "Salin Kode"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-100 md:p-5 md:text-sm">
                <code>{problem.solution}</code>
              </pre>

              <div className="mt-6 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-3 md:p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 md:text-base">
                  Video Tutorial
                </h3>
                {problem.youtubeLink ? (
                  <div className="mt-4">
                    {(() => {
                      const url = problem.youtubeLink;
                      let videoId = "";

                      // Extract video ID from various YouTube URL formats
                      if (url.includes("watch?v=")) {
                        videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
                      } else if (url.includes("youtu.be/")) {
                        videoId =
                          url.split("youtu.be/")[1]?.split("?")[0] || "";
                      } else if (url.includes("embed/")) {
                        videoId = url.split("embed/")[1]?.split("?")[0] || "";
                      }

                      if (!videoId) {
                        return (
                          <div className="text-xs text-zinc-600 md:text-sm">
                            <p>Link video tidak valid: {url}</p>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-blue-600 hover:underline"
                            >
                              Buka di YouTube →
                            </a>
                          </div>
                        );
                      }

                      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

                      return (
                        <>
                          <iframe
                            width="100%"
                            height="315"
                            src={embedUrl}
                            title="Video Tutorial"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-xs text-blue-600 hover:underline md:text-sm"
                          >
                            Buka di YouTube →
                          </a>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-zinc-600 md:text-sm">
                    Video tutorial belum tersedia
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-12 border-t border-zinc-200 pt-8">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-bold text-zinc-900 md:text-xl">
              Komentar
            </h2>
            <span className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 md:text-xs">
              {comments.length}
            </span>
          </div>

          {/* Comment Form - Only for Logged In Users */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-white md:h-8 md:w-8 md:text-sm">
                    {user.firstName?.charAt(0).toUpperCase() || "?"}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Tulis komentar..."
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-sans text-xs transition-all focus:border-zinc-500 focus:outline-none md:text-sm"
                    rows={2}
                    disabled={submittingComment}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentContent.trim()}
                      className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed md:px-4 md:py-1.5 md:text-sm"
                    >
                      {submittingComment ? "Mengirim..." : "Kirim"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 rounded-lg border border-zinc-300 bg-zinc-50 p-4">
              <p className="text-xs text-zinc-700 md:text-sm">
                <Link
                  href="/sign-in"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Masuk
                </Link>{" "}
                untuk berkomentar
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="mb-4 h-8 w-8 animate-spin text-blue-600 md:h-10 md:w-10"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-xs text-zinc-600 md:text-sm">
                Memuat komentar...
              </p>
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center md:p-8">
              <p className="text-xs text-zinc-600 md:text-sm">
                Belum ada komentar. Jadilah yang pertama berkomentar!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Main Comment */}
                  <div className="flex gap-3 py-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-white md:h-8 md:w-8 md:text-sm">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-xs font-semibold text-zinc-900 md:text-sm">
                          {comment.userName}
                        </p>
                        <p className="text-[11px] text-zinc-500 md:text-xs">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                        {user?.id === comment.userId && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="ml-auto text-[11px] text-zinc-500 hover:text-red-600 md:text-xs"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      <p className="mb-2 whitespace-pre-wrap text-xs text-zinc-700 md:text-sm">
                        {comment.content}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        {user && (
                          <button
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment.id ? null : comment.id,
                              )
                            }
                            className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 md:text-xs"
                          >
                            {replyingTo === comment.id ? "Batal" : "Balas"}
                          </button>
                        )}
                        {comment.replies && comment.replies.length > 0 && (
                          <button
                            onClick={() =>
                              setShowReplies((prev) => ({
                                ...prev,
                                [comment.id]: !prev[comment.id],
                              }))
                            }
                            className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 md:text-xs"
                          >
                            {showReplies[comment.id] ? (
                              <svg
                                className="h-3.5 w-3.5 md:h-4 md:w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-3.5 w-3.5 md:h-4 md:w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                            {showReplies[comment.id] ? "Sembunyikan" : "Lihat"}{" "}
                            {comment.replies.length} balasan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && user && (
                    <div className="ml-11 mt-2 animate-slide-down">
                      <form
                        onSubmit={(e) => handleSubmitReply(e, comment.id)}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-[11px] font-bold text-white md:h-7 md:w-7 md:text-xs">
                            {user.firstName?.charAt(0).toUpperCase() || "?"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Tulis balasan..."
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-sans text-xs transition-all focus:border-zinc-500 focus:outline-none md:text-sm"
                            rows={2}
                            disabled={submittingReply}
                            autoFocus
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="submit"
                              disabled={submittingReply || !replyContent.trim()}
                              className="rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed md:px-3 md:text-xs"
                            >
                              {submittingReply ? "Mengirim..." : "Balas"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition hover:bg-zinc-100 md:px-3 md:text-xs"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies &&
                    comment.replies.length > 0 &&
                    showReplies[comment.id] && (
                      <div className="ml-11 mt-3 space-y-3">
                        {comment.replies.map((reply, replyIndex) => (
                          <div
                            key={reply.id}
                            className="animate-fade-in flex gap-3 py-2"
                            style={{
                              animationDelay: `${index * 50 + replyIndex * 30}ms`,
                            }}
                          >
                            {/* Reply Avatar */}
                            <div className="flex-shrink-0">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-[11px] font-bold text-white md:h-7 md:w-7 md:text-xs">
                                {reply.userName.charAt(0).toUpperCase()}
                              </div>
                            </div>

                            {/* Reply Content */}
                            <div className="flex-1 min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <p className="text-xs font-semibold text-zinc-900 md:text-sm">
                                  {reply.userName}
                                </p>
                                <p className="text-[11px] text-zinc-500 md:text-xs">
                                  {new Date(reply.createdAt).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                                {user?.id === reply.userId && (
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(reply.id)
                                    }
                                    className="ml-auto text-[11px] text-zinc-500 hover:text-red-600 md:text-xs"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </div>
                              <p className="whitespace-pre-wrap text-xs text-zinc-700 md:text-sm">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmingDelete && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setConfirmingDelete(null)}
          />
          {/* Confirmation Card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm rounded-lg bg-white p-5 shadow-xl md:p-6">
              <h3 className="mb-2 text-sm font-bold text-zinc-900 md:text-base">
                Hapus Komentar?
              </h3>
              <p className="mb-4 text-xs text-zinc-600 md:text-sm">
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmingDelete(null)}
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 md:px-4 md:py-2 md:text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    setDeletingComment(true);
                    const success = await deleteCommentAction(confirmingDelete);
                    if (success) {
                      // Update comments: remove from top level or from replies
                      setComments((prevComments) => {
                        // First try to remove as top-level comment
                        const filteredComments = prevComments.filter(
                          (c) => c.id !== confirmingDelete,
                        );

                        // If nothing was removed, it might be a reply
                        if (filteredComments.length === prevComments.length) {
                          // Remove from replies
                          return prevComments.map((comment) => ({
                            ...comment,
                            replies: comment.replies?.filter(
                              (r) => r.id !== confirmingDelete,
                            ),
                          }));
                        }

                        return filteredComments;
                      });
                      toast.success("Komentar berhasil dihapus!");
                    } else {
                      toast.error("Gagal menghapus komentar");
                    }
                    setConfirmingDelete(null);
                    setDeletingComment(false);
                  }}
                  disabled={deletingComment}
                  className="flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed md:px-4 md:py-2 md:text-sm"
                >
                  {deletingComment ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
