"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createCourse,
  deleteComponent,
  deleteCourse,
  deleteGradeCriterion,
  getComponents,
  getCourses,
  getGradeCriteria,
  getStudentScores,
  upsertComponent,
  upsertGradeCriterion,
  upsertStudentScore,
  updateCourse,
  type ComponentItem,
  type Course,
  type GradeCriterionItem,
  type StudentScoreItem,
} from "@/lib/gpa-actions";
import {
  calculateFinalNumericScore,
  convertToIPBGradePoint,
  determineLetterGrade,
} from "@/lib/grade";
import { buildPredictionTargets } from "@/lib/prediction";

type FormMode = "create" | "edit";

type ConfirmAction = {
  title: string;
  message: string;
  onConfirm: () => void;
} | null;

export default function KalkulatorIPKPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [gradeCriteria, setGradeCriteria] = useState<GradeCriterionItem[]>([]);
  const [scores, setScores] = useState<StudentScoreItem[]>([]);
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});

  const [courseForm, setCourseForm] = useState({ name: "", sks: "" });
  const [courseMode, setCourseMode] = useState<FormMode>("create");
  const [courseEditingId, setCourseEditingId] = useState<string | null>(null);

  const [componentForm, setComponentForm] = useState({ name: "", weight: "" });
  const [componentMode, setComponentMode] = useState<FormMode>("create");
  const [componentEditingId, setComponentEditingId] = useState<string | null>(
    null,
  );

  const [criteriaForm, setCriteriaForm] = useState({
    letterGrade: "A",
    minimumScore: "",
  });
  const [criteriaMode, setCriteriaMode] = useState<FormMode>("create");
  const [criteriaEditingId, setCriteriaEditingId] = useState<string | null>(
    null,
  );

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Gagal memuat mata kuliah.");
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    const loadCourseDetails = async () => {
      if (!selectedCourseId) {
        setComponents([]);
        setGradeCriteria([]);
        setScores([]);
        setScoreInputs({});
        return;
      }

      setLoadingDetails(true);
      try {
        const [componentData, criteriaData, scoreData] = await Promise.all([
          getComponents(selectedCourseId),
          getGradeCriteria(selectedCourseId),
          getStudentScores(selectedCourseId),
        ]);

        setComponents(componentData);
        setGradeCriteria(criteriaData);
        setScores(scoreData);

        const nextInputs: Record<string, string> = {};
        for (const score of scoreData) {
          if (score.score !== null) {
            nextInputs[score.componentId] = String(score.score);
          }
        }
        setScoreInputs(nextInputs);
      } catch (error) {
        console.error("Error loading course details:", error);
        toast.error("Gagal memuat detail mata kuliah.");
      } finally {
        setLoadingDetails(false);
      }
    };

    loadCourseDetails();
  }, [selectedCourseId]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const totalWeight = useMemo(
    () => components.reduce((sum, component) => sum + component.weight, 0),
    [components],
  );

  const finalScoreResult = useMemo(
    () =>
      calculateFinalNumericScore(
        components.map((component) => ({
          id: component.id,
          name: component.name,
          weight: component.weight,
        })),
        scores.map((score) => ({
          componentId: score.componentId,
          score: score.score,
        })),
      ),
    [components, scores],
  );

  const missingWeight = useMemo(() => {
    const missingSet = new Set(finalScoreResult.missingComponentIds);
    return components
      .filter((component) => missingSet.has(component.id))
      .reduce((sum, component) => sum + component.weight, 0);
  }, [components, finalScoreResult.missingComponentIds]);

  const currentLetterGrade = useMemo(
    () => determineLetterGrade(finalScoreResult.finalScore, gradeCriteria),
    [finalScoreResult.finalScore, gradeCriteria],
  );

  const gradePoint = useMemo(
    () => convertToIPBGradePoint(currentLetterGrade),
    [currentLetterGrade],
  );

  const predictionTargets = useMemo(() => {
    if (finalScoreResult.missingComponentIds.length !== 1) return [];
    return buildPredictionTargets(
      finalScoreResult.finalScore,
      missingWeight,
      gradeCriteria.map((criterion) => ({
        id: criterion.id,
        letterGrade: criterion.letterGrade,
        minimumScore: criterion.minimumScore,
      })),
      ["A", "AB", "B"],
    );
  }, [finalScoreResult, missingWeight, gradeCriteria]);

  const handleCourseSubmit = async () => {
    if (!courseForm.name.trim()) {
      toast.error("Nama mata kuliah tidak boleh kosong.");
      return;
    }

    const sksValue = Number(courseForm.sks);
    if (!sksValue || sksValue <= 0) {
      toast.error("SKS harus lebih dari 0.");
      return;
    }

    if (courseMode === "create") {
      const created = await createCourse(courseForm.name.trim(), sksValue);
      if (!created) {
        toast.error("Gagal membuat mata kuliah.");
        return;
      }
      setCourses((prev) => [...prev, created]);
      setSelectedCourseId(created.id);
      toast.success("Mata kuliah dibuat.");
    } else if (courseEditingId) {
      const ok = await updateCourse(courseEditingId, {
        name: courseForm.name.trim(),
        sks: sksValue,
      });
      if (!ok) {
        toast.error("Gagal memperbarui mata kuliah.");
        return;
      }
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseEditingId
            ? { ...course, name: courseForm.name.trim(), sks: sksValue }
            : course,
        ),
      );
      toast.success("Mata kuliah diperbarui.");
    }

    setCourseForm({ name: "", sks: "" });
    setCourseMode("create");
    setCourseEditingId(null);
  };

  const handleCourseEdit = (course: Course) => {
    setCourseForm({ name: course.name, sks: String(course.sks) });
    setCourseMode("edit");
    setCourseEditingId(course.id);
  };

  const handleCourseDelete = async (courseId: string) => {
    setConfirmAction({
      title: "Hapus Mata Kuliah",
      message: "Hapus mata kuliah ini beserta komponennya?",
      onConfirm: async () => {
        const ok = await deleteCourse(courseId);
        if (!ok) {
          toast.error("Gagal menghapus mata kuliah.");
          return;
        }
        setCourses((prev) => prev.filter((course) => course.id !== courseId));
        if (selectedCourseId === courseId) {
          const next = courses.find((course) => course.id !== courseId);
          setSelectedCourseId(next?.id || null);
        }
        toast.success("Mata kuliah dihapus.");
        setConfirmAction(null);
      },
    });
  };

  const handleComponentSubmit = async () => {
    if (!selectedCourseId) return;
    if (!componentForm.name.trim()) {
      toast.error("Nama komponen tidak boleh kosong.");
      return;
    }

    const weightValue = Number(componentForm.weight);
    if (Number.isNaN(weightValue) || weightValue <= 0) {
      toast.error("Bobot harus lebih dari 0.");
      return;
    }

    const updated = await upsertComponent(selectedCourseId, {
      id: componentEditingId || undefined,
      name: componentForm.name.trim(),
      weight: weightValue,
      courseId: selectedCourseId,
      createdAt: "",
    });

    if (!updated) {
      toast.error("Gagal menyimpan komponen.");
      return;
    }

    setComponents((prev) => {
      const existingIndex = prev.findIndex(
        (component) => component.id === updated.id,
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = updated;
        return next;
      }
      return [...prev, updated];
    });

    setComponentForm({ name: "", weight: "" });
    setComponentMode("create");
    setComponentEditingId(null);
  };

  const handleComponentEdit = (component: ComponentItem) => {
    setComponentForm({
      name: component.name,
      weight: String(component.weight),
    });
    setComponentMode("edit");
    setComponentEditingId(component.id);
  };

  const handleComponentDelete = async (componentId: string) => {
    setConfirmAction({
      title: "Hapus Komponen",
      message: "Hapus komponen ini?",
      onConfirm: async () => {
        const ok = await deleteComponent(componentId);
        if (!ok) {
          toast.error("Gagal menghapus komponen.");
          return;
        }
        setComponents((prev) =>
          prev.filter((component) => component.id !== componentId),
        );
        setScores((prev) =>
          prev.filter((score) => score.componentId !== componentId),
        );
        toast.success("Komponen dihapus.");
        setConfirmAction(null);
      },
    });
  };

  const handleCriteriaSubmit = async () => {
    if (!selectedCourseId) return;
    const minimumScore = Number(criteriaForm.minimumScore);
    if (Number.isNaN(minimumScore) || minimumScore < 0) {
      toast.error("Minimum score harus valid.");
      return;
    }

    const updated = await upsertGradeCriterion(selectedCourseId, {
      id: criteriaEditingId || undefined,
      letterGrade: criteriaForm.letterGrade,
      minimumScore,
      courseId: selectedCourseId,
      createdAt: "",
    });

    if (!updated) {
      toast.error("Gagal menyimpan kriteria.");
      return;
    }

    setGradeCriteria((prev) => {
      const existingIndex = prev.findIndex(
        (criterion) => criterion.id === updated.id,
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = updated;
        return next;
      }
      return [...prev, updated];
    });

    setCriteriaForm({ letterGrade: "A", minimumScore: "" });
    setCriteriaMode("create");
    setCriteriaEditingId(null);
  };

  const handleCriteriaEdit = (criterion: GradeCriterionItem) => {
    setCriteriaForm({
      letterGrade: criterion.letterGrade,
      minimumScore: String(criterion.minimumScore),
    });
    setCriteriaMode("edit");
    setCriteriaEditingId(criterion.id);
  };

  const handleCriteriaDelete = async (criterionId: string) => {
    setConfirmAction({
      title: "Hapus Kriteria",
      message: "Hapus kriteria ini?",
      onConfirm: async () => {
        const ok = await deleteGradeCriterion(criterionId);
        if (!ok) {
          toast.error("Gagal menghapus kriteria.");
          return;
        }
        setGradeCriteria((prev) =>
          prev.filter((criterion) => criterion.id !== criterionId),
        );
        toast.success("Kriteria dihapus.");
        setConfirmAction(null);
      },
    });
  };

  const handleScoreBlur = async (componentId: string) => {
    if (!selectedCourseId) return;
    const inputValue = scoreInputs[componentId];
    const parsed = inputValue === "" ? null : Number(inputValue);

    if (
      parsed !== null &&
      (Number.isNaN(parsed) || parsed < 0 || parsed > 100)
    ) {
      toast.error("Nilai harus 0-100.");
      return;
    }

    const updated = await upsertStudentScore(
      selectedCourseId,
      componentId,
      parsed,
    );
    if (!updated) {
      toast.error("Gagal menyimpan nilai.");
      return;
    }

    setScores((prev) => {
      const existingIndex = prev.findIndex(
        (score) => score.componentId === componentId,
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = updated;
        return next;
      }
      return [...prev, updated];
    });
  };

  return (
    <>
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-semibold text-zinc-900">
              Academic Performance & GPA
            </h1>
            <p className="mt-2 text-base text-zinc-600">
              Kelola komponen nilai, kriteria, dan prediksi capaian IP.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Mata Kuliah
                </h2>

                <div className="mt-4 space-y-2">
                  {loadingCourses ? (
                    <p className="text-sm text-zinc-500">Memuat...</p>
                  ) : courses.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Belum ada mata kuliah.
                    </p>
                  ) : (
                    courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          selectedCourseId === course.id
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        <div className="font-medium">{course.name}</div>
                        <div className="text-xs opacity-70">
                          {course.sks} SKS
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {courseMode === "create"
                    ? "Tambah Mata Kuliah"
                    : "Edit Mata Kuliah"}
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-600">
                      Nama Mata Kuliah
                    </label>
                    <input
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                      value={courseForm.name}
                      onChange={(event) =>
                        setCourseForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-600">
                      SKS
                    </label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                      value={courseForm.sks}
                      min={1}
                      onChange={(event) =>
                        setCourseForm((prev) => ({
                          ...prev,
                          sks: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCourseSubmit}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      {courseMode === "create" ? "Simpan" : "Perbarui"}
                    </button>
                    {courseMode === "edit" && (
                      <button
                        onClick={() => {
                          setCourseMode("create");
                          setCourseEditingId(null);
                          setCourseForm({ name: "", sks: "" });
                        }}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <main className="space-y-6">
              {!selectedCourse ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-10 text-center text-sm text-zinc-500">
                  Pilih mata kuliah untuk mulai mengatur komponen dan nilai.
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900">
                          {selectedCourse.name}
                        </h2>
                        <p className="text-sm text-zinc-500">
                          {selectedCourse.sks} SKS • {components.length}{" "}
                          komponen
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCourseEdit(selectedCourse)}
                          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:border-zinc-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCourseDelete(selectedCourse.id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:border-red-300"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <div className="rounded-xl bg-zinc-900 px-4 py-3 text-white">
                        <p className="text-xs uppercase tracking-wide text-zinc-300">
                          Total Bobot
                        </p>
                        <p className="mt-2 text-2xl font-semibold">
                          {totalWeight.toFixed(0)}%
                        </p>
                      </div>
                      <div className="rounded-xl bg-zinc-100 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          Nilai Akhir
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-900">
                          {finalScoreResult.finalScore.toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-zinc-100 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          Letter Grade
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-900">
                          {currentLetterGrade || "-"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-zinc-100 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          Grade Point
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-900">
                          {gradePoint.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {totalWeight !== 100 && (
                      <p className="mt-4 text-sm text-amber-600">
                        Bobot total harus 100%. Saat ini{" "}
                        {totalWeight.toFixed(0)}
                        %.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Komponen Penilaian
                      </h3>

                      <div className="mt-4 space-y-3">
                        {components.length === 0 ? (
                          <p className="text-sm text-zinc-500">
                            Tambahkan komponen seperti UTS, UAS, Praktikum.
                          </p>
                        ) : (
                          components.map((component) => (
                            <div
                              key={component.id}
                              className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
                            >
                              <div>
                                <p className="text-sm font-medium text-zinc-800">
                                  {component.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Bobot {component.weight}%
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleComponentEdit(component)}
                                  className="text-xs text-zinc-600 hover:text-zinc-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleComponentDelete(component.id)
                                  }
                                  className="text-xs text-red-500 hover:text-red-700"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-5 border-t border-zinc-100 pt-4">
                        <h4 className="text-sm font-semibold text-zinc-800">
                          {componentMode === "create"
                            ? "Tambah Komponen"
                            : "Edit Komponen"}
                        </h4>
                        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_120px]">
                          <input
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                            placeholder="Nama komponen"
                            value={componentForm.name}
                            onChange={(event) =>
                              setComponentForm((prev) => ({
                                ...prev,
                                name: event.target.value,
                              }))
                            }
                          />
                          <input
                            type="number"
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                            placeholder="Bobot %"
                            value={componentForm.weight}
                            min={0}
                            onChange={(event) =>
                              setComponentForm((prev) => ({
                                ...prev,
                                weight: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={handleComponentSubmit}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            {componentMode === "create" ? "Simpan" : "Perbarui"}
                          </button>
                          {componentMode === "edit" && (
                            <button
                              onClick={() => {
                                setComponentMode("create");
                                setComponentEditingId(null);
                                setComponentForm({ name: "", weight: "" });
                              }}
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Kriteria Nilai
                      </h3>

                      <div className="mt-4 space-y-3">
                        {gradeCriteria.length === 0 ? (
                          <p className="text-sm text-zinc-500">
                            Tambahkan bobot nilai untuk A/AB/B/BC dan lainnya.
                          </p>
                        ) : (
                          gradeCriteria.map((criterion) => (
                            <div
                              key={criterion.id}
                              className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
                            >
                              <div>
                                <p className="text-sm font-medium text-zinc-800">
                                  {criterion.letterGrade}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Minimum {criterion.minimumScore}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCriteriaEdit(criterion)}
                                  className="text-xs text-zinc-600 hover:text-zinc-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleCriteriaDelete(criterion.id)
                                  }
                                  className="text-xs text-red-500 hover:text-red-700"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-5 border-t border-zinc-100 pt-4">
                        <h4 className="text-sm font-semibold text-zinc-800">
                          {criteriaMode === "create"
                            ? "Tambah Kriteria"
                            : "Edit Kriteria"}
                        </h4>
                        <p className="mt-2 text-xs text-zinc-500">
                          A (4.0) • AB (3.5) • B (3.0) • BC (2.5) • C (2.0) • D
                          (1.5) • E (1.0)
                        </p>
                        <div className="mt-3 grid gap-3 md:grid-cols-[120px_1fr]">
                          <select
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                            value={criteriaForm.letterGrade}
                            onChange={(event) =>
                              setCriteriaForm((prev) => ({
                                ...prev,
                                letterGrade: event.target.value,
                              }))
                            }
                          >
                            {["A", "AB", "B", "BC", "C", "D", "E"].map(
                              (grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ),
                            )}
                          </select>
                          <input
                            type="number"
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                            placeholder="Minimum score"
                            value={criteriaForm.minimumScore}
                            min={0}
                            max={100}
                            onChange={(event) =>
                              setCriteriaForm((prev) => ({
                                ...prev,
                                minimumScore: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={handleCriteriaSubmit}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            {criteriaMode === "create" ? "Simpan" : "Perbarui"}
                          </button>
                          {criteriaMode === "edit" && (
                            <button
                              onClick={() => {
                                setCriteriaMode("create");
                                setCriteriaEditingId(null);
                                setCriteriaForm({
                                  letterGrade: "A",
                                  minimumScore: "",
                                });
                              }}
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Input Nilai
                      </h3>

                      {components.length === 0 ? (
                        <p className="mt-4 text-sm text-zinc-500">
                          Tambahkan komponen terlebih dahulu.
                        </p>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {components.map((component) => (
                            <div
                              key={component.id}
                              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
                            >
                              <div>
                                <p className="text-sm font-medium text-zinc-800">
                                  {component.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Bobot {component.weight}%
                                </p>
                              </div>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={scoreInputs[component.id] ?? ""}
                                onChange={(event) =>
                                  setScoreInputs((prev) => ({
                                    ...prev,
                                    [component.id]: event.target.value,
                                  }))
                                }
                                onBlur={() => handleScoreBlur(component.id)}
                                className="w-28 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                                placeholder="0-100"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Prediksi Nilai
                      </h3>

                      {finalScoreResult.missingComponentIds.length === 0 ? (
                        <p className="mt-4 text-sm text-zinc-500">
                          Semua komponen sudah terisi.
                        </p>
                      ) : finalScoreResult.missingComponentIds.length > 1 ? (
                        <p className="mt-4 text-sm text-zinc-500">
                          Isi nilai hingga tersisa 1 komponen untuk prediksi.
                        </p>
                      ) : predictionTargets.length === 0 ? (
                        <p className="mt-4 text-sm text-zinc-500">
                          Kriteria nilai belum lengkap.
                        </p>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {predictionTargets.map((target) => (
                            <div
                              key={target.letterGrade}
                              className={`rounded-lg px-3 py-2 ${
                                target.status === "impossible"
                                  ? "border border-red-200 bg-red-50"
                                  : "border border-zinc-100 bg-zinc-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-sm font-semibold ${
                                    target.status === "impossible"
                                      ? "text-red-700"
                                      : "text-zinc-800"
                                  }`}
                                >
                                  Target {target.letterGrade}
                                </span>
                                <span
                                  className={`text-sm ${
                                    target.status === "impossible"
                                      ? "text-red-600"
                                      : "text-zinc-600"
                                  }`}
                                >
                                  {target.requiredScore === null
                                    ? "-"
                                    : `${target.requiredScore.toFixed(2)}`}
                                </span>
                              </div>
                              <p
                                className={`text-xs ${
                                  target.status === "impossible"
                                    ? "text-red-600"
                                    : "text-zinc-500"
                                }`}
                              >
                                {target.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {loadingDetails && (
                <p className="text-sm text-zinc-500">Memuat detail...</p>
              )}
            </main>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmAction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                {confirmAction.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                {confirmAction.message}
              </p>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-sm font-medium text-zinc-700 border border-zinc-200 rounded-lg hover:bg-zinc-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    confirmAction.onConfirm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
