export type CourseTemplateKey =
  | "pemrog"
  | "strukdat"
  | "gkv"
  | "oak"
  | "metkuan"
  | "rpl"
  | "dpp";

export interface CourseTemplateComponent {
  name: string;
  weight: number;
}

export interface GradeCriteria {
  letterGrade: string;
  minimumScore: number;
}

export interface CourseTemplate {
  key: CourseTemplateKey;
  name: string;
  sks: number;
  description: string;
  components: CourseTemplateComponent[];
}

// Default grade criteria: A >= 75, AB >= 70, B >= 65, BC >= 60, C >= 55, D >= 50, E < 50
export const defaultGradeCriteria: GradeCriteria[] = [
  { letterGrade: "A", minimumScore: 75 },
  { letterGrade: "AB", minimumScore: 70 },
  { letterGrade: "B", minimumScore: 65 },
  { letterGrade: "BC", minimumScore: 60 },
  { letterGrade: "C", minimumScore: 55 },
  { letterGrade: "D", minimumScore: 50 },
  { letterGrade: "E", minimumScore: 0 },
];

// GKV special grade criteria: A >= 80, AB >= 75, B >= 70, BC >= 65, C >= 60, D >= 55, E < 55
export const gkvGradeCriteria: GradeCriteria[] = [
  { letterGrade: "A", minimumScore: 80 },
  { letterGrade: "AB", minimumScore: 75 },
  { letterGrade: "B", minimumScore: 70 },
  { letterGrade: "BC", minimumScore: 65 },
  { letterGrade: "C", minimumScore: 60 },
  { letterGrade: "D", minimumScore: 55 },
  { letterGrade: "E", minimumScore: 0 },
];

export const courseTemplates: CourseTemplate[] = [
  {
    key: "pemrog",
    name: "Pemrog",
    sks: 3,
    description: "Template bobot Pemrograman 3 SKS.",
    components: [
      { name: "UTS", weight: 25 },
      { name: "UAS", weight: 25 },
      { name: "Kuis", weight: 5 },
      { name: "Tugas", weight: 4 },
      { name: "Praktikum", weight: 1 },
      { name: "UTS-P", weight: 20 },
      { name: "UAS-P", weight: 20 },
    ],
  },
  {
    key: "strukdat",
    name: "Strukdat",
    sks: 3,
    description: "Template bobot Struktur Data 3 SKS.",
    components: [
      { name: "Aktivitas", weight: 5 },
      { name: "Proyek", weight: 26 },
      { name: "Diskusi Kelompok", weight: 20 },
      { name: "Quiz", weight: 5 },
      { name: "UTS", weight: 22 },
      { name: "UAS", weight: 22 },
    ],
  },
  {
    key: "gkv",
    name: "GKV",
    sks: 2,
    description: "Template bobot GKV 2 SKS.",
    components: [
      { name: "UTS", weight: 28 },
      { name: "ProBL", weight: 55 },
      { name: "Tugas/Kuis", weight: 12 },
      { name: "Aktif", weight: 5 },
    ],
  },
  {
    key: "oak",
    name: "OAK",
    sks: 2,
    description: "Template bobot OAK 2 SKS.",
    components: [
      { name: "UTS", weight: 21 },
      { name: "UAS", weight: 22 },
      { name: "Kuis", weight: 6 },
      { name: "Assembly", weight: 43 },
      { name: "Presentasi", weight: 6 },
    ],
  },
  {
    key: "metkuan",
    name: "Metkuan",
    sks: 3,
    description: "Template bobot Metkuan 3 SKS.",
    components: [
      { name: "UTS", weight: 30 },
      { name: "UAS", weight: 30 },
      { name: "Projek", weight: 15 },
      { name: "Tugas", weight: 15 },
      { name: "Quiz", weight: 10 },
    ],
  },
  {
    key: "rpl",
    name: "RPL",
    sks: 3,
    description: "Template bobot RPL 3 SKS.",
    components: [
      { name: "Aktivitas Partisipatif", weight: 10 },
      { name: "Hasil Proyek", weight: 20 },
      { name: "Tugas praktikum", weight: 20 },
      { name: "Quiz", weight: 20 },
      { name: "UTS", weight: 15 },
      { name: "UAS", weight: 15 },
    ],
  },
  {
    key: "dpp",
    name: "DPP",
    sks: 2,
    description: "Template bobot DPP 2 SKS.",
    components: [
      { name: "Tugas LinkedinLearning", weight: 5 },
      { name: "Quiz", weight: 10 },
      { name: "Presentasi UTS", weight: 10 },
      { name: "Presentasi UAS", weight: 10 },
      { name: "LKP", weight: 40 },
      { name: "Produk + final docs", weight: 15 },
      { name: "Aktivitas Partisipatif", weight: 5 },
    ],
  },
];

export function getCourseTemplate(key: CourseTemplateKey) {
  return courseTemplates.find((template) => template.key === key) || null;
}

export function getDefaultGradeCriteria(
  courseKey: CourseTemplateKey,
): GradeCriteria[] {
  return courseKey === "gkv" ? gkvGradeCriteria : defaultGradeCriteria;
}
