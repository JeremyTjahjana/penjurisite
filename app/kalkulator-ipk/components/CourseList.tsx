import type { Course } from "@/lib/gpa-actions";

interface CourseListProps {
  courses: Course[];
  selectedCourseId: string | null;
  loadingCourses: boolean;
  onSelectCourse: (courseId: string) => void;
}

export default function CourseList({
  courses,
  selectedCourseId,
  loadingCourses,
  onSelectCourse,
}: CourseListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Mata Kuliah
      </h2>

      <div className="mt-4 space-y-2">
        {loadingCourses ? (
          <p className="text-sm text-zinc-500">Memuat...</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-zinc-500">Belum ada mata kuliah.</p>
        ) : (
          courses.map((course) => (
            <button
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                selectedCourseId === course.id
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              }`}
            >
              <div className="font-medium">{course.name}</div>
              <div className="text-xs opacity-70">{course.sks} SKS</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
