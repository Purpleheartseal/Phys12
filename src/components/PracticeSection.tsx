import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpenCheck,
  Sparkles,
  RotateCcw,
  Calculator,
  Award,
} from 'lucide-react';
import { PracticeQuestion } from '../types/physics';
import { MathTex, RichMathText } from './MathTex';
import { generateDynamicProblem } from '../utils/dynamicProblems';

interface PracticeSectionProps {
  subsectionId: string;
  questions: PracticeQuestion[];
  hasDynamicGenerator?: boolean;
  solvedIds: string[];
  onMarkSolved: (questionId: string) => void;
}

const difficultyBadge: Record<PracticeQuestion['difficulty'], string> = {
  مفهومی: 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  'تمرین کتاب':
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  کنکوری:
    'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  چالشی:
    'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

const QuestionCard: React.FC<{
  q: PracticeQuestion;
  index: number;
  isSolved: boolean;
  onSolved: () => void;
}> = ({ q, index, isSolved, onSolved }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [numInput, setNumInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setSelectedIdx(null);
    setNumInput('');
    setChecked(false);
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);
  }, [q.id]);

  const handleCheckMcq = (idx: number) => {
    setSelectedIdx(idx);
    const ok = idx === q.correctIndex;
    setChecked(true);
    setIsCorrect(ok);
    if (ok) {
      onSolved();
    }
  };

  const handleCheckNumeric = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = numInput
      .trim()
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .replace(/−/g, '-')
      .replace(/،|\/|,/g, '.');
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed) || q.numericAnswer === undefined) return;
    const tol = q.tolerance ?? 0.03;
    const ok =
      Math.abs(q.numericAnswer) < 1e-12
        ? Math.abs(parsed) < 1e-6
        : Math.abs(parsed - q.numericAnswer) <= Math.max(Math.abs(q.numericAnswer) * tol, 0.02);
    setChecked(true);
    setIsCorrect(ok);
    if (ok) {
      onSolved();
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setNumInput('');
    setChecked(false);
    setIsCorrect(null);
  };

  return (
    <div
      className={`rounded-2xl border transition-all bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-4 ${
        isSolved || isCorrect
          ? 'border-emerald-300 dark:border-emerald-700/70'
          : 'border-slate-200 dark:border-slate-700/80'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${difficultyBadge[q.difficulty]}`}
          >
            {q.difficulty}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {q.type === 'mcq' ? 'تست ۴ گزینه‌ای' : 'مسئله عددی'}
          </span>
          {q.source && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">• {q.source}</span>
          )}
        </div>
        {(isSolved || isCorrect) && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            حل شد
          </span>
        )}
      </div>

      <div className="text-sm sm:text-[15px] leading-8 text-slate-800 dark:text-slate-100 font-medium">
        <RichMathText text={q.prompt} />
      </div>

      {q.promptTex && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3">
          <MathTex tex={q.promptTex} block />
        </div>
      )}

      {q.type === 'mcq' && q.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {q.options.map((opt, idx) => {
            const isPicked = selectedIdx === idx;
            const isRightOption = idx === q.correctIndex;
            let cls =
              'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100';
            if (checked) {
              if (isRightOption) {
                cls =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500/40';
              } else if (isPicked && !isRightOption) {
                cls =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-1 ring-rose-500/40';
              }
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCheckMcq(idx)}
                className={`flex items-center gap-3 text-right p-3 rounded-xl border transition-all cursor-pointer ${cls}`}
              >
                <span className="w-6 h-6 shrink-0 rounded-full border border-current/30 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm leading-relaxed flex-1">
                  {opt.label && <RichMathText text={opt.label} />}
                  {opt.tex && <MathTex tex={opt.tex} className="mr-1" />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'numeric' && (
        <form onSubmit={handleCheckNumeric} className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <input
              type="text"
              dir="ltr"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="پاسخ عددی (مثلاً 12.5)"
              className="px-3.5 py-2.5 text-sm font-mono bg-transparent outline-none w-48 text-slate-900 dark:text-white"
            />
            {q.unit && (
              <span
                dir="ltr"
                className="px-3 py-2.5 text-xs font-mono font-bold bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-r border-slate-300 dark:border-slate-600"
              >
                {q.unit}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4" />
            بررسی پاسخ
          </button>
          {checked && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              تلاش مجدد
            </button>
          )}
        </form>
      )}

      {checked && isCorrect !== null && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2.5 ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>آفرین! پاسخ کاملاً درست است.</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>
                پاسخ درست نیست.{' '}
                {q.type === 'numeric' && q.numericAnswer !== undefined
                  ? `پاسخ دقیق: ${q.numericAnswer} ${q.unit ?? ''}`
                  : 'راهنمایی یا پاسخ تشریحی را ببینید تا تله سوال را بشناسید.'}
              </span>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-700/50 transition-colors cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {showHint ? 'بستن راهنمایی' : 'راهنمایی'}
        </button>
        <button
          type="button"
          onClick={() => setShowSolution((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-700/50 transition-colors cursor-pointer"
        >
          <BookOpenCheck className="w-3.5 h-3.5" />
          {showSolution ? 'بستن پاسخ تشریحی' : 'پاسخ تشریحی گام‌به‌گام'}
        </button>
      </div>

      {showHint && (
        <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 p-3.5 text-sm text-amber-900 dark:text-amber-100 leading-7">
          <RichMathText text={q.hint} />
        </div>
      )}

      {showSolution && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            پاسخ تشریحی مرحله‌به‌مرحله:
          </div>
          {q.solutionSteps.map((step, sIdx) => (
            <div key={sIdx} className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-start gap-2 leading-7">
                <span className="w-5 h-5 shrink-0 mt-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center">
                  {sIdx + 1}
                </span>
                <RichMathText text={step.text} />
              </div>
              {step.tex && (
                <div className="mr-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3 py-2">
                  <MathTex tex={step.tex} block />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PracticeSection: React.FC<PracticeSectionProps> = ({
  subsectionId,
  questions,
  hasDynamicGenerator,
  solvedIds,
  onMarkSolved,
}) => {
  const [dynamicQuestions, setDynamicQuestions] = useState<PracticeQuestion[]>([]);

  useEffect(() => {
    setDynamicQuestions([]);
  }, [subsectionId]);

  const handleGenerate = () => {
    const generated = generateDynamicProblem(subsectionId);
    if (generated) {
      setDynamicQuestions((prev) => [generated, ...prev]);
    }
  };

  const solvedCount = questions.filter((q) => solvedIds.includes(q.id)).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              بانک تمرین و تست کنکوری این زیربخش
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {solvedCount} از {questions.length} تمرین اصلی با موفقیت حل شده است
            </div>
          </div>
        </div>

        {hasDynamicGenerator && (
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            تولید تمرین جدید با اعداد تصادفی
          </button>
        )}
      </div>

      {dynamicQuestions.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            تمرین‌های تصادفی تولیدشده (برای تسلط کامل محاسباتی):
          </div>
          {dynamicQuestions.map((dq, i) => (
            <QuestionCard
              key={dq.id}
              q={dq}
              index={i}
              isSolved={solvedIds.includes(dq.id)}
              onSolved={() => onMarkSolved(dq.id)}
            />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={idx}
            isSolved={solvedIds.includes(q.id)}
            onSolved={() => onMarkSolved(q.id)}
          />
        ))}
      </div>
    </div>
  );
};
