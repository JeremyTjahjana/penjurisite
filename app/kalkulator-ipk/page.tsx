"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface Course {
  id: string;
  name: string;
  sks: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  A: 4.0,
  "A-": 3.7,
  B: 3.0,
  "B-": 2.7,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  E: 0.0,
};

export default function KalkulatorIPKPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseName, setCourseName] = useState("");
  const [sks, setSks] = useState("");
  const [grade, setGrade] = useState("A");
  const [editingId, setEditingId] = useState<string | null>(null);

  const calculateIPK = () => {
    if (courses.length === 0) return 0;

    const totalPoints = courses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.sks,
      0,
    );
    const totalSks = courses.reduce((sum, course) => sum + course.sks, 0);

    return totalSks === 0 ? 0 : (totalPoints / totalSks).toFixed(2);
  };

  const addCourse = () => {
    if (!courseName.trim()) {
      toast.error("Nama mata kuliah tidak boleh kosong");
      return;
    }

    if (!sks || parseInt(sks) < 1 || parseInt(sks) > 6) {
      toast.error("SKS harus antara 1-6");
      return;
    }

    if (editingId) {
      setCourses(
        courses.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: courseName,
                sks: parseInt(sks),
                grade,
              }
            : c,
        ),
      );
      toast.success("Mata kuliah berhasil diperbarui!");
      setEditingId(null);
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        name: courseName,
        sks: parseInt(sks),
        grade,
      };
      setCourses([...courses, newCourse]);
      toast.success("Mata kuliah berhasil ditambahkan!");
    }

    setCourseName("");
    setSks("");
    setGrade("A");
  };

  const editCourse = (course: Course) => {
    setCourseName(course.name);
    setSks(course.sks.toString());
    setGrade(course.grade);
    setEditingId(course.id);
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    toast.success("Mata kuliah berhasil dihapus!");
  };

  const clearAll = () => {
    if (courses.length === 0) return;
    if (confirm("Hapus semua mata kuliah?")) {
      setCourses([]);
      setEditingId(null);
      toast.success("Semua mata kuliah dihapus!");
    }
  };

  const totalSks = courses.reduce((sum, course) => sum + course.sks, 0);
  const ipk = calculateIPK();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900">Kalkulator IPK</h1>
          <p className="mt-2 text-zinc-600">
            Hitung IPK Anda dengan mudah dan akurat
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900">
                {editingId ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
              </h2>

              <div className="space-y-4">
                {/* Course Name */}
                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    Nama Mata Kuliah
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Algoritma & Struktur Data"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* SKS */}
                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    SKS (1-6)
                  </label>
                  <input
                    type="number"
                    value={sks}
                    onChange={(e) => setSks(e.target.value)}
                    placeholder="3"
                    min="1"
                    max="6"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    Nilai
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="A">A (4.0)</option>
                    <option value="A-">A- (3.7)</option>
                    <option value="B">B (3.0)</option>
                    <option value="B-">B- (2.7)</option>
                    <option value="C">C (2.0)</option>
                    <option value="C-">C- (1.7)</option>
                    <option value="D">D (1.0)</option>
                    <option value="E">E (0.0)</option>
                  </select>
                </div>

                {/* Button */}
                <button
                  onClick={addCourse}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 font-medium text-white transition hover:from-blue-600 hover:to-indigo-700"
                >
                  {editingId ? "Perbarui Mata Kuliah" : "Tambah Mata Kuliah"}
                </button>

                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setCourseName("");
                      setSks("");
                      setGrade("A");
                    }}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results & Courses List */}
          <div className="lg:col-span-2 space-y-6">
            {/* IPK Summary */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                  <p className="text-sm font-medium text-blue-700">Total SKS</p>
                  <p className="mt-1 text-3xl font-bold text-blue-900">
                    {totalSks}
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-4">
                  <p className="text-sm font-medium text-indigo-700">
                    IP Saat Ini
                  </p>
                  <p className="mt-1 text-3xl font-bold text-indigo-900">
                    {ipk}
                  </p>
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Daftar Mata Kuliah ({courses.length})
                </h2>
                {courses.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Hapus Semua
                  </button>
                )}
              </div>

              {courses.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center">
                  <p className="text-zinc-500">
                    Belum ada mata kuliah. Tambahkan mata kuliah terlebih
                    dahulu.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 hover:bg-zinc-100 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900">
                          {course.name}
                        </p>
                        <p className="text-sm text-zinc-600">
                          {course.sks} SKS • Nilai: {course.grade} (
                          {gradePoints[course.grade].toFixed(1)})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCourse(course)}
                          className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grade Scale Info */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 uppercase">
                Skala Penilaian
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(gradePoints).map(([grade, points]) => (
                  <div
                    key={grade}
                    className="flex justify-between rounded-lg bg-zinc-50 px-3 py-2"
                  >
                    <span className="font-medium text-zinc-700">{grade}</span>
                    <span className="text-zinc-600">{points.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
