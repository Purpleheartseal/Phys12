import React, { useState, useEffect, useMemo } from 'react';
import {
  Gauge,
  Scale,
  Waves,
  Atom,
  Home,
  FlaskConical,
  BookOpen,
  PenTool,
  Sigma,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Search,
  ChevronDown,
} from 'lucide-react';
import { chaptersMeta, allSubsections } from './data/chapters';
import { ChapterId } from './types/physics';
import { LabRouter } from './labs/LabRouter';
import { ConceptNotes } from './components/ConceptNotes';
import { PracticeSection } from './components/PracticeSection';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { DashboardHome } from './components/DashboardHome';
import { RichMathText } from './components/MathTex';

type ActiveTab = 'lab' | 'notes' | 'practice';

const STORAGE_VISITED = 'phys12_visited_v1';
const STORAGE_SOLVED = 'phys12_solved_v1';
const STORAGE_THEME = 'phys12_dark_v1';

const chapterIcon = (id: ChapterId) => {
  if (id === 1) return Gauge;
  if (id === 2) return Scale;
  if (id === 3) return Waves;
  return Atom;
};

const chapterAccentBadge: Record<ChapterId, string> = {
  1: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  2: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  3: 'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  4: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
};

const chapterIconColor: Record<ChapterId, string> = {
  1: 'text-cyan-500',
  2: 'text-emerald-500',
  3: 'text-violet-500',
  4: 'text-amber-500',
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null); // null = Home dashboard
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME) === '1';
    } catch {
      return false;
    }
  });

  const [visitedIds, setVisitedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_VISITED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SOLVED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem(STORAGE_THEME, dark ? '1' : '0');
    } catch {}
  }, [dark]);

  const handleSelectSubsection = (id: string) => {
    setSelectedId(id);
    setActiveTab('lab');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisitedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_VISITED, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMarkSolved = (questionId: string) => {
    setSolvedIds((prev) => {
      if (prev.includes(questionId)) return prev;
      const next = [...prev, questionId];
      try {
        localStorage.setItem(STORAGE_SOLVED, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const currentIdx = useMemo(
    () => (selectedId ? allSubsections.findIndex((s) => s.id === selectedId) : -1),
    [selectedId]
  );
  const currentSubsection = currentIdx >= 0 ? allSubsections[currentIdx] : null;
  const currentChapter = currentSubsection
    ? chaptersMeta.find((c) => c.id === currentSubsection.chapterId)
    : null;

  const prevSubsection = currentIdx > 0 ? allSubsections[currentIdx - 1] : null;
  const nextSubsection =
    currentIdx >= 0 && currentIdx < allSubsections.length - 1 ? allSubsections[currentIdx + 1] : null;

  const filteredBySearch = (chapterId: ChapterId) => {
    const q = searchTerm.trim().toLowerCase();
    return allSubsections.filter((s) => {
      if (s.chapterId !== chapterId) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.numberFa.includes(q) ||
        s.id.includes(q)
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
        <div className="h-full max-w-[1600px] mx-auto px-3 sm:px-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="فهرست فصل‌ها"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setSidebarOpen(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer text-right"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-sm">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm sm:text-base font-black tracking-tight">
                  فیزیک ۱۲ تعاملی
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                  آزمایشگاه کنکور علوم تجربی
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedId === null
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Home className="w-4 h-4" />
              داشبورد
            </button>

            <button
              type="button"
              onClick={() => setFormulaModalOpen(true)}
              title="فرمول‌نامه جامع فیزیک دوازدهم"
              aria-label="فرمول‌نامه جامع فیزیک دوازدهم"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800 cursor-pointer"
            >
              <Sigma className="w-4 h-4" />
              <span>فرمول‌نامه</span>
            </button>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="تغییر تم روشن و تاریک"
            >
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto flex relative">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Right Sidebar (RTL Navigation Tree for all 4 Chapters & 21 Subsections) */}
        <aside
          className={`fixed lg:sticky top-16 right-0 z-40 h-[calc(100vh-4rem)] w-80 shrink-0 border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-200 ${
            sidebarOpen
              ? 'translate-x-0 visible'
              : 'translate-x-full invisible pointer-events-none lg:visible lg:pointer-events-auto lg:translate-x-0'
          }`}
        >
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی مبحث (شتاب، اصطکاک، موج، بور)..."
                className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span>پیشرفت کل کتاب:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
                {visitedIds.length} / {allSubsections.length}
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {chaptersMeta.map((ch) => {
              const Icon = chapterIcon(ch.id);
              const items = filteredBySearch(ch.id);
              const isOpen = expandedChapters[ch.id] || searchTerm.trim().length > 0;
              if (searchTerm.trim() && items.length === 0) return null;

              return (
                <div key={ch.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedChapters((prev) => ({ ...prev, [ch.id]: !prev[ch.id] }))
                    }
                    className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${chapterIconColor[ch.id]}`} />
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">
                        فصل {ch.numberFa}: {ch.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pr-2 space-y-0.5">
                      {items.map((sub) => {
                        const active = selectedId === sub.id;
                        const visited = visitedIds.includes(sub.id);
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelectSubsection(sub.id)}
                            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-right text-xs transition-all cursor-pointer ${
                              active
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium'
                            }`}
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                  active
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {sub.numberFa}
                              </span>
                              <span className="truncate">{sub.title}</span>
                            </span>
                            {visited && (
                              <CheckCircle2
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  active ? 'text-emerald-200' : 'text-emerald-500'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {!currentSubsection || !currentChapter ? (
            <DashboardHome
              chapters={chaptersMeta}
              subsections={allSubsections}
              visitedIds={visitedIds}
              solvedQuestionIds={solvedIds}
              onSelectSubsection={handleSelectSubsection}
              onOpenFormulaSheet={() => setFormulaModalOpen(true)}
            />
          ) : (
            <div className="space-y-5 pb-12">
              {/* Subsection Header */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                        chapterAccentBadge[currentChapter.id]
                      }`}
                    >
                      فصل {currentChapter.numberFa}: {currentChapter.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      کتاب درسی: {currentSubsection.bookPages}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                      اهمیت کنکور: {currentSubsection.konkoorWeight}
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {currentSubsection.numberFa} — {currentSubsection.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <RichMathText text={currentSubsection.subtitle} />
                  </p>
                </div>

                {/* 3-Mode Learning Stepper Tabs */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {(
                    [
                      { id: 'lab', label: '۱. آزمایشگاه و فرمول زنده', icon: FlaskConical },
                      { id: 'notes', label: '۲. درسنامه و نکات کنکوری', icon: BookOpen },
                      {
                        id: 'practice',
                        label: `۳. تست و مسئله (${
                          currentSubsection.questions.filter((q) => solvedIds.includes(q.id)).length
                        }/${currentSubsection.questions.length})`,
                        icon: PenTool,
                      },
                    ] as const
                  ).map((t) => {
                    const TabIcon = t.icon;
                    const active = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        <TabIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Tab Panel */}
              {activeTab === 'lab' && <LabRouter subsectionId={currentSubsection.id} />}
              {activeTab === 'notes' && <ConceptNotes subsection={currentSubsection} />}
              {activeTab === 'practice' && (
                <PracticeSection
                  subsectionId={currentSubsection.id}
                  questions={currentSubsection.questions}
                  hasDynamicGenerator={currentSubsection.hasDynamicGenerator}
                  solvedIds={solvedIds}
                  onMarkSolved={handleMarkSolved}
                />
              )}

              {/* Bottom Prev / Next Subsection Footer */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {prevSubsection ? (
                  <button
                    type="button"
                    onClick={() => handleSelectSubsection(prevSubsection.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-400 text-right cursor-pointer transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">زیربخش قبلی</div>
                      <div className="text-xs sm:text-sm font-bold">
                        {prevSubsection.numberFa} {prevSubsection.title}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {nextSubsection ? (
                  <button
                    type="button"
                    onClick={() => handleSelectSubsection(nextSubsection.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-left cursor-pointer transition-all shadow-sm"
                  >
                    <div>
                      <div className="text-[10px] text-indigo-200">زیربخش بعدی</div>
                      <div className="text-xs sm:text-sm font-bold">
                        {nextSubsection.numberFa} {nextSubsection.title}
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <FormulaSheetModal
        open={formulaModalOpen}
        onClose={() => setFormulaModalOpen(false)}
        subsections={allSubsections}
        onJumpToSubsection={handleSelectSubsection}
      />
    </div>
  );
}
