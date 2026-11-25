import React from 'react';
import {
  Gauge,
  Scale,
  Waves,
  Atom,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Sigma,
  Target,
} from 'lucide-react';
import { ChapterId, ChapterMeta, SubsectionData } from '../types/physics';
import { RichMathText } from './MathTex';

interface DashboardHomeProps {
  chapters: ChapterMeta[];
  subsections: SubsectionData[];
  visitedIds: string[];
  solvedQuestionIds: string[];
  onSelectSubsection: (id: string) => void;
  onOpenFormulaSheet: () => void;
}

const chapterIcons: Record<ChapterId, React.ComponentType<{ className?: string }>> = {
  1: Gauge,
  2: Scale,
  3: Waves,
  4: Atom,
};

const accentStyles = {
  cyan: {
    grad: 'from-cyan-500 to-blue-600',
    soft: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-800/70',
    badge: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200',
    bar: 'bg-cyan-500',
  },
  emerald: {
    grad: 'from-emerald-500 to-teal-600',
    soft: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/70',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200',
    bar: 'bg-emerald-500',
  },
  violet: {
    grad: 'from-violet-500 to-purple-600',
    soft: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200/80 dark:border-violet-800/70',
    badge: 'bg-violet-100 dark:bg-violet-900/60 text-violet-800 dark:text-violet-200',
    bar: 'bg-violet-500',
  },
  amber: {
    grad: 'from-amber-500 to-orange-600',
    soft: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/70',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200',
    bar: 'bg-amber-500',
  },
};

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  chapters,
  subsections,
  visitedIds,
  solvedQuestionIds,
  onSelectSubsection,
  onOpenFormulaSheet,
}) => {
  const totalQuestions = subsections.reduce((s, x) => s + x.questions.length, 0);
  const totalSolved = subsections.reduce(
    (s, x) => s + x.questions.filter((q) => solvedQuestionIds.includes(q.id)).length,
    0
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-indigo-500/20">
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-cyan-200">
              <Sparkles className="w-3.5 h-3.5" />
              مطابق با آخرین چاپ کتاب فیزیک (۳) پایه دوازدهم — رشته علوم تجربی
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              آزمایشگاه تعاملی و کنکوری فیزیک دوازدهم
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-8">
              هر زیربخش از کتاب را به صورت <strong className="text-white">بصری و تعاملی</strong> یاد بگیر:
              متغیرها را تغییر بده، حرکت‌های شتاب‌دار، نیروها و اصطکاک، نوسان و موج، شکست نور، مدل اتمی بور و واپاشی هسته‌ای را <strong className="text-cyan-300">زنده</strong> ببین،
              نکات کنکوری را مرور کن و بلافاصله تست و مسئله حل کن!
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onSelectSubsection('1-3')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm transition-colors cursor-pointer"
              >
                شروع سریع: حرکت با شتاب ثابت (۱-۳)
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onSelectSubsection('2-2')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-bold text-sm transition-colors cursor-pointer"
              >
                آزمایشگاه اصطکاک و نیروهای خاص (۲-۲)
              </button>
              <button
                type="button"
                onClick={() => onSelectSubsection('3-6')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-violet-200 font-bold text-sm transition-colors cursor-pointer"
              >
                امواج، صوت و دوپلر (۳-۶)
              </button>
              <button
                type="button"
                onClick={onOpenFormulaSheet}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                <Sigma className="w-4 h-4" />
                فرمول‌نامه جامع
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5 shrink-0 lg:w-56">
            <div className="rounded-2xl bg-white/10 border border-white/10 p-3.5 backdrop-blur-sm">
              <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                زیربخش‌های بررسی‌شده
              </div>
              <div className="text-xl font-black mt-1" dir="ltr">
                {visitedIds.length} / {subsections.length}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-3.5 backdrop-blur-sm">
              <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-300" />
                تست و مسائل حل‌شده
              </div>
              <div className="text-xl font-black mt-1" dir="ltr">
                {totalSolved} / {totalQuestions}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-3.5 backdrop-blur-sm">
              <div className="text-[11px] text-slate-300">پوشش کامل کتاب</div>
              <div className="text-sm font-bold text-amber-300 mt-1">
                ۴ فصل • ۲۱ آزمایشگاه مجزا
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="space-y-5">
        {chapters.map((ch) => {
          const Icon = chapterIcons[ch.id];
          const st = accentStyles[ch.accent];
          const subs = subsections.filter((s) => s.chapterId === ch.id);
          const doneSubs = subs.filter((s) => visitedIds.includes(s.id)).length;
          const pct = Math.round((doneSubs / subs.length) * 100);

          return (
            <div
              key={ch.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${st.grad} text-white flex items-center justify-center shrink-0 shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        فصل {ch.numberFa}: {ch.title}
                      </h2>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${st.badge}`}>
                        {ch.konkoorShare}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <RichMathText text={ch.description} />
                    </p>
                  </div>
                </div>
                <div className="sm:w-44 shrink-0 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>پیشرفت فصل</span>
                    <span dir="ltr">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${st.bar} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {subs.map((sub) => {
                  const visited = visitedIds.includes(sub.id);
                  const subSolved = sub.questions.filter((q) => solvedQuestionIds.includes(q.id)).length;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => onSelectSubsection(sub.id)}
                      className="group text-right rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 hover:bg-white dark:bg-slate-950/50 dark:hover:bg-slate-800/80 p-3.5 transition-all cursor-pointer flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                          {sub.numberFa}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(sub.konkoorWeight === 'فوق‌العاده پرتکرار' ||
                            sub.konkoorWeight === 'خیلی مهم') && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                              {sub.konkoorWeight}
                            </span>
                          )}
                          {visited && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {sub.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          <RichMathText text={sub.subtitle} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                        <span>{sub.bookPages}</span>
                        <span>
                          تمرین: {subSolved}/{sub.questions.length}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
