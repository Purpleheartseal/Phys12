import React, { useState, useEffect } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
  formatSci,
  formatSciPlain,
} from '../components/LabUI';

function wavelengthToHex(nm: number): string {
  if (nm < 380) return '#a855f7'; // UV represented in bright violet
  if (nm < 440) return '#7c3aed';
  if (nm < 490) return '#2563eb';
  if (nm < 510) return '#06b6d4';
  if (nm < 580) return '#22c55e';
  if (nm < 610) return '#eab308';
  if (nm < 645) return '#f97316';
  if (nm <= 750) return '#ef4444';
  return '#991b1b'; // IR represented in deep crimson
}

/* =========================================================
   LAB 4-1: Photoelectric Effect & Photons (E = hf = 1240/λ)
   ========================================================= */
const targetMetals = [
  { id: 'cs', name: 'سزیم (Cs)', phiEv: 2.1 },
  { id: 'na', name: 'سدیم (Na)', phiEv: 2.3 },
  { id: 'zn', name: 'روی (Zn)', phiEv: 4.3 },
  { id: 'w', name: 'تنگستن (W)', phiEv: 4.5 },
] as const;

export const Lab4_1: React.FC = () => {
  const [metalId, setMetalId] = useState<'cs' | 'na' | 'zn' | 'w'>('zn');
  const [lambdaNm, setLambdaNm] = useState(250); // nm
  const [powerW, setPowerW] = useState(50); // W
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 4) % 100), 40);
    return () => window.clearInterval(id);
  }, []);

  const metal = targetMetals.find((m) => m.id === metalId) ?? targetMetals[2];
  const ePhotonEv = 1240 / lambdaNm;
  const ePhotonJ = ePhotonEv * 1.6e-19;
  const freqHz = 3e8 / (lambdaNm * 1e-9);
  const lambda0Nm = 1240 / metal.phiEv;
  const emitted = ePhotonEv >= metal.phiEv;
  const photonsPerSec = powerW / ePhotonJ;
  const beamColor = wavelengthToHex(lambdaNm);
  const numPhotonsVis = Math.max(2, Math.min(7, Math.round(powerW / 14)));

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={metalId}
              onChange={setMetalId}
              options={targetMetals.map((m) => ({ value: m.id, label: m.name }))}
            />
          </div>

          <svg viewBox="0 0 460 210" className="w-full h-auto max-h-[230px]">
            <rect x="14" y="12" width="432" height="186" rx="14" fill="#0f172a" />

            {/* Light Source on top-left */}
            <g transform="translate(55, 50) rotate(28)">
              <rect x="-24" y="-14" width="44" height="28" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="20" cy="0" rx="5" ry="12" fill={beamColor} />
            </g>

            {/* Metal Target Plate */}
            <rect x="175" y="138" width="135" height="22" rx="5" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="2" />
            <text x="242" y="153" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">
              فلز {metal.name} (آستانه {metal.phiEv} eV)
            </text>

            {/* Animated Photon packets moving from lamp to plate */}
            {Array.from({ length: numPhotonsVis }, (_, i) => {
              const p = ((tick + i * (100 / numPhotonsVis)) % 100) / 100;
              const px = 78 + p * 145;
              const py = 62 + p * 74;
              return (
                <g key={`ph-${i}`}>
                  <circle cx={px} cy={py} r="6" fill={beamColor} />
                  <circle cx={px} cy={py} r="10" fill={beamColor} fillOpacity="0.28" />
                </g>
              );
            })}

            {/* Photoelectrons streaming out ONLY if E >= threshold */}
            {emitted &&
              Array.from({ length: numPhotonsVis }, (_, i) => {
                const p = ((tick + i * (100 / numPhotonsVis)) % 100) / 100;
                const ex = 235 + p * 165;
                const ey = 136 - p * 82 + (i % 3 - 1) * 10;
                return (
                  <g key={`el-${i}`}>
                    <circle cx={ex} cy={ey} r="7" fill="#38bdf8" stroke="#fff" strokeWidth="1.2" />
                    <text x={ex} y={ey + 3} textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#0f172a">e⁻</text>
                  </g>
                );
              })}

            <text x="230" y="34" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={emitted ? '#34d399' : '#f87171'}>
              {emitted
                ? `فوتوالکتریک رخ داد! (E = ${ePhotonEv.toFixed(2)} eV ≥ ${metal.phiEv} eV) ← افزایش توان فقط تعداد e⁻ را زیاد می‌کند`
                : `فوتوالکتریک رخ نمی‌دهد! (E = ${ePhotonEv.toFixed(2)} eV < ${metal.phiEv} eV) — حتی با توان ${powerW} W!`}
            </text>

            <text x="230" y="186" textAnchor="middle" fontSize="10" fontWeight="700" fill="#cbd5e1">
              طول‌موج آستانه برای {metal.name}: λ₀ ≈ {lambda0Nm.toFixed(0)} nm | نور تابشی: λ = {lambdaNm} nm ({lambdaNm < 380 ? 'فرابنفش' : lambdaNm <= 700 ? 'مرئی' : 'فروسرخ'})
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="E = hf = \frac{hc}{\lambda} \approx \frac{1240\;\text{eV}\cdot\text{nm}}{\lambda(\text{nm})}, \qquad \frac{N}{t} = \frac{P}{E}"
          substitutedTex={`E = \\frac{1240}{${lambdaNm}} = ${ePhotonEv.toFixed(2)}\\;\\text{eV}, \\qquad \\frac{N}{t} = ${formatSci(photonsPerSec, 2)}\\;\\text{فوتون/ثانیه}`}
          symbols={[
            { symbol: 'E', meaning: 'انرژی هر فوتون', unit: 'eV یا J' },
            { symbol: 'h', meaning: 'ثابت پلانک ($6.63\\times 10^{-34}\\;\\text{J}\\cdot\\text{s}$)', unit: 'J·s' },
            { symbol: 'hc', meaning: 'ثابت پرکاربرد کتاب ($1240\\;\\text{eV}\\cdot\\text{nm}$)', unit: 'eV·nm' },
            { symbol: 'N/t', meaning: 'تعداد فوتون‌های گسیل‌شده در هر ثانیه', unit: 's⁻¹' },
          ]}
          insight="فلز روی (Zn) را انتخاب کرده و طول‌موج را روی نور مرئی (550 nm) بگذارید؛ حالا توان چشمه را تا 100 W بالا ببرید — می‌بینید باز هم هیچ الکترونی خارج نمی‌شود! سپس طول‌موج را به فرابنفش (240 nm) کاهش دهید تا بلافاصله الکترون‌ها شلیک شوند!"
        />
      }
      controls={
        <>
          <SliderControl label="طول‌موج نور تابشی" symbol="\lambda" value={lambdaNm} min={160} max={760} step={10} unit="nm" accentClass="text-violet-600" onChange={setLambdaNm} />
          <SliderControl label="توان (شدت) چشمه نور" symbol="P" value={powerW} min={10} max={100} step={5} unit="W" accentClass="text-amber-500" onChange={setPowerW} />
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" onClick={() => setLambdaNm(240)} className="py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[11px] font-bold cursor-pointer">فرابنفش (240nm)</button>
            <button type="button" onClick={() => setLambdaNm(450)} className="py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold cursor-pointer">آبی (450nm)</button>
            <button type="button" onClick={() => setLambdaNm(650)} className="py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-bold cursor-pointer">قرمز (650nm)</button>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="انرژی هر فوتون (E)" value={ePhotonEv.toFixed(2)} unit="eV" sublabel={`بسامد f = ${formatSciPlain(freqHz, 2)} Hz`} color="amber" />
          <MetricCard label="شمار فوتون در ثانیه" value={formatSciPlain(photonsPerSec, 2)} unit="s⁻¹" sublabel={emitted ? 'فوتوالکتریک فعال' : 'زیر آستانه (خاموش)'} color={emitted ? 'emerald' : 'rose'} />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 4-2: Hydrogen Line Spectrum & Rydberg Series Explorer
   ========================================================= */
const seriesInfo = [
  { nPrime: 1, name: 'لیمان (n′=1)', region: 'فرابنفش (UV)' },
  { nPrime: 2, name: 'بالمر (n′=2)', region: 'مرئی و فرابنفش' },
  { nPrime: 3, name: 'پاشن (n′=3)', region: 'فروسرخ (IR)' },
  { nPrime: 4, name: 'براکت (n′=4)', region: 'فروسرخ (IR)' },
  { nPrime: 5, name: 'پفوند (n′=5)', region: 'فروسرخ (IR)' },
];

export const Lab4_2: React.FC = () => {
  const [nPrime, setNPrime] = useState(2);
  const [nUpper, setNUpper] = useState(3); // 99 represents infinity
  const [specMode, setSpecMode] = useState<'emission' | 'absorption'>('emission');

  const R = 0.0109737; // nm^-1
  const actualN = nUpper <= nPrime ? nPrime + 1 : nUpper;
  const invLam = R * (1 / (nPrime * nPrime) - (actualN >= 99 ? 0 : 1 / (actualN * actualN)));
  const lamNm = 1 / invLam;
  const lamMin = (nPrime * nPrime) / R;
  const lamMax = 1 / (R * (1 / (nPrime * nPrime) - 1 / ((nPrime + 1) * (nPrime + 1))));

  const balmerLines = [
    { n: 3, nm: 656.2, col: '#ef4444' },
    { n: 4, nm: 486.1, col: '#06b6d4' },
    { n: 5, nm: 434.0, col: '#3b82f6' },
    { n: 6, nm: 410.1, col: '#8b5cf6' },
  ];

  const currSeries = seriesInfo.find((s) => s.nPrime === nPrime)!;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex flex-wrap justify-center gap-2">
            <SegmentedButtons
              value={String(nPrime)}
              onChange={(v) => {
                const np = Number(v);
                setNPrime(np);
                if (nUpper <= np) setNUpper(np + 1);
              }}
              options={seriesInfo.map((s) => ({ value: String(s.nPrime), label: s.name }))}
            />
          </div>

          <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
            <defs>
              <linearGradient id="contSpec" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="22%" stopColor="#2563eb" />
                <stop offset="40%" stopColor="#06b6d4" />
                <stop offset="58%" stopColor="#22c55e" />
                <stop offset="76%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Visible Balmer Spectrum Strip (Emission vs Absorption — Figure 4-15) */}
            <text x="230" y="20" textAnchor="middle" fontSize="10.5" fontWeight="900" className="fill-slate-700 dark:fill-slate-200">
              {specMode === 'emission'
                ? 'طیف گسیلی خطی هیدروژن در ناحیه مرئی (رشته بالمر: خطوط روشن روی زمینه تاریک)'
                : 'طیف جذبی خطی هیدروژن (خطوط تاریک در دقیقاً همان طول‌موج‌های گسیلی!)'}
            </text>

            <rect
              x="30"
              y="32"
              width="400"
              height="62"
              rx="8"
              fill={specMode === 'emission' ? '#090d16' : 'url(#contSpec)'}
              stroke="#475569"
              strokeWidth="2"
            />

            {balmerLines.map((line) => {
              const lx = 30 + ((line.nm - 380) / (720 - 380)) * 400;
              const isSelected = nPrime === 2 && actualN === line.n;
              return (
                <g key={line.n}>
                  <line
                    x1={lx}
                    y1="34"
                    x2={lx}
                    y2="92"
                    stroke={specMode === 'emission' ? line.col : '#090d16'}
                    strokeWidth={isSelected ? 5 : 3}
                  />
                  <text x={lx} y="108" textAnchor="middle" fontSize="9.5" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                    {line.nm.toFixed(0)}nm
                  </text>
                </g>
              );
            })}

            {/* Current Series Range Visualization */}
            <rect x="30" y="124" width="400" height="68" rx="12" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
            <text x="230" y="144" textAnchor="middle" fontSize="11" fontWeight="900" fill="#d97706">
              رشته {currSeries.name} — ناحیه {currSeries.region}
            </text>
            <text x="230" y="164" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
              طول‌موج خط انتخابی (n = {actualN >= 99 ? '∞' : actualN}): λ = {lamNm.toFixed(1)} nm
            </text>
            <text x="230" y="182" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-500">
              کوتاه‌ترین (n=∞): {lamMin.toFixed(0)} nm  |  بلندترین (n={nPrime + 1}): {lamMax.toFixed(0)} nm
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\frac{1}{\lambda} = R\left(\frac{1}{n'^2} - \frac{1}{n^2}\right) \qquad (R \approx 0.011\;\text{nm}^{-1})"
          substitutedTex={`\\frac{1}{\\lambda} = 0.01097\\left(\\frac{1}{${nPrime}^2} - ${actualN >= 99 ? '0' : `\\frac{1}{${actualN}^2}`}\\right) \\;\\Longrightarrow\\; \\lambda = ${lamNm.toFixed(1)}\\;\\text{nm}`}
          symbols={[
            { symbol: "n'", meaning: 'شماره رشته (لیمان ۱، بالمر ۲، پاشن ۳، براکت ۴، پفوند ۵)', unit: 'عدد صحیح' },
            { symbol: 'n', meaning: 'شماره تراز بالاتر ($n > n\'$ تا $\\infty$)', unit: 'عدد صحیح' },
            { symbol: 'R', meaning: 'ثابت ریدبرگ ($0.01097 \\approx 0.011\\;\\text{nm}^{-1}$)', unit: 'nm⁻¹' },
          ]}
          insight="تغییر بین طیف گسیلی و جذبی نشان می‌دهد خطوط تاریک جذبی دقیقاً بر همان طول‌موج‌های روشن گسیلی (410, 434, 486, 656 nm) منطبق‌اند!"
        />
      }
      controls={
        <>
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">نوع طیف مرئی هیدروژن:</div>
            <SegmentedButtons
              value={specMode}
              onChange={setSpecMode}
              options={[
                { value: 'emission', label: 'طیف گسیلی (خطوط روشن)' },
                { value: 'absorption', label: 'طیف جذبی (خطوط تاریک)' },
              ]}
            />
          </div>
          <SliderControl
            label="شماره تراز بالاتر"
            symbol="n"
            value={actualN >= 99 ? 10 : actualN}
            min={nPrime + 1}
            max={10}
            step={1}
            displayValue={actualN >= 99 ? '∞ (حد رشته)' : String(actualN)}
            accentClass="text-amber-500"
            onChange={(v) => setNUpper(v)}
          />
          <div className="grid grid-cols-2 gap-1.5">
            <button type="button" onClick={() => setNUpper(nPrime + 1)} className="py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold cursor-pointer">بلندترین λ (خط اول)</button>
            <button type="button" onClick={() => setNUpper(99)} className="py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[11px] font-bold cursor-pointer">کوتاه‌ترین λ (n = ∞)</button>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="طول‌موج فعلی (λ)" value={lamNm.toFixed(1)} unit="nm" sublabel={currSeries.region} color="amber" />
          <MetricCard label="گستره طول‌موج رشته" value={`${(lamMax - lamMin).toFixed(0)}`} unit="nm" sublabel="λ_max − λ_min" color="violet" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 4-3: Bohr Model Energy Levels & Rutherford Scattering
   ========================================================= */
export const Lab4_3: React.FC = () => {
  const [mode, setMode] = useState<'bohr' | 'rutherford'>('bohr');
  const [nInit, setNInit] = useState(3);
  const [nFinal, setNFinal] = useState(2);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setAngle((a) => (a + 5) % 360), 40);
    return () => window.clearInterval(id);
  }, []);

  const eOf = (n: number) => -13.6 / (n * n);
  const eInit = eOf(nInit);
  const eFinal = eOf(nFinal);
  const isEmission = nInit > nFinal;
  const isSame = nInit === nFinal;
  const dE = Math.abs(eInit - eFinal);
  const lamNm = dE > 0 ? 1240 / dE : 0;
  const maxLines = (nInit * (nInit - 1)) / 2;
  const photonCol = dE > 0 ? wavelengthToHex(lamNm) : '#94a3b8';

  const levelY: Record<number, number> = { 1: 185, 2: 112, 3: 78, 4: 58, 5: 44 };

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'bohr', label: 'مدارها و ترازهای بور' },
                { value: 'rutherford', label: 'آزمایش رادرفورد (ذره α)' },
              ]}
            />
          </div>

          {mode === 'bohr' ? (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {/* Left: Bohr Orbits */}
              <g transform="translate(115, 110)">
                {[1, 2, 3, 4, 5].map((n) => {
                  const r = 16 + (n - 1) * 18;
                  const active = n === nInit || n === nFinal;
                  return (
                    <circle
                      key={n}
                      cx="0"
                      cy="0"
                      r={r}
                      fill="none"
                      stroke={n === nFinal ? '#10b981' : n === nInit ? '#f59e0b' : '#94a3b8'}
                      strokeWidth={active ? 2.5 : 1.2}
                      strokeDasharray={active ? undefined : '3 3'}
                    />
                  );
                })}
                {/* Nucleus */}
                <circle cx="0" cy="0" r="8" fill="#ef4444" />
                <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">+</text>

                {/* Orbiting Electron on nFinal */}
                {(() => {
                  const r = 16 + (nFinal - 1) * 18;
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <circle cx={r * Math.cos(rad)} cy={r * Math.sin(rad)} r="5.5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />
                  );
                })()}
              </g>
              <text x="115" y="206" textAnchor="middle" fontSize="9.5" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                شعاع‌ها: rₙ = a₀ n² (r₁:r₂:r₃ = 1:4:9)
              </text>

              {/* Right: Energy Level Ladder */}
              <rect x="235" y="14" width="212" height="190" rx="12" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
              <line x1="252" y1="28" x2="388" y2="28" stroke="#94a3b8" strokeDasharray="3 3" />
              <text x="394" y="31" fontSize="8.5" fontWeight="700" className="fill-slate-500">0 eV (n=∞)</text>

              {[1, 2, 3, 4, 5].map((n) => (
                <g key={n}>
                  <line x1="252" y1={levelY[n]} x2="388" y2={levelY[n]} stroke={n === nInit ? '#f59e0b' : n === nFinal ? '#10b981' : '#64748b'} strokeWidth={n === nInit || n === nFinal ? 2.6 : 1.5} />
                  <text x="394" y={levelY[n] + 3} fontSize="8.5" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                    n={n} ({eOf(n).toFixed(2)})
                  </text>
                </g>
              ))}

              {/* Transition Arrow */}
              {!isSame && (
                <g>
                  <line x1="315" y1={levelY[nInit]} x2="315" y2={levelY[nFinal]} stroke={photonCol} strokeWidth="3.5" />
                  <polygon
                    points={
                      isEmission
                        ? `315,${levelY[nFinal]} 309,${levelY[nFinal] - 9} 321,${levelY[nFinal] - 9}`
                        : `315,${levelY[nFinal]} 309,${levelY[nFinal] + 9} 321,${levelY[nFinal] + 9}`
                    }
                    fill={photonCol}
                  />
                  <text x="278" y={(levelY[nInit] + levelY[nFinal]) / 2 - 2} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={photonCol}>
                    {isEmission ? 'گسیل فوتون' : 'جذب فوتون'}
                  </text>
                  <text x="278" y={(levelY[nInit] + levelY[nFinal]) / 2 + 11} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={photonCol}>
                    {dE.toFixed(2)} eV
                  </text>
                </g>
              )}
            </svg>
          ) : (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              <rect x="14" y="12" width="432" height="190" rx="14" fill="#0f172a" />
              {/* Gold nucleus */}
              <circle cx="265" cy="108" r="14" fill="#f59e0b" stroke="#fde68a" strokeWidth="2.5" />
              <text x="265" y="112" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">Au+</text>
              {/* Alpha particle trajectories */}
              {/* 1. Far top: straight through */}
              <line x1="40" y1="45" x2="415" y2="45" stroke="#38bdf8" strokeWidth="2.5" />
              {/* 2. Far bottom: straight through */}
              <line x1="40" y1="172" x2="415" y2="172" stroke="#38bdf8" strokeWidth="2.5" />
              {/* 3. Near nucleus: deflected strongly */}
              <path d="M 40 84 Q 250 84 355 32" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
              <path d="M 40 132 Q 250 132 355 184" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
              {/* 4. Head-on: bounces back! */}
              <path d="M 40 108 L 222 108 Q 232 108 222 102 L 60 98" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5 3" />

              <text x="230" y="27" textAnchor="middle" fontSize="10" fontWeight="900" fill="#bae6fd">
                بیشتر ذرات α مستقیم عبور می‌کنند (فضای خالی اتم)
              </text>
              <text x="230" y="41" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fde68a">
                تعداد بسیار کمی شدید منحرف یا برمی‌گردند ← وجود هسته کوچک و چگال!
              </text>
              <text x="230" y="196" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#cbd5e1">
                آزمایش رادرفورد (۱۹۱۱): رد مدل کیک کشمشی تامسون و کشف هسته اتم
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\begin{aligned} r_n &= a_0 n^2, \qquad E_n = -\frac{13.6\;\text{eV}}{n^2} \\ |E_U - E_L| &= hf = \frac{1240}{\lambda(\text{nm})} \end{aligned}"
          substitutedTex={
            isSame
              ? `n = ${nInit} \\;(\\text{مدار مانا: بدون تابش!}) \\;\\Rightarrow\\; r_${nInit} = ${nInit * nInit} a_0,\\; E_${nInit} = ${eInit.toFixed(2)}\\;\\text{eV}`
              : `\\Delta E = |${eInit.toFixed(2)} - (${eFinal.toFixed(2)})| = ${dE.toFixed(2)}\\;\\text{eV} \\;\\Rightarrow\\; \\lambda = ${lamNm.toFixed(0)}\\;\\text{nm}`
          }
          symbols={[
            { symbol: 'a_0', meaning: 'شعاع مدار اول بور ($5.29\\times 10^{-11}\\;\\text{m}$)', unit: 'm' },
            { symbol: 'E_n', meaning: 'انرژی الکترون در تراز $n$ ($n=1$: پایه، $n=2$: اولین برانگیخته)', unit: 'eV' },
            { symbol: 'E_U - E_L', meaning: 'انرژی فوتون گسیل‌شده (یا جذب‌شده)', unit: 'eV' },
          ]}
          insight="گذار 3 → 2 (خط قرمز بالمر، 656 nm) و گذار 3 → 1 (دومین حالت برانگیخته به پایه، مثال ۴-۴ کتاب، 102 nm فرابنفش) را مقایسه کنید!"
        />
      }
      controls={
        <>
          <SliderControl label="تراز اولیه (شروع)" symbol="n_i" value={nInit} min={1} max={5} step={1} accentClass="text-amber-500" onChange={setNInit} />
          <SliderControl label="تراز نهایی (پایان)" symbol="n_f" value={nFinal} min={1} max={5} step={1} accentClass="text-emerald-600" onChange={setNFinal} />
          <div className="grid grid-cols-2 gap-1.5">
            <button type="button" onClick={() => { setMode('bohr'); setNInit(3); setNFinal(1); }} className="py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold cursor-pointer">مثال ۴-۴ (3 → 1)</button>
            <button type="button" onClick={() => { setMode('bohr'); setNInit(3); setNFinal(2); }} className="py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-bold cursor-pointer">قرمز بالمر (3 → 2)</button>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard
            label={isSame ? 'حالت مانا' : isEmission ? 'فوتون گسیل‌شده' : 'فوتون جذب‌شده'}
            value={isSame ? 'بدون تابش' : `${dE.toFixed(2)} eV`}
            sublabel={isSame ? `r = ${nInit * nInit}a₀` : `λ = ${lamNm.toFixed(0)} nm`}
            color={isSame ? 'indigo' : isEmission ? 'amber' : 'cyan'}
          />
          <MetricCard
            label="حداکثر خطوط از nᵢ به پایه"
            value={String(maxLines)}
            unit="خط"
            sublabel="فرمول n(n−1)/2"
            color="emerald"
          />
        </>
      }
    />
  );
};
