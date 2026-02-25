export interface ComponentWeight {
  id: string;
  name: string;
  weight: number;
}

export interface ScoreEntry {
  componentId: string;
  score: number | null;
}

export interface GradeCriterion {
  id: string;
  letterGrade: string;
  minimumScore: number;
}

export interface FinalScoreResult {
  finalScore: number;
  totalWeight: number;
  missingComponentIds: string[];
}

export function calculateFinalNumericScore(
  components: ComponentWeight[],
  scores: ScoreEntry[],
): FinalScoreResult {
  const scoreByComponent = new Map<string, number | null>();
  for (const score of scores) {
    scoreByComponent.set(score.componentId, score.score);
  }

  let finalScore = 0;
  let totalWeight = 0;
  const missingComponentIds: string[] = [];

  for (const component of components) {
    totalWeight += component.weight;
    const score = scoreByComponent.get(component.id);
    if (score === null || score === undefined) {
      missingComponentIds.push(component.id);
      continue;
    }
    finalScore += (score * component.weight) / 100;
  }

  return {
    finalScore,
    totalWeight,
    missingComponentIds,
  };
}

export function determineLetterGrade(
  finalScore: number,
  gradeCriteria: GradeCriterion[],
): string | null {
  if (gradeCriteria.length === 0) return null;

  const sorted = [...gradeCriteria].sort(
    (a, b) => b.minimumScore - a.minimumScore,
  );

  for (const criterion of sorted) {
    if (finalScore >= criterion.minimumScore) {
      return criterion.letterGrade;
    }
  }

  return null;
}

export function convertToIPBGradePoint(letterGrade: string | null): number {
  switch (letterGrade) {
    case "A":
      return 4;
    case "AB":
      return 3.5;
    case "B":
      return 3;
    case "BC":
      return 2.5;
    case "C":
      return 2;
    case "D":
      return 1.5;
    case "E":
      return 1;
    default:
      return 0;
  }
}
