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
      <section className="flex flex-1 flex-col bg-zinc-100 px-10 py-12">
        <div className="text-center py-12">
          <p className="text-zinc-600">Memuat soal...</p>
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
    <section className="flex flex-1 flex-col bg-zinc-100 px-10 py-12">
      <Link
        href="/problems"
        className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        ← Kembali ke daftar soal
      </Link>

      <div className="mx-auto w-full max-w-4xl rounded-lg bg-white px-12 py-10 shadow-sm">
        <h2 className="border-b-2 border-zinc-900 pb-3 text-center text-2xl font-semibold text-zinc-900">
          {problem.title}
        </h2>

        <div className="mb-6 mt-6 border-l-4 border-zinc-500 bg-zinc-50 p-4 font-mono text-sm text-zinc-700">
          <div>Time limit: {problem.timeLimit}</div>
          <div>Memory limit: {problem.memoryLimit}</div>
        </div>

        <div className="space-y-6 text-zinc-800">
          <div>
            <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
              Deskripsi
            </h3>
            <div className="whitespace-pre-line leading-relaxed">
              {problem.description}
            </div>
          </div>

          {problem.constraints && (
            <div>
              <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
                Batasan
              </h3>
              <p className="whitespace-pre-line leading-relaxed">
                {problem.constraints}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
              Masukan
            </h3>
            <p className="whitespace-pre-line leading-relaxed">
              {problem.input}
            </p>
          </div>

          <div>
            <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
              Keluaran
            </h3>
            <p className="whitespace-pre-line leading-relaxed">
              {problem.output}
            </p>
          </div>

          {problem.examples.map((example, index) => (
            <div key={index}>
              <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
                Contoh Masukan {index + 1}
              </h3>
              <div className="inline-block whitespace-pre-line rounded bg-zinc-100 px-4 py-3 font-mono text-sm">
                {example.input}
              </div>

              <h3 className="mb-3 mt-6 text-base font-semibold uppercase tracking-wide text-zinc-900">
                Contoh Keluaran {index + 1}
              </h3>
              <div className="inline-block whitespace-pre-line rounded bg-zinc-100 px-4 py-3 font-mono text-sm">
                {example.output}
              </div>

              {example.explanation && (
                <>
                  <h3 className="mb-3 mt-6 text-base font-semibold uppercase tracking-wide text-zinc-900">
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
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            {showSolution ? "Sembunyikan Solusi" : "Lihat Solusi"}
          </button>

          {showSolution && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold uppercase tracking-wide text-zinc-900">
                  Solusi
                </h3>
                <button
                  onClick={handleCopy}
                  className="rounded bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300"
                >
                  {copied ? "✓ Tersalin!" : "Salin Kode"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-5 text-sm text-zinc-100">
                <code>{problem.solution}</code>
              </pre>

              <div className="mt-6 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-4">
                <h3 className="text-base font-semibold uppercase tracking-wide text-zinc-900">
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
                          <div className="text-sm text-zinc-600">
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
                            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                          >
                            Buka di YouTube →
                          </a>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-zinc-600">
                    Video tutorial belum tersedia
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-12 border-t border-zinc-200 pt-8">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900">
            Komentar ({comments.length})
          </h2>

          {/* Comment Form - Only for Logged In Users */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="rounded-lg border-2 border-zinc-200 bg-white p-4">
                <p className="mb-3 text-sm text-zinc-600">
                  Berkomentar sebagai{" "}
                  <span className="font-semibold">{user.firstName}</span>
                </p>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Tulis komentar Anda di sini..."
                  className="w-full rounded border border-zinc-300 p-3 font-sans text-sm focus:border-blue-500 focus:outline-none"
                  rows={3}
                  disabled={submittingComment}
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                  className="mt-3 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-zinc-400"
                >
                  {submittingComment ? "Mengirim..." : "Kirim Komentar"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                <Link
                  href="/sign-in"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Masuk
                </Link>{" "}
                untuk menambahkan komentar
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8">
              <p className="text-zinc-600">Memuat komentar...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-lg bg-zinc-50 p-8 text-center">
              <p className="text-zinc-600">
                Belum ada komentar. Jadilah yang pertama berkomentar!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-zinc-900">
                          {comment.userName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      {user?.id === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-2 text-xs text-red-600 hover:text-red-800 hover:underline"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">
                      {comment.content}
                    </p>
                    {user && (
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id,
                          )
                        }
                        className="mt-3 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {replyingTo === comment.id ? "Batal" : "Balas"}
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && user && (
                    <form
                      onSubmit={(e) => handleSubmitReply(e, comment.id)}
                      className="ml-6 space-y-2"
                    >
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                        <p className="mb-2 text-xs text-zinc-600">
                          Membalas {comment.userName}
                        </p>
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Tulis balasan Anda..."
                          className="w-full rounded border border-zinc-300 p-2 font-sans text-sm focus:border-blue-500 focus:outline-none"
                          rows={2}
                          disabled={submittingReply}
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="submit"
                            disabled={submittingReply || !replyContent.trim()}
                            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:bg-zinc-400"
                          >
                            {submittingReply ? "Mengirim..." : "Kirim"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                            className="rounded bg-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-400"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 space-y-3 border-l-2 border-zinc-200 pl-4">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-zinc-900">
                                {reply.userName}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {new Date(reply.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                            {user?.id === reply.userId && (
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                className="ml-2 text-xs text-red-600 hover:text-red-800 hover:underline"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-xs text-zinc-700">
                            {reply.content}
                          </p>
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

      {/* Confirmation Card Modal */}
      {confirmingDelete && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setConfirmingDelete(null)}
          />
          {/* Confirmation Card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative w-96 rounded-lg bg-white p-6 shadow-2xl">
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                Hapus Komentar
              </h3>
              <p className="mb-6 text-sm text-zinc-600">
                Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmingDelete(null)}
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    setDeletingComment(true);
                    const success = await deleteCommentAction(confirmingDelete);
                    if (success) {
                      setComments(
                        comments.filter((c) => c.id !== confirmingDelete),
                      );
                      toast.success("Komentar berhasil dihapus!");
                    } else {
                      toast.error("Gagal menghapus komentar");
                    }
                    setConfirmingDelete(null);
                    setDeletingComment(false);
                  }}
                  disabled={deletingComment}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:bg-red-400"
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
