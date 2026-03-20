"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createCourse,
  createCourseFromTemplate,
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
  courseTemplates,
  type CourseTemplateKey,
  getDefaultGradeCriteria,
} from "@/lib/course-templates";
import {
  calculateFinalNumericScore,
  convertToIPBGradePoint,
  determineLetterGrade,
} from "@/lib/grade";
import { getRequiredScoreForTarget } from "@/lib/prediction";
import ComponentsSection from "./components/ComponentsSection";
import CriteriaSection from "./components/CriteriaSection";
import ConfirmModal from "./components/ConfirmModal";
import CourseCreateModal from "./components/CourseCreateModal";

type FormMode = "create" | "edit";

type ConfirmAction = {
  title: string;
  message: string;
  onConfirm: () => void;
} | null;

type PredictionTarget = {
  letterGrade: string;
  requiredScore: number | null;
  status: "possible" | "secured" | "impossible" | "invalid";
  message: string;
};

export default function KalkulatorIPKPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [pendingTemplateKey, setPendingTemplateKey] =
    useState<CourseTemplateKey | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>(
    courseTemplates[0]?.key || "",
  );

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

  const predictionTargets = useMemo<PredictionTarget[]>(() => {
    const missingCount = finalScoreResult.missingComponentIds.length;
    if (missingCount !== 1 && missingCount !== 2) {
      return [];
    }

    const targetLetters = ["A", "AB", "B", "BC", "C", "D", "E"];
    return targetLetters.map((letter) => {
      const criterion = gradeCriteria.find(
        (item) => item.letterGrade === letter,
      );
      if (!criterion) {
        return {
          letterGrade: letter,
          requiredScore: null,
          status: "invalid",
          message: "Kriteria nilai belum diatur.",
        };
      }

      const result = getRequiredScoreForTarget(
        finalScoreResult.finalScore,
        missingWeight,
        criterion.minimumScore,
      );

      return {
        letterGrade: letter,
        requiredScore: result.requiredScore,
        status: result.status,
        message: result.message,
      };
    });
  }, [
    finalScoreResult.finalScore,
    finalScoreResult.missingComponentIds.length,
    gradeCriteria,
    missingWeight,
  ]);

  const handleTemplateAdd = async (templateKey: CourseTemplateKey) => {
    const template = courseTemplates.find((item) => item.key === templateKey);
    if (!template) {
      toast.error("Template tidak ditemukan.");
      return;
    }

    const existingCourse = courses.find(
      (course) => course.name === template.name && course.sks === template.sks,
    );
    if (existingCourse) {
      setSelectedCourseId(existingCourse.id);
      toast.success("Template sudah ada di dashboard, langsung dibuka.");
      return;
    }

    setPendingTemplateKey(templateKey);
    try {
      const createdCourse = await createCourseFromTemplate(templateKey);
      if (!createdCourse) {
        toast.error("Gagal menambahkan template ke dashboard.");
        return;
      }

      // Add default grade criteria
      const defaultCriteria = getDefaultGradeCriteria(templateKey);
      for (const criteria of defaultCriteria) {
        await upsertGradeCriterion(createdCourse.id, {
          letterGrade: criteria.letterGrade,
          minimumScore: criteria.minimumScore,
        });
      }

      setCourses((prev) => [...prev, createdCourse]);
      setSelectedCourseId(createdCourse.id);
      toast.success(`${template.name} berhasil ditambahkan.`);
    } catch (error) {
      console.error("Error adding template course:", error);
      toast.error("Gagal menambahkan template ke dashboard.");
    } finally {
      setPendingTemplateKey(null);
    }
  };

  const handleCourseEdit = (course: Course) => {
    setCourseForm({ name: course.name, sks: String(course.sks) });
    setCourseMode("edit");
    setCourseEditingId(course.id);
    setIsCreateModalOpen(true);
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

  const handleOpenCreateModal = () => {
    setCourseMode("create");
    setCourseEditingId(null);
    setSelectedTemplateKey(courseTemplates[0]?.key || "");
    setCourseForm({ name: "", sks: "" });
    setIsCreateModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setIsCreateModalOpen(false);
    setCourseMode("create");
    setCourseEditingId(null);
  };

  const handleCreateFromModal = async () => {
    if (courseMode === "edit") {
      if (!courseEditingId) {
        toast.error("Mata kuliah yang diedit tidak ditemukan.");
        return;
      }

      if (!courseForm.name.trim()) {
        toast.error("Nama mata kuliah tidak boleh kosong.");
        return;
      }

      const sksValue = Number(courseForm.sks);
      if (!sksValue || sksValue <= 0) {
        toast.error("SKS harus lebih dari 0.");
        return;
      }

      const updated = await updateCourse(courseEditingId, {
        name: courseForm.name.trim(),
        sks: sksValue,
      });

      if (!updated) {
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
      setIsCreateModalOpen(false);
      setCourseMode("create");
      setCourseEditingId(null);
      toast.success("Mata kuliah diperbarui.");
      return;
    }

    const template = selectedTemplateKey
      ? courseTemplates.find((item) => item.key === selectedTemplateKey)
      : null;

    if (template) {
      await handleTemplateAdd(template.key);
      setIsCreateModalOpen(false);
      return;
    }

    if (!courseForm.name.trim()) {
      toast.error("Nama mata kuliah tidak boleh kosong.");
      return;
    }

    const sksValue = Number(courseForm.sks);
    if (!sksValue || sksValue <= 0) {
      toast.error("SKS harus lebih dari 0.");
      return;
    }

    setPendingTemplateKey(null);
    const created = await createCourse(courseForm.name.trim(), sksValue);
    if (!created) {
      toast.error("Gagal membuat mata kuliah.");
      return;
    }

    // Add default grade criteria for custom course
    const defaultCriteria = getDefaultGradeCriteria("pemrog"); // Use standard criteria
    for (const criteria of defaultCriteria) {
      await upsertGradeCriterion(created.id, {
        letterGrade: criteria.letterGrade,
        minimumScore: criteria.minimumScore,
      });
    }

    setCourses((prev) => [...prev, created]);
    setSelectedCourseId(created.id);
    setIsCreateModalOpen(false);
    toast.success("Mata kuliah dibuat.");
  };

  return (
    <>
      <div className="min-h-screen bg-zinc-50 px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Kalkulator Nilai IPK
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
                Dashboard Nilai, Pembobotan dan Prediksi IPK
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600 md:text-base">
                Tambahkan mata kuliah, isi komponen penilaian, lalu lihat nilai
                akhir dan prediksi tanpa berpindah-pindah panel yang terpisah.
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Mata Kuliah
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {courses.length} tersimpan
              </p>
            </div>
          </header>

          <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-600">
                  Pilih Mata Kuliah
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                + Tambah
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {loadingCourses ? (
                <div className="text-sm text-zinc-500">
                  Memuat mata kuliah...
                </div>
              ) : courses.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  Belum ada mata kuliah tersimpan.
                </div>
              ) : (
                courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium transition ${
                      selectedCourseId === course.id
                        ? "border-zinc-950 text-zinc-950"
                        : "border-transparent text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {course.name} • {course.sks} SKS
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5">
            {!selectedCourse ? (
              <div className="text-sm text-zinc-500">
                Pilih mata kuliah untuk melihat nilai akhir, nama matkul, huruf
                mutu, dan prediksi.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                        Mata kuliah aktif
                      </p>
                      <h2 className="mt-2 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
                        {selectedCourse.name}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-600">
                        {selectedCourse.sks} SKS • {components.length} komponen
                        penilaian
                      </p>
                    </div>

                    <div className="flex gap-2 self-start">
                      <button
                        onClick={() => handleCourseEdit(selectedCourse)}
                        className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCourseDelete(selectedCourse.id)}
                        className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-red-600 hover:border-red-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Nilai akhir
                      </p>
                      <p className="mt-2 text-4xl font-black text-zinc-950">
                        {finalScoreResult.finalScore.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Huruf mutu
                      </p>
                      <p className="mt-2 text-4xl font-black text-zinc-950">
                        {currentLetterGrade || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Grade point
                      </p>
                      <p className="mt-2 text-4xl font-black text-zinc-950">
                        {gradePoint.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Total bobot
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900">
                        {totalWeight}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Komponen kosong
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900">
                        {finalScoreResult.missingComponentIds.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Status
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900">
                        {finalScoreResult.missingComponentIds.length === 0
                          ? "Selesai"
                          : finalScoreResult.missingComponentIds.length <= 2
                            ? "Bisa diprediksi"
                            : "Isi nilai"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Rata-rata sisa
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900">
                        {finalScoreResult.missingComponentIds.length > 0 &&
                        finalScoreResult.missingComponentIds.length <= 2
                          ? `${(
                              missingWeight /
                              finalScoreResult.missingComponentIds.length
                            ).toFixed(2)}% per komponen`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {finalScoreResult.missingComponentIds.length > 0 &&
                    finalScoreResult.missingComponentIds.length <= 2 && (
                      <div className="border-t border-zinc-200 pt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                          Prediksi nilai
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">
                          {finalScoreResult.missingComponentIds.length === 1
                            ? "Karena tersisa 1 komponen, berikut nilai yang diperlukan untuk tiap target."
                            : "Karena tersisa 2 komponen, berikut rata-rata nilai yang diperlukan jika keduanya diisi sama besar."}
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                          {predictionTargets.map((prediction) => (
                            <div
                              key={prediction.letterGrade}
                              className="border-t border-zinc-200 pt-3"
                            >
                              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                Target {prediction.letterGrade}
                              </p>
                              <p className="mt-2 text-2xl font-bold text-zinc-950">
                                {prediction.requiredScore === null
                                  ? "-"
                                  : prediction.requiredScore.toFixed(2)}
                              </p>
                              <p className="mt-1 text-xs text-zinc-500">
                                {prediction.status === "secured"
                                  ? "Sudah aman"
                                  : prediction.status === "impossible"
                                    ? "Tidak mungkin tercapai"
                                    : prediction.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6 rounded-lg border border-zinc-200 bg-white p-5">
            {!selectedCourse ? (
              <div className="text-sm text-zinc-500">
                Pilih mata kuliah dulu untuk mengatur komponen penilaian.
              </div>
            ) : (
              <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                <ComponentsSection
                  components={components}
                  componentForm={componentForm}
                  componentMode={componentMode}
                  scoreInputs={scoreInputs}
                  onComponentEdit={handleComponentEdit}
                  onComponentDelete={handleComponentDelete}
                  onFormChange={(updates) =>
                    setComponentForm((prev) => ({ ...prev, ...updates }))
                  }
                  onScoreChange={(componentId, value) =>
                    setScoreInputs((prev) => ({
                      ...prev,
                      [componentId]: value,
                    }))
                  }
                  onScoreBlur={handleScoreBlur}
                  onSubmit={handleComponentSubmit}
                  onCancel={() => {
                    setComponentMode("create");
                    setComponentEditingId(null);
                    setComponentForm({ name: "", weight: "" });
                  }}
                />

                <CriteriaSection
                  gradeCriteria={gradeCriteria}
                  criteriaForm={criteriaForm}
                  criteriaMode={criteriaMode}
                  onCriteriaEdit={handleCriteriaEdit}
                  onCriteriaDelete={handleCriteriaDelete}
                  onFormChange={(updates) =>
                    setCriteriaForm((prev) => ({ ...prev, ...updates }))
                  }
                  onSubmit={handleCriteriaSubmit}
                  onCancel={() => {
                    setCriteriaMode("create");
                    setCriteriaEditingId(null);
                    setCriteriaForm({ letterGrade: "A", minimumScore: "" });
                  }}
                />
              </div>
            )}

            {loadingDetails && (
              <p className="text-sm text-zinc-500">Memuat detail...</p>
            )}
          </section>
        </div>

        <CourseCreateModal
          isOpen={isCreateModalOpen}
          mode={courseMode}
          courseName={courseForm.name}
          sks={courseForm.sks}
          templates={courseTemplates}
          selectedTemplateKey={selectedTemplateKey}
          onClose={handleCloseCourseModal}
          onCourseNameChange={(value) =>
            setCourseForm((prev) => ({ ...prev, name: value }))
          }
          onSksChange={(value) =>
            setCourseForm((prev) => ({ ...prev, sks: value }))
          }
          onSelectedTemplateKeyChange={(value) => {
            setSelectedTemplateKey(value);
            const template = courseTemplates.find((item) => item.key === value);
            if (template) {
              setCourseForm({ name: template.name, sks: String(template.sks) });
            }
          }}
          onSubmit={handleCreateFromModal}
          submitting={pendingTemplateKey !== null}
        />

        {confirmAction && (
          <ConfirmModal
            title={confirmAction.title}
            message={confirmAction.message}
            onConfirm={confirmAction.onConfirm}
            onCancel={() => setConfirmAction(null)}
          />
        )}
      </div>
    </>
  );
}
