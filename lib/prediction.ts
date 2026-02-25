import { GradeCriterion } from "./grade";

export interface PredictionResult {
  letterGrade: string;
  requiredScore: number | null;
  status: "possible" | "secured" | "impossible" | "invalid";
  message: string;
}

export function getRequiredScoreForTarget(
  currentWeightedScore: number,
  missingWeight: number,
  targetMinimumScore: number,
): PredictionResult {
  if (missingWeight <= 0) {
    return {
      letterGrade: "",
      requiredScore: null,
      status: "invalid",
      message: "Tidak ada komponen kosong untuk diprediksi.",
    };
  }

  const requiredScore =
    (targetMinimumScore - currentWeightedScore) / (missingWeight / 100);

  if (requiredScore <= 0) {
    return {
      letterGrade: "",
      requiredScore: 0,
      status: "secured",
      message: "Nilai target sudah aman.",
    };
  }

  if (requiredScore > 100) {
    return {
      letterGrade: "",
      requiredScore,
      status: "impossible",
      message: "Tidak mungkin mencapai target dengan komponen tersisa.",
    };
  }

  return {
    letterGrade: "",
    requiredScore: Number(requiredScore.toFixed(2)),
    status: "possible",
    message: "Target masih bisa dicapai.",
  };
}

export function buildPredictionTargets(
  currentWeightedScore: number,
  missingWeight: number,
  gradeCriteria: GradeCriterion[],
  targetLetters: string[] = ["A", "AB", "B"],
): PredictionResult[] {
  const criteriaMap = new Map(
    gradeCriteria.map((criterion) => [criterion.letterGrade, criterion]),
  );

  return targetLetters.map((letter) => {
    const criterion = criteriaMap.get(letter);
    if (!criterion) {
      return {
        letterGrade: letter,
        requiredScore: null,
        status: "invalid",
        message: "Kriteria nilai belum diatur.",
      };
    }

    const result = getRequiredScoreForTarget(
      currentWeightedScore,
      missingWeight,
      criterion.minimumScore,
    );

    return {
      ...result,
      letterGrade: letter,
    };
  });
}
