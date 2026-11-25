export type ChapterId = 1 | 2 | 3 | 4;

export interface FormulaItem {
  id: string;
  label: string;
  tex: string;
  bookRef?: string; // e.g. "رابطه ۱-۱۰"
  variables: { symbol: string; meaning: string; unit: string }[];
  konkoorNote?: string;
}

export interface PracticeQuestion {
  id: string;
  type: 'mcq' | 'numeric';
  difficulty: 'مفهومی' | 'تمرین کتاب' | 'کنکوری' | 'چالشی';
  source?: string; // e.g. "مشابه مثال ۱-۱۳ کتاب" or "تیپ کنکور سراسری"
  prompt: string;
  promptTex?: string;
  options?: { label: string; tex?: string }[]; // for mcq (4 choices)
  correctIndex?: number; // for mcq
  numericAnswer?: number; // for numeric
  tolerance?: number; // relative tolerance for numeric
  unit?: string;
  hint: string;
  solutionSteps: { text: string; tex?: string }[];
}

export interface SubsectionData {
  id: string; // e.g. "1-1"
  chapterId: ChapterId;
  numberFa: string; // e.g. "۱-۱"
  title: string;
  bookPages: string; // e.g. "صفحه ۲ تا ۱۲"
  subtitle: string;
  konkoorWeight: 'پایه' | 'مهم' | 'خیلی مهم' | 'فوق‌العاده پرتکرار';
  summary: string[];
  formulas: FormulaItem[];
  konkoorTips: string[];
  commonTraps: string[];
  questions: PracticeQuestion[];
  hasDynamicGenerator?: boolean;
}

export interface ChapterMeta {
  id: ChapterId;
  numberFa: string;
  title: string;
  subtitle: string;
  bookPages: string;
  konkoorShare: string; // approx share in Konkoor Physics
  accent: 'cyan' | 'emerald' | 'violet' | 'amber';
  description: string;
}
