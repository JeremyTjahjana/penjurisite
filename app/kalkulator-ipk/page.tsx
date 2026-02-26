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
import CourseList from "./components/CourseList";
import CourseForm from "./components/CourseForm";
import CourseHeader from "./components/CourseHeader";
import CourseSummary from "./components/CourseSummary";
import ComponentsSection from "./components/ComponentsSection";
import CriteriaSection from "./components/CriteriaSection";
import ScoreInputSection from "./components/ScoreInputSection";
import PredictionSection from "./components/PredictionSection";
import ConfirmModal from "./components/ConfirmModal";

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
              IPK and Grade Calculator
            </h1>
            <p className="mt-2 text-base text-zinc-600">
              Kelola komponen nilai, kriteria, dan prediksi capaian IP.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-6">
              <CourseList
                courses={courses}
                selectedCourseId={selectedCourseId}
                loadingCourses={loadingCourses}
                onSelectCourse={setSelectedCourseId}
              />

              <CourseForm
                courseForm={courseForm}
                courseMode={courseMode}
                onFormChange={(updates) =>
                  setCourseForm((prev) => ({ ...prev, ...updates }))
                }
                onSubmit={handleCourseSubmit}
                onCancel={() => {
                  setCourseMode("create");
                  setCourseEditingId(null);
                  setCourseForm({ name: "", sks: "" });
                }}
              />
            </aside>

            <main className="space-y-6">
              {!selectedCourse ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-10 text-center text-sm text-zinc-500">
                  Pilih mata kuliah untuk mulai mengatur komponen dan nilai.
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
                    <CourseHeader
                      course={selectedCourse}
                      componentsCount={components.length}
                      onEdit={() => handleCourseEdit(selectedCourse)}
                      onDelete={() => handleCourseDelete(selectedCourse.id)}
                    />

                    <CourseSummary
                      totalWeight={totalWeight}
                      finalScore={finalScoreResult.finalScore}
                      letterGrade={currentLetterGrade}
                      gradePoint={gradePoint}
                    />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <ComponentsSection
                      components={components}
                      componentForm={componentForm}
                      componentMode={componentMode}
                      onComponentEdit={handleComponentEdit}
                      onComponentDelete={handleComponentDelete}
                      onFormChange={(updates) =>
                        setComponentForm((prev) => ({ ...prev, ...updates }))
                      }
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

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <ScoreInputSection
                      components={components}
                      scoreInputs={scoreInputs}
                      onScoreChange={(componentId, value) =>
                        setScoreInputs((prev) => ({
                          ...prev,
                          [componentId]: value,
                        }))
                      }
                      onScoreBlur={handleScoreBlur}
                    />

                    <PredictionSection
                      missingComponentsCount={
                        finalScoreResult.missingComponentIds.length
                      }
                      predictionTargets={predictionTargets}
                    />
                  </div>
                </>
              )}

              {loadingDetails && (
                <p className="text-sm text-zinc-500">Memuat detail...</p>
              )}
            </main>
          </div>
        </div>

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
