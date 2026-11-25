import React, { useState, useEffect } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
} from '../components/LabUI';

/* =========================================================
   LAB 3-1: Periodic Oscillation & ECG Heartbeat Monitor
   ========================================================= */
export const Lab3_1: React.FC = () => {
  const [waveType, setWaveType] = useState<'ecg' | 'sine' | 'triangle'>('ecg');
  const [bpm, setBpm] = useState(65); // beats per minute (Figure 3-2: 65 bpm -> T = 0.92s!)
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 0.03) % 10), 40);
    return () => window.clearInterval(id);
  }, []);

  const freq = bpm / 60;
  const period = 1 / freq;

  const evalWave = (u: number) => {
    const frac = ((u % 1) + 1) % 1;
    if (waveType === 'sine') return Math.sin(2 * Math.PI * frac);
    if (waveType === 'triangle') return frac < 0.25 ? frac * 4 : frac < 0.75 ? 2 - frac * 4 : frac * 4 - 4;
    // Realistic ECG P-QRS-T waveform
    if (frac > 0.1 && frac < 0.2) return 0.22 * Math.sin(((frac - 0.1) / 0.1) * Math.PI);
    if (frac >= 0.26 && frac < 0.30) return -0.25;
    if (frac >= 0.30 && frac < 0.34) return 1.15;
    if (frac >= 0.34 && frac < 0.38) return -0.35;
    if (frac >= 0.50 && frac < 0.66) return 0.32 * Math.sin(((frac - 0.50) / 0.16) * Math.PI);
    return 0;
  };

  const tSpan = 3.0; // 3 seconds window
  const pts = Array.from({ length: 180 }, (_, i) => {
    const tSec = (i / 179) * tSpan;
    const val = evalWave((tSec + phase * 0.4) / period);
    const x = 35 + (tSec / tSpan) * 395;
    const y = 115 - val * 58;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const tCyclePx = Math.min(390, (period / tSpan) * 395);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={waveType}
              onChange={setWaveType}
              options={[
                { value: 'ecg', label: 'نوار قلب (ECG)' },
                { value: 'sine', label: 'نوسان سینوسی' },
                { value: 'triangle', label: 'نوسان مثلثی' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 200" className="w-full h-auto max-h-[225px]">
            <rect x="20" y="16" width="420" height="168" rx="14" fill="#0f172a" />
            {/* Monitor grid */}
            {[50, 82, 115, 148].map((y) => (
              <line key={y} x1="30" y1={y} x2="430" y2={y} stroke="#1e293b" strokeWidth="1" />
            ))}
            {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((s) => {
              const x = 35 + (s / tSpan) * 395;
              return (
                <g key={s}>
                  <line x1={x} y1="24" x2={x} y2="165" stroke="#1e293b" strokeWidth="1" />
                  <text x={x} y="177" textAnchor="middle" fontSize="9" fill="#94a3b8">{s}s</text>
                </g>
              );
            })}

            {/* Waveform */}
            <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2.8" strokeLinejoin="round" />

            {/* One Period T bracket */}
            <line x1="60" y1="36" x2={60 + tCyclePx} y2="36" stroke="#f59e0b" strokeWidth="2" />
            <line x1="60" y1="31" x2="60" y2="41" stroke="#f59e0b" strokeWidth="2" />
            <line x1={60 + tCyclePx} y1="31" x2={60 + tCyclePx} y2="41" stroke="#f59e0b" strokeWidth="2" />
            <text x={60 + tCyclePx / 2} y="30" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#fbbf24">
              دوره تناوب T = {period.toFixed(2)} s
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="T = \frac{t}{N}, \qquad f = \frac{1}{T} = \frac{N}{t}"
          substitutedTex={`f = \\frac{${bpm}}{60\\;\\text{s}} = ${freq.toFixed(2)}\\;\\text{Hz}, \\qquad T = \\frac{1}{${freq.toFixed(2)}} = ${period.toFixed(2)}\\;\\text{s}`}
          symbols={[
            { symbol: 'T', meaning: 'دوره تناوب (مدت یک چرخه کامل)', unit: 's' },
            { symbol: 'f', meaning: 'بسامد یا فرکانس (تعداد چرخه در ثانیه)', unit: 'Hz' },
            { symbol: 'N, t', meaning: 'تعداد چرخه‌ها و مدت زمان کل', unit: 'عدد, s' },
          ]}
          insight="در شکل ۳-۲ کتاب، قلب با ۶۵ تپش در دقیقه دوره تناوب 0.92 ثانیه و بسامد 1.08 هرتز دارد. با افزایش ضربان (بسامد)، دوره تناوب T کوتاه‌تر می‌شود!"
        />
      }
      controls={
        <>
          <SliderControl label="تعداد نوسان (ضربان) در دقیقه" symbol="N/\\text{min}" value={bpm} min={30} max={180} step={5} unit="BPM" accentClass="text-violet-600" onChange={setBpm} />
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" onClick={() => setBpm(65)} className="py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[11px] font-bold cursor-pointer">کتاب (65 BPM)</button>
            <button type="button" onClick={() => setBpm(60)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">1 Hz (60)</button>
            <button type="button" onClick={() => setBpm(120)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">2 Hz (120)</button>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="دوره تناوب (T)" value={period.toFixed(2)} unit="s" color="amber" />
          <MetricCard label="بسامد (f)" value={freq.toFixed(2)} unit="Hz" color="violet" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-2: Simple Harmonic Motion (Mass-Spring + Live x(t)=A cos(wt))
   ========================================================= */
export const Lab3_2: React.FC = () => {
  const [m, setM] = useState(1.0); // kg
  const [k, setK] = useState(40); // N/m
  const [Acm, setAcm] = useState(8); // cm
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);

  const omega = Math.sqrt(k / m);
  const T = (2 * Math.PI) / omega;
  const f = 1 / T;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setT((prev) => Number(((prev + 0.03) % (3 * T)).toFixed(3)));
    }, 35);
    return () => window.clearInterval(id);
  }, [playing, T]);

  const A = Acm / 100;
  const x = A * Math.cos(omega * t);
  const xCm = x * 100;
  const acc = -omega * omega * x;

  const blockX = 230 + (xCm / 12) * 145;
  const curvePts = Array.from({ length: 120 }, (_, i) => {
    const tt = (i / 119) * 2.5 * T;
    const xx = Acm * Math.cos(omega * tt);
    const px = 42 + (i / 119) * 385;
    const py = 165 - (xx / 12) * 42;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');

  const currPlotT = t % (2.5 * T);
  const currPx = 42 + (currPlotT / (2.5 * T)) * 385;
  const currPy = 165 - (xCm / 12) * 42;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 230" className="w-full h-auto max-h-[250px]">
            {/* Wall & track */}
            <rect x="20" y="20" width="14" height="68" rx="3" fill="#475569" />
            <line x1="34" y1="84" x2="435" y2="84" stroke="#94a3b8" strokeWidth="2" />
            {/* Turning point guides -A, 0, +A */}
            <line x1={230 - (Acm / 12) * 145} y1="24" x2={230 - (Acm / 12) * 145} y2="94" stroke="#f59e0b" strokeDasharray="3 3" />
            <line x1="230" y1="20" x2="230" y2="94" stroke="#10b981" strokeDasharray="4 3" />
            <line x1={230 + (Acm / 12) * 145} y1="24" x2={230 + (Acm / 12) * 145} y2="94" stroke="#f59e0b" strokeDasharray="3 3" />
            <text x={230 - (Acm / 12) * 145} y="104" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#d97706">−A</text>
            <text x="230" y="104" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#059669">تعادل (0)</text>
            <text x={230 + (Acm / 12) * 145} y="104" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#d97706">+A</text>

            {/* Horizontal spring */}
            {(() => {
              const endX = blockX - 24;
              const coils = 10;
              const pts = ['34,56'];
              for (let i = 1; i <= coils; i++) {
                const px = 34 + ((endX - 34) * i) / (coils + 1);
                const py = i % 2 === 0 ? 42 : 70;
                pts.push(`${px.toFixed(1)},${py}`);
              }
              pts.push(`${endX.toFixed(1)},56`);
              return <polyline points={pts.join(' ')} fill="none" stroke="#7c3aed" strokeWidth="2.8" strokeLinejoin="round" />;
            })()}

            {/* Oscillating Mass */}
            <rect x={blockX - 24} y="32" width="48" height="48" rx="10" fill="#6366f1" stroke="#312e81" strokeWidth="2" />
            <text x={blockX} y="60" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="white">
              {m.toFixed(1)}kg
            </text>

            {/* x(t) cosine plot */}
            <line x1="42" y1="165" x2="432" y2="165" stroke="#64748b" strokeWidth="1.5" />
            <line x1="42" y1="118" x2="42" y2="212" stroke="#64748b" strokeWidth="1.5" />
            <text x="26" y="128" fontSize="9.5" fontWeight="800" className="fill-slate-500">+A</text>
            <text x="26" y="208" fontSize="9.5" fontWeight="800" className="fill-slate-500">−A</text>
            <polyline points={curvePts} fill="none" stroke="#7c3aed" strokeWidth="2.8" />
            <circle cx={currPx} cy={currPy} r="5.5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <text x="230" y="224" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
              x({t.toFixed(2)}s) = {xCm.toFixed(1)} cm | کل طول مسیر نوسان 2A = {2 * Acm} cm
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="x(t) = A\cos(\omega t), \qquad T = 2\pi\sqrt{\frac{m}{k}}, \qquad \omega = \sqrt{\frac{k}{m}}"
          substitutedTex={`x(t) = ${Acm}\\cos(${omega.toFixed(2)}t)\\;\\text{cm}, \\quad T = 2\\pi\\sqrt{\\frac{${m}}{${k}}} = ${T.toFixed(2)}\\;\\text{s}`}
          symbols={[
            { symbol: 'A', meaning: 'دامنه نوسان (تغییر آن اثری روی $T$ ندارد!)', unit: 'm یا cm' },
            { symbol: '\\omega', meaning: 'بسامد زاویه‌ای ($2\\pi/T = 2\\pi f$)', unit: 'rad/s' },
            { symbol: 'm, k', meaning: 'جرم وزنه و ثابت فنر', unit: 'kg, N/m' },
          ]}
          insight="اسلایدر دامنه A را از 2 cm تا 12 cm تغییر دهید: مشاهده می‌کنید که دوره تناوب T و بسامد ω مطلقاً تغییری نمی‌کنند!"
        />
      }
      controls={
        <>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold cursor-pointer"
            >
              {playing ? 'توقف نوسان' : 'پخش نوسان'}
            </button>
            <button
              type="button"
              onClick={() => { setPlaying(false); setT(0); }}
              className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer"
            >
              t=0 (+A)
            </button>
            <button
              type="button"
              onClick={() => { setPlaying(false); setT(T / 4); }}
              className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer"
            >
              T/4 (0)
            </button>
            <button
              type="button"
              onClick={() => { setPlaying(false); setT(T / 2); }}
              className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer"
            >
              T/2 (−A)
            </button>
          </div>
          <SliderControl label="جرم وزنه" symbol="m" value={m} min={0.2} max={4.0} step={0.2} unit="kg" accentClass="text-indigo-600" onChange={setM} />
          <SliderControl label="ثابت فنر" symbol="k" value={k} min={10} max={160} step={5} unit="N/m" accentClass="text-violet-600" onChange={setK} />
          <SliderControl label="دامنه نوسان (مستقل از T!)" symbol="A" value={Acm} min={2} max={12} step={1} unit="cm" accentClass="text-amber-500" onChange={setAcm} />
        </>
      }
      metrics={
        <>
          <MetricCard label="دوره تناوب (T)" value={T.toFixed(2)} unit="s" sublabel={`بسامد f = ${f.toFixed(2)} Hz`} color="violet" />
          <MetricCard label="شتاب لحظه‌ای (a)" value={acc.toFixed(2)} unit="m/s²" sublabel={`ω = ${omega.toFixed(2)} rad/s`} color="cyan" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-3: Energy in SHM & Simple Pendulum
   ========================================================= */
export const Lab3_3: React.FC = () => {
  const [mode, setMode] = useState<'energy' | 'pendulum'>('energy');

  // Energy mode
  const [k, setK] = useState(100); // N/m
  const [m, setM] = useState(1.0); // kg
  const [Acm, setAcm] = useState(10); // cm
  const [xFrac, setXFrac] = useState(0.5); // -1 .. +1 of A

  // Pendulum mode
  const [L, setL] = useState(1.0); // m
  const [g, setG] = useState(9.8); // m/s^2
  const [mPend, setMPend] = useState(0.5); // kg (independent!)
  const [thetaPhase, setThetaPhase] = useState(0);

  useEffect(() => {
    if (mode !== 'pendulum') return;
    const omegaP = Math.sqrt(g / L);
    const id = window.setInterval(() => {
      setThetaPhase((p) => p + omegaP * 0.04);
    }, 35);
    return () => window.clearInterval(id);
  }, [mode, g, L]);

  const A = Acm / 100;
  const E = 0.5 * k * A * A;
  const x = xFrac * A;
  const U = 0.5 * k * x * x;
  const K = Math.max(0, E - U);
  const vMax = A * Math.sqrt(k / m);
  const vCurr = Math.sqrt((2 * K) / m);

  const Tp = 2 * Math.PI * Math.sqrt(L / g);
  const swingAngleDeg = 18 * Math.cos(thetaPhase);

  // Energy curves K(x) and U(x)
  const uCurve = Array.from({ length: 41 }, (_, i) => {
    const f = -1 + (i / 40) * 2;
    const px = 65 + ((f + 1) / 2) * 250;
    const py = 180 - f * f * 125;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');
  const kCurve = Array.from({ length: 41 }, (_, i) => {
    const f = -1 + (i / 40) * 2;
    const px = 65 + ((f + 1) / 2) * 250;
    const py = 180 - (1 - f * f) * 125;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');

  const currEx = 65 + ((xFrac + 1) / 2) * 250;
  const currUy = 180 - xFrac * xFrac * 125;
  const currKy = 180 - (1 - xFrac * xFrac) * 125;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'energy', label: 'تبدیل انرژی K و U (شکل ۳-۷)' },
                { value: 'pendulum', label: 'آونگ ساده (T = 2π√L/g)' },
              ]}
            />
          </div>

          {mode === 'energy' ? (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {/* Axes */}
              <line x1="55" y1="180" x2="330" y2="180" stroke="#64748b" strokeWidth="1.8" />
              <line x1="190" y1="184" x2="190" y2="35" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Total Energy E horizontal line */}
              <line x1="65" y1="55" x2="315" y2="55" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="6 3" />
              <text x="190" y="45" textAnchor="middle" fontSize="10" fontWeight="900" fill="#4f46e5">
                انرژی مکانیکی کل E = K + U = {E.toFixed(3)} J (ثابت!)
              </text>

              {/* U(x) and K(x) parabolas */}
              <polyline points={uCurve} fill="none" stroke="#f59e0b" strokeWidth="3" />
              <polyline points={kCurve} fill="none" stroke="#10b981" strokeWidth="3" />
              <text x="82" y="75" fontSize="10" fontWeight="900" fill="#d97706">U پتانسیل</text>
              <text x="190" y="75" textAnchor="middle" fontSize="10" fontWeight="900" fill="#059669">K جنبشی</text>

              {/* Current x vertical */}
              <line x1={currEx} y1="55" x2={currEx} y2="180" stroke="#94a3b8" strokeDasharray="2 2" />
              <circle cx={currEx} cy={currUy} r="5.5" fill="#f59e0b" stroke="#fff" strokeWidth="1.8" />
              <circle cx={currEx} cy={currKy} r="5.5" fill="#10b981" stroke="#fff" strokeWidth="1.8" />

              <text x="65" y="197" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-500">−A</text>
              <text x="190" y="197" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-500">0 (تعادل)</text>
              <text x="315" y="197" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-500">+A</text>

              {/* Live stacked bar on right */}
              <g transform="translate(362, 55)">
                <rect x="0" y="0" width="54" height="125" rx="8" className="fill-slate-200 dark:fill-slate-800" />
                <rect x="0" y={125 - (U / (E || 1)) * 125} width="54" height={(U / (E || 1)) * 125} fill="#f59e0b" rx="4" />
                <rect x="0" y="0" width="54" height={(K / (E || 1)) * 125} fill="#10b981" rx="4" />
                <text x="27" y="-8" textAnchor="middle" fontSize="9.5" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                  سهم انرژی
                </text>
                <text x="27" y="142" textAnchor="middle" fontSize="9" fontWeight="800" fill="#059669">
                  K={Math.round((K / (E || 1)) * 100)}%
                </text>
                <text x="27" y="155" textAnchor="middle" fontSize="9" fontWeight="800" fill="#d97706">
                  U={Math.round((U / (E || 1)) * 100)}%
                </text>
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {/* Pivot */}
              <rect x="175" y="14" width="110" height="10" rx="4" fill="#475569" />
              <line x1="230" y1="24" x2="230" y2="195" stroke="#94a3b8" strokeDasharray="4 4" />
              {/* Swinging rod & bob */}
              {(() => {
                const lenPx = 55 + (L / 2.5) * 100;
                const rad = (swingAngleDeg * Math.PI) / 180;
                const bx = 230 + lenPx * Math.sin(rad);
                const by = 24 + lenPx * Math.cos(rad);
                return (
                  <g>
                    <line x1="230" y1="24" x2={bx} y2={by} stroke="#7c3aed" strokeWidth="3" />
                    <circle cx={bx} cy={by} r={10 + mPend * 5} fill="#6366f1" stroke="#fff" strokeWidth="2" />
                    <text x={bx} y={by + 4} textAnchor="middle" fontSize="9" fontWeight="900" fill="white">
                      {mPend}kg
                    </text>
                  </g>
                );
              })()}
              <text x="230" y="206" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                دوره تناوب آونگ ساده = {Tp.toFixed(2)} s (مستقل از جرم {mPend} kg و دامنه کوچک!)
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        mode === 'energy' ? (
          <LiveFormulaCard
            formulaTex="E = K + U = \frac{1}{2}kA^2 = \frac{1}{2}m v_{\max}^2, \qquad v_{\max} = A\omega"
            substitutedTex={`E = \\frac{1}{2}(${k})(${A.toFixed(2)})^2 = ${E.toFixed(3)}\\;\\text{J} \\;\\; | \\;\\; K = ${K.toFixed(3)}\\;\\text{J},\\; U = ${U.toFixed(3)}\\;\\text{J}`}
            symbols={[
              { symbol: 'E', meaning: 'انرژی مکانیکی کل (ثابت)', unit: 'J' },
              { symbol: 'K, U', meaning: 'انرژی جنبشی و پتانسیل کشسانی لحظه‌ای', unit: 'J' },
              { symbol: 'v_{\\max}', meaning: 'تندی بیشینه در نقطه تعادل ($x=0$)', unit: 'm/s' },
            ]}
            insight="دکمه «نقطه طلایی K = U» را بزنید تا ببینید دقیقاً در x = ±0.707 A انرژی‌ها ۵۰-۵۰ و تندی برابر 0.707 v_max است!"
          />
        ) : (
          <LiveFormulaCard
            formulaTex="T = 2\pi\sqrt{\frac{L}{g}}"
            substitutedTex={`T = 2\\pi\\sqrt{\\frac{${L.toFixed(2)}}{${g.toFixed(2)}}} = ${Tp.toFixed(2)}\\;\\text{s}`}
            symbols={[
              { symbol: 'T', meaning: 'دوره تناوب آونگ ساده', unit: 's' },
              { symbol: 'L', meaning: 'طول نخ آونگ', unit: 'm' },
              { symbol: 'g', meaning: 'شتاب گرانش محل (زمین، استوا، ماه، مریخ)', unit: 'm/s²' },
            ]}
            insight="جرم وزنه آونگ را عوض کنید: اندازه گوی تغییر می‌کند اما دوره تناوب T دقیقاً ثابت می‌ماند! اما با کم کردن g (مثلاً بردن ساعت به ماه) دوره زیاد شده و ساعت عقب می‌افتد."
          />
        )
      }
      controls={
        mode === 'energy' ? (
          <>
            <SliderControl label="مکان نسبی نوسانگر (x/A)" symbol="x/A" value={xFrac} min={-1} max={1} step={0.05} displayValue={`${xFrac.toFixed(2)} A`} accentClass="text-rose-500" onChange={setXFrac} />
            <div className="grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => setXFrac(0)} className="py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold cursor-pointer">تعادل (K بیشینه)</button>
              <button type="button" onClick={() => setXFrac(0.707)} className="py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[11px] font-bold cursor-pointer">K = U (0.71A)</button>
              <button type="button" onClick={() => setXFrac(1)} className="py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold cursor-pointer">بازگشت (U بیشینه)</button>
            </div>
            <SliderControl label="ثابت فنر" symbol="k" value={k} min={20} max={400} step={10} unit="N/m" accentClass="text-violet-600" onChange={setK} />
            <SliderControl label="دامنه" symbol="A" value={Acm} min={2} max={20} step={1} unit="cm" accentClass="text-amber-500" onChange={setAcm} />
            <SliderControl label="جرم" symbol="m" value={m} min={0.2} max={4} step={0.2} unit="kg" accentClass="text-cyan-600" onChange={setM} />
          </>
        ) : (
          <>
            <SliderControl label="طول آونگ" symbol="L" value={L} min={0.2} max={2.5} step={0.1} unit="m" accentClass="text-violet-600" onChange={setL} />
            <SliderControl label="شتاب گرانش" symbol="g" value={g} min={1.6} max={12} step={0.1} unit="m/s²" accentClass="text-emerald-600" onChange={setG} />
            <SliderControl label="جرم وزنه (بی‌اثر روی T!)" symbol="m" value={mPend} min={0.2} max={2.0} step={0.2} unit="kg" accentClass="text-slate-500" onChange={setMPend} />
            <div className="grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => setG(9.8)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">زمین (9.8)</button>
              <button type="button" onClick={() => setG(3.7)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">مریخ (3.7)</button>
              <button type="button" onClick={() => setG(1.6)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">ماه (1.6)</button>
            </div>
          </>
        )
      }
      metrics={
        mode === 'energy' ? (
          <>
            <MetricCard label="تندی لحظه‌ای (v)" value={vCurr.toFixed(2)} unit="m/s" sublabel={`بیشینه v_max = ${vMax.toFixed(2)} m/s`} color="emerald" />
            <MetricCard label="انرژی کل (E)" value={E.toFixed(3)} unit="J" sublabel={`K=${K.toFixed(3)}, U=${U.toFixed(3)}`} color="violet" />
          </>
        ) : (
          <>
            <MetricCard label="دوره تناوب (T)" value={Tp.toFixed(2)} unit="s" color="violet" />
            <MetricCard label="بسامد طبیعی (f₀)" value={(1 / Tp).toFixed(2)} unit="Hz" color="emerald" />
          </>
        )
      }
    />
  );
};

/* =========================================================
   LAB 3-4: Barton's Pendulums & Resonance Curve
   ========================================================= */
export const Lab3_4: React.FC = () => {
  const [driverLen, setDriverLen] = useState(1.0); // m (controls driving frequency fd)
  const [damping, setDamping] = useState<'low' | 'mid' | 'high'>('low');
  const [tick, setTick] = useState(0);

  const g = 9.8;
  const fDriver = (1 / (2 * Math.PI)) * Math.sqrt(g / driverLen);
  const gamma = damping === 'low' ? 0.08 : damping === 'mid' ? 0.2 : 0.42;

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 0.08), 35);
    return () => window.clearInterval(id);
  }, []);

  const pendulums = [
    { id: 'A', L: 0.4 },
    { id: 'B', L: 0.7 },
    { id: 'C', L: 1.0 },
    { id: 'D', L: 1.4 },
    { id: 'E', L: 1.9 },
  ];

  const ampFor = (f0: number) => {
    const r = fDriver / f0;
    return 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * gamma * r, 2));
  };

  // Resonance response curve for pendulum C (f0C)
  const f0C = (1 / (2 * Math.PI)) * Math.sqrt(g / 1.0);
  const resCurve = Array.from({ length: 61 }, (_, i) => {
    const f = 0.2 + (i / 60) * 1.1;
    const r = f / f0C;
    const a = 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * gamma * r, 2));
    const px = 278 + ((f - 0.2) / 1.1) * 155;
    const py = 180 - Math.min(130, a * 20);
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
            {/* Left: Barton's pendulums bar */}
            <line x1="20" y1="26" x2="252" y2="26" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <text x="136" y="16" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
              آونگ‌های بارتون (فعالیت ۳-۳)
            </text>

            {/* Driver pendulum (heavy red) */}
            {(() => {
              const lenPx = 35 + driverLen * 62;
              const ang = 0.22 * Math.sin(tick * 2 * Math.PI * fDriver);
              const bx = 46 + lenPx * Math.sin(ang);
              const by = 26 + lenPx * Math.cos(ang);
              return (
                <g>
                  <line x1="46" y1="26" x2={bx} y2={by} stroke="#ef4444" strokeWidth="2.5" />
                  <circle cx={bx} cy={by} r="11" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                  <text x={bx} y={by + 3.5} textAnchor="middle" fontSize="8.5" fontWeight="900" fill="white">X</text>
                </g>
              );
            })()}

            {/* Driven pendulums A..E */}
            {pendulums.map((p, idx) => {
              const baseX = 90 + idx * 36;
              const f0 = (1 / (2 * Math.PI)) * Math.sqrt(g / p.L);
              const resp = ampFor(f0);
              const isRes = Math.abs(p.L - driverLen) < 0.16;
              const ang = Math.min(0.55, resp * 0.085) * Math.sin(tick * 2 * Math.PI * fDriver);
              const lenPx = 35 + p.L * 62;
              const bx = baseX + lenPx * Math.sin(ang);
              const by = 26 + lenPx * Math.cos(ang);
              return (
                <g key={p.id}>
                  <line x1={baseX} y1="26" x2={bx} y2={by} stroke={isRes ? '#f59e0b' : '#6366f1'} strokeWidth={isRes ? 3 : 1.8} />
                  <circle cx={bx} cy={by} r={isRes ? 9.5 : 7} fill={isRes ? '#f59e0b' : '#6366f1'} stroke="#fff" strokeWidth="1.5" />
                  <text x={baseX} y="205" textAnchor="middle" fontSize="9" fontWeight="800" fill={isRes ? '#d97706' : '#64748b'}>
                    {p.id} ({p.L}m)
                  </text>
                </g>
              );
            })}

            {/* Right: Resonance curve for C (L=1.0m) */}
            <rect x="262" y="16" width="186" height="186" rx="12" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
            <text x="355" y="34" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#7c3aed">
              منحنی تشدید آونگ C (L=1.0m)
            </text>
            <line x1="278" y1="180" x2="436" y2="180" stroke="#64748b" strokeWidth="1.5" />
            <line x1="278" y1="180" x2="278" y2="42" stroke="#64748b" strokeWidth="1.5" />
            <polyline points={resCurve} fill="none" stroke="#7c3aed" strokeWidth="2.8" />
            {/* Current fd dot */}
            {(() => {
              const cx = 278 + ((Math.max(0.2, Math.min(1.3, fDriver)) - 0.2) / 1.1) * 155;
              const cy = 180 - Math.min(130, ampFor(f0C) * 20);
              return <circle cx={cx} cy={cy} r="5.5" fill="#ef4444" stroke="#fff" strokeWidth="2" />;
            })()}
            <text x="355" y="196" textAnchor="middle" fontSize="9" className="fill-slate-500">بسامد وادارنده fd (Hz)</text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="f_d = f_0 = \frac{1}{2\pi}\sqrt{\frac{g}{L}} \quad \Longrightarrow \quad \text{تشدید (بیشینه دامنه)}"
          substitutedTex={`f_d = \\frac{1}{2\\pi}\\sqrt{\\frac{9.8}{${driverLen.toFixed(1)}}} = ${fDriver.toFixed(2)}\\;\\text{Hz} \\;\\; (L_X = ${driverLen.toFixed(1)}\\;\\text{m})`}
          symbols={[
            { symbol: 'f_d', meaning: 'بسامد نیروی وادارنده (آونگ سنگین X)', unit: 'Hz' },
            { symbol: 'f_0', meaning: 'بسامد طبیعی هر آونگ سبک', unit: 'Hz' },
            { symbol: 'L', meaning: 'طول آونگ (هم‌طول بودن $\\Rightarrow f_d = f_0$)', unit: 'm' },
          ]}
          insight="طول آونگ وادارنده X را روی 0.4، 0.7، 1.0، 1.4 یا 1.9 متر تنظیم کنید و ببینید هر بار دقیقاً کدام آونگ طلایی می‌شود و با دامنه عظیم به تشدید می‌افتد!"
        />
      }
      controls={
        <>
          <SliderControl label="طول آونگ وادارنده X" symbol="L_X" value={driverLen} min={0.4} max={1.9} step={0.1} unit="m" accentClass="text-rose-500" onChange={setDriverLen} />
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">میزان میرایی (مقاومت هوا):</div>
            <SegmentedButtons
              value={damping}
              onChange={setDamping}
              options={[
                { value: 'low', label: 'میرایی کم (قله تیز)' },
                { value: 'mid', label: 'میرایی متوسط' },
                { value: 'high', label: 'میرایی زیاد' },
              ]}
            />
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="بسامد وادارنده (fd)" value={fDriver.toFixed(2)} unit="Hz" color="rose" />
          <MetricCard
            label="آونگ در حالت تشدید"
            value={pendulums.reduce((best, p) => (Math.abs(p.L - driverLen) < Math.abs(best.L - driverLen) ? p : best)).id}
            sublabel="بیشترین دامنه نوسان!"
            color="amber"
          />
        </>
      }
    />
  );
};
