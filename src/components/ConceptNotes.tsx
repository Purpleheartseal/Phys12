import React from 'react';
import { BookOpen, Flame, AlertTriangle, Sigma } from 'lucide-react';
import { SubsectionData } from '../types/physics';
import { MathTex, RichMathText } from './MathTex';
import { FormulaSymbolGrid } from './LabUI';

export const ConceptNotes: React.FC<{ subsection: SubsectionData }> = ({ subsection }) => {
  return (
    <div className="space-y-5">
      {/* Core Summary */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h3>درسنامه فشرده و دقیق مطابق کتاب درسی ({subsection.bookPages})</h3>
        </div>
        <ul className="space-y-2.5 text-sm sm:text-[15px] leading-8 text-slate-700 dark:text-slate-200">
          {subsection.summary.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-3 shrink-0" />
              <span>
                <RichMathText text={point} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulas Box */}
      {subsection.formulas.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-bold text-base">
            <Sigma className="w-5 h-5" />
            <h3>فرمول‌ها و یکاهای کلیدی این زیربخش</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subsection.formulas.map((f) => (
              <div
                key={f.id}
                className={`rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-3 ${
                  f.tex.length > 52 ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    <RichMathText text={f.label} />
                  </span>
                  {f.bookRef && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {f.bookRef}
                    </span>
                  )}
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3">
                  <MathTex tex={f.tex} block />
                </div>
                <FormulaSymbolGrid symbols={f.variables} compact />
                {f.konkoorNote && (
                  <div className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-700/40 rounded-lg p-2.5 leading-relaxed">
                    <RichMathText text={f.konkoorNote} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Konkoor Tips + Common Traps side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-base">
            <Flame className="w-5 h-5" />
            <h3>نکات طلایی کنکور</h3>
          </div>
          <ul className="space-y-2.5 text-sm leading-7 text-slate-800 dark:text-slate-200">
            {subsection.konkoorTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-0.5">★</span>
                <RichMathText text={tip} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-700/50 bg-rose-50/50 dark:bg-rose-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <h3>تله‌های رایج طراحان سوال</h3>
          </div>
          <ul className="space-y-2.5 text-sm leading-7 text-slate-800 dark:text-slate-200">
            {subsection.commonTraps.map((trap, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold mt-0.5">!</span>
                <RichMathText text={trap} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
