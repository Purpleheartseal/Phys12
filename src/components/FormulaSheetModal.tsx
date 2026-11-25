import React, { useState } from 'react';
import { X, Search, Sigma } from 'lucide-react';
import { ChapterId, SubsectionData } from '../types/physics';
import { MathTex, RichMathText } from './MathTex';
import { FormulaSymbolGrid } from './LabUI';

interface FormulaSheetModalProps {
  open: boolean;
  onClose: () => void;
  subsections: SubsectionData[];
  onJumpToSubsection: (id: string) => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({
  open,
  onClose,
  subsections,
  onJumpToSubsection,
}) => {
  const [chapterFilter, setChapterFilter] = useState<ChapterId | 'all'>('all');
  const [query, setQuery] = useState('');

  if (!open) return null;

  const filtered = subsections.filter((sub) => {
    if (sub.formulas.length === 0) return false;
    if (chapterFilter !== 'all' && sub.chapterId !== chapterFilter) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      sub.title.toLowerCase().includes(q) ||
      sub.formulas.some(
        (f) => f.label.toLowerCase().includes(q) || f.tex.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="فرمول‌نامه جامع فیزیک دوازدهم"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                فرمول‌نامه جامع فیزیک دوازدهم (تجربی)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مرور سریع همه روابط کلیدی هر ۴ فصل + دسترسی مستقیم به آزمایشگاه هر رابطه
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن فرمول‌نامه"
            title="بستن"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی فرمول یا مبحث (مثلاً شتاب، اصطکاک، آونگ، اسنل، ریدبرگ، نیمه‌عمر)..."
              className="w-full pr-9 pl-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                ['all', 'همه فصول'],
                [1, 'فصل ۱'],
                [2, 'فصل ۲'],
                [3, 'فصل ۳'],
                [4, 'فصل ۴'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setChapterFilter(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  chapterFilter === val
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {filtered.map((sub) => (
            <div key={sub.id} className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  {sub.numberFa} — {sub.title}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    onJumpToSubsection(sub.id);
                    onClose();
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  رفتن به آزمایشگاه ←
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sub.formulas.map((f) => (
                  <div
                    key={f.id}
                    className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3 space-y-2 ${
                      f.tex.length > 52 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2">
                      <span><RichMathText text={f.label} /></span>
                      {f.bookRef && <span className="text-[10px] opacity-70 shrink-0">{f.bookRef}</span>}
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200/70 dark:border-slate-800">
                      <MathTex tex={f.tex} block />
                    </div>
                    <FormulaSymbolGrid symbols={f.variables} compact title="راهنمای نمادها:" />
                    {f.konkoorNote && (
                      <div className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                        <RichMathText text={f.konkoorNote} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
