import type { Course } from "@/lib/gpa-actions";

interface CourseHeaderProps {
  course: Course;
  componentsCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CourseHeader({
  course,
  componentsCount,
  onEdit,
  onDelete,
}: CourseHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">{course.name}</h2>
        <p className="text-sm text-zinc-500">
          {course.sks} SKS • {componentsCount} komponen
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:border-zinc-400"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:border-red-300"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
