import React from 'react';
import { MathTex, RichMathText } from './MathTex';

interface SliderControlProps {
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  displayValue?: string;
  accentClass?: string;
  onChange: (val: number) => void;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  symbol,
  value,
  min,
  max,
  step = 1,
  unit = '',
  displayValue,
  accentClass = 'text-indigo-600 dark:text-indigo-400',
  onChange,
}) => {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min || 1)) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <span>{label}</span>
          {symbol && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <MathTex tex={symbol} />
            </span>
          )}
        </span>
        <span
          dir="ltr"
          className="font-mono text-xs sm:text-sm font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white"
        >
          {displayValue ?? `${Number.isInteger(step) ? value : value.toFixed(step < 0.1 ? 2 : 1)}`}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        dir="ltr"
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`phys-slider w-full ${accentClass}`}
        style={{
          background: `linear-gradient(to right, currentColor ${pct}%, rgba(148,163,184,0.3) ${pct}%)`,
        }}
      />
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  sublabel?: string;
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';
}

const colorMap = {
  indigo:
    'border-indigo-200/80 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
  cyan:
    'border-cyan-200/80 dark:border-cyan-500/30 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
  emerald:
    'border-emerald-200/80 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
  amber:
    'border-amber-200/80 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
  rose:
    'border-rose-200/80 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
  violet:
    'border-violet-200/80 dark:border-violet-500/30 bg-violet-50/70 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  sublabel,
  color = 'indigo',
}) => (
  <div className={`rounded-xl border p-3 transition-all ${colorMap[color]}`}>
    <div className="text-[11px] font-semibold opacity-85 mb-1">{label}</div>
    <div dir="ltr" className="font-mono text-base sm:text-lg font-extrabold tracking-tight flex items-baseline gap-1">
      <span>{value}</span>
      {unit && <span className="text-xs font-semibold opacity-80">{unit}</span>}
    </div>
    {sublabel && <div className="text-[11px] mt-1 opacity-80 leading-snug">{sublabel}</div>}
  </div>
);

export interface FormulaSymbolItem {
  symbol: string;
  meaning: string;
  unit?: string;
}

export const FormulaSymbolGrid: React.FC<{
  symbols: FormulaSymbolItem[];
  compact?: boolean;
  title?: string;
}> = ({ symbols, compact = false, title = 'هر نماد در این فرمول چیست؟' }) => {
  if (!symbols || symbols.length === 0) return null;
  return (
    <div className="space-y-1.5">
      {title && (
        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {title}
        </div>
      )}
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 gap-1.5' : 'sm:grid-cols-2 gap-2'}`}>
        {symbols.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 ${
              compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="shrink-0 min-w-[2rem] px-1.5 py-0.5 rounded-lg bg-indigo-100/90 dark:bg-indigo-950/80 border border-indigo-200/70 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-bold text-center">
                <MathTex tex={item.symbol} />
              </span>
              <span className="text-slate-700 dark:text-slate-200 font-medium leading-snug min-w-0 break-words">
                <RichMathText text={item.meaning} />
              </span>
            </div>
            {item.unit && (
              <span
                dir="ltr"
                className="shrink-0 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 mr-auto sm:mr-0"
              >
                {item.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface LiveFormulaCardProps {
  title?: string;
  formulaTex: string;
  substitutedTex?: string;
  symbols?: FormulaSymbolItem[];
  insight?: string;
}

export const LiveFormulaCard: React.FC<LiveFormulaCardProps> = ({
  title = 'فرمول زنده و جایگذاری عددی',
  formulaTex,
  substitutedTex,
  symbols,
  insight,
}) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 p-4 shadow-sm space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{title}</span>
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        به‌روزرسانی آنی
      </span>
    </div>
    <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 px-3 py-2.5 text-[13px] sm:text-sm">
      <MathTex tex={formulaTex} block />
      {substitutedTex && (
        <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-indigo-700 dark:text-indigo-300">
          <MathTex tex={substitutedTex} block />
        </div>
      )}
    </div>
    {symbols && symbols.length > 0 && <FormulaSymbolGrid symbols={symbols} />}
    {insight && (
      <div className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-500/30 rounded-lg px-3 py-2 leading-relaxed">
        <span className="font-bold text-amber-700 dark:text-amber-400">نکته تحلیلی: </span>
        <RichMathText text={insight} />
      </div>
    )}
  </div>
);

interface SegmentedButtonsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function SegmentedButtons<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedButtonsProps<T>) {
  return (
    <div
      className={`inline-flex flex-wrap gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 ${className}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              active
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export const LabShell: React.FC<{
  visual: React.ReactNode;
  controls: React.ReactNode;
  formula?: React.ReactNode;
  metrics?: React.ReactNode;
}> = ({ visual, controls, formula, metrics }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-7 space-y-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {visual}
        </div>
        {formula}
      </div>
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-4">
          {controls}
        </div>
        {metrics && <div className="grid grid-cols-2 gap-2.5">{metrics}</div>}
      </div>
    </div>
  </div>
);

export function formatSci(val: number, decimals = 2): string {
  if (!isFinite(val)) return '∞';
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs >= 0.01 && abs < 10000) {
    return Number(val.toFixed(decimals)).toString();
  }
  const exp = Math.floor(Math.log10(abs));
  const mant = val / Math.pow(10, exp);
  return `${mant.toFixed(decimals)} \\times 10^{${exp}}`;
}

export function formatSciPlain(val: number, decimals = 2): string {
  if (!isFinite(val)) return '∞';
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs >= 0.01 && abs < 10000) {
    return Number(val.toFixed(decimals)).toString();
  }
  const exp = Math.floor(Math.log10(abs));
  const mant = val / Math.pow(10, exp);
  return `${mant.toFixed(decimals)}×10^${exp}`;
}
