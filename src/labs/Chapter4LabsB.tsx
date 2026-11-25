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

/* =========================================================
   LAB 4-4: Laser Cavity, Population Inversion & Stimulated Emission
   ========================================================= */
export const Lab4_4: React.FC = () => {
  const [stage, setStage] = useState<'normal' | 'inversion' | 'stimulated' | 'cavity'>('stimulated');
  const [pInW, setPInW] = useState(50); // W
  const [pOutMw, setPOutMw] = useState(5); // mW (Problem 2 Ch4!)
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 3) % 100), 40);
    return () => window.clearInterval(id);
  }, []);

  const etaPct = ((pOutMw * 1e-3) / pInW) * 100;
  const eHeNeJ = (1240 / 633) * 1.6e-19;
  const photonsOutPerSec = (pOutMw * 1e-3) / eHeNeJ;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={stage}
              onChange={setStage}
              options={[
                { value: 'normal', label: '۱. وضعیت معمول' },
                { value: 'inversion', label: '۲. وارونی جمعیت' },
                { value: 'stimulated', label: '۳. گسیل القایی' },
                { value: 'cavity', label: '۴. لوله لیزر He-Ne' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
            <rect x="14" y="12" width="432" height="182" rx="14" fill="#0f172a" />

            {(stage === 'normal' || stage === 'inversion') && (
              <g>
                {/* Energy levels EU and EL */}
                <line x1="70" y1="68" x2="390" y2="68" stroke="#f59e0b" strokeWidth="3" />
                <line x1="70" y1="145" x2="390" y2="145" stroke="#38bdf8" strokeWidth="3" />
                <text x="52" y="72" textAnchor="end" fontSize="11" fontWeight="900" fill="#fbbf24">EU</text>
                <text x="52" y="149" textAnchor="end" fontSize="11" fontWeight="900" fill="#38bdf8">EL</text>

                {/* Electrons distributed according to normal vs population inversion */}
                {(stage === 'normal'
                  ? [
                      { x: 110, y: 145 }, { x: 155, y: 145 }, { x: 200, y: 145 }, { x: 245, y: 145 },
                      { x: 290, y: 145 }, { x: 335, y: 145 }, { x: 220, y: 68 },
                    ]
                  : [
                      { x: 105, y: 68 }, { x: 150, y: 68 }, { x: 195, y: 68 }, { x: 240, y: 68 },
                      { x: 285, y: 68 }, { x: 335, y: 68 }, { x: 220, y: 145 },
                    ]
                ).map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="9" fill={pt.y < 100 ? '#f59e0b' : '#38bdf8'} stroke="#fff" strokeWidth="1.5" />
                ))}

                <text x="230" y="34" textAnchor="middle" fontSize="11" fontWeight="900" fill={stage === 'inversion' ? '#fbbf24' : '#bae6fd'}>
                  {stage === 'normal'
                    ? 'دمای اتاق (وضعیت معمول): اکثر الکترون‌ها در تراز پایین EL هستند'
                    : 'وارونی جمعیت (در تراز شبه‌پایدار 10⁻³s): جمعیت EU بسیار بیشتر از EL است!'}
                </text>
              </g>
            )}

            {stage === 'stimulated' && (
              <g>
                <line x1="150" y1="70" x2="310" y2="70" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="150" y1="142" x2="310" y2="142" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="136" y="74" textAnchor="end" fontSize="11" fontWeight="900" fill="#fbbf24">EU</text>
                <text x="136" y="146" textAnchor="end" fontSize="11" fontWeight="900" fill="#38bdf8">EL</text>

                {/* Incoming triggering photon hf = EU - EL */}
                <line x1="42" y1="70" x2="122" y2="70" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="6 3" />
                <polygon points="130,70 119,64 119,76" fill="#ef4444" />
                <text x="82" y="56" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#fca5a5">فوتون ورودی hf</text>

                {/* Excited electron dropping */}
                <circle cx="230" cy={70 + (tick / 100) * 72} r="9" fill="#38bdf8" stroke="#fff" strokeWidth="1.8" />
                <line x1="230" y1="80" x2="230" y2="132" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="2" />

                {/* TWO coherent outgoing photons */}
                <line x1="322" y1="92" x2="420" y2="92" stroke="#ef4444" strokeWidth="3.5" />
                <polygon points="428,92 417,86 417,98" fill="#ef4444" />
                <line x1="322" y1="118" x2="420" y2="118" stroke="#ef4444" strokeWidth="3.5" />
                <polygon points="428,118 417,112 417,124" fill="#ef4444" />
                <text x="378" y="78" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#fca5a5">۲ فوتون هم‌جهت،</text>
                <text x="378" y="142" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#fca5a5">هم‌بسامد و هم‌فاز!</text>

                <text x="230" y="32" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fca5a5">
                  گسیل القایی (پیش‌بینی اینشتین ۱۹۱۷): ۱ فوتون ورودی ← ۲ فوتون همگام خروجی
                </text>
              </g>
            )}

            {stage === 'cavity' && (
              <g>
                {/* Glass tube He 85% + Ne 15% */}
                <rect x="64" y="65" width="250" height="72" rx="10" fill="#ef4444" fillOpacity="0.16" stroke="#94a3b8" strokeWidth="2" />
                <text x="189" y="55" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fde68a">
                  مخلوط گازی: 85% هلیم + 15% نئون (تخلیه ولتاژ بالا)
                </text>
                {/* 100% mirror left */}
                <rect x="52" y="60" width="12" height="82" rx="2" fill="#e2e8f0" />
                <text x="58" y="158" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#cbd5e1">آینه ۱۰۰٪</text>
                {/* Partial mirror right */}
                <rect x="314" y="60" width="10" height="82" rx="2" fill="#94a3b8" fillOpacity="0.7" stroke="#e2e8f0" strokeDasharray="3 2" />
                <text x="319" y="158" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#cbd5e1">نیمه‌بازتاب</text>

                {/* Bouncing laser beam inside + output beam */}
                <line x1="64" y1="101" x2="314" y2="101" stroke="#ef4444" strokeWidth="6" strokeOpacity="0.4" />
                <line x1="64" y1="101" x2="438" y2="101" stroke="#ef4444" strokeWidth="3.2" />
                {[0, 1, 2, 3].map((i) => {
                  const px = 72 + ((tick * 3.5 + i * 90) % 360);
                  return <circle key={i} cx={px} cy="101" r="4" fill="#fef08a" />;
                })}
                <text x="382" y="90" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fca5a5">باریکه لیزر 633nm</text>
                <text x="230" y="182" textAnchor="middle" fontSize="10" fontWeight="800" fill="#cbd5e1">
                  لیزر گازی هلیم–نئون (ساخته شده توسط علی جوان در ۱۹۶۰)
                </text>
              </g>
            )}
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\eta = \frac{P_{\text{خروجی}}}{P_{\text{ورودی}}} \times 100\%, \qquad \frac{N}{t} = \frac{P_{\text{خروجی}}}{hc/\lambda}"
          substitutedTex={`\\eta = \\frac{${pOutMw}\\times 10^{-3}}{${pInW}} \\times 100\\% = ${etaPct.toFixed(3)}\\%, \\quad \\frac{N}{t} = ${formatSci(photonsOutPerSec, 2)}\\;\\text{s}^{-1}`}
          symbols={[
            { symbol: '\\eta', meaning: 'بازده لیزر (در He–Ne معمولاً 0.01% تا 0.1%)', unit: '%' },
            { symbol: 'P_{\\text{خروجی}}', meaning: 'توان باریکه نور لیزر (633 nm)', unit: 'mW' },
            { symbol: 'P_{\\text{ورودی}}', meaning: 'توان الکتریکی مصرفی دستگاه لیزر', unit: 'W' },
          ]}
          insight="ببینید با اعداد مسئله ۲ پایان فصل ۴ (ورودی 50 W و خروجی 5 mW)، بازده فقط 0.01% است اما بیش از ۱۰¹⁶ فوتون هم‌فاز در هر ثانیه خارج می‌شود!"
        />
      }
      controls={
        <>
          <SliderControl label="توان الکتریکی ورودی لیزر" symbol="P_{\text{in}}" value={pInW} min={10} max={100} step={5} unit="W" accentClass="text-amber-500" onChange={setPInW} />
          <SliderControl label="توان باریکه خروجی لیزر (633nm)" symbol="P_{\text{out}}" value={pOutMw} min={1} max={50} step={1} unit="mW" accentClass="text-rose-500" onChange={setPOutMw} />
        </>
      }
      metrics={
        <>
          <MetricCard label="بازده لیزر (η)" value={etaPct.toFixed(3)} unit="%" sublabel="معمولاً 0.01% تا 0.1%" color="amber" />
          <MetricCard label="فوتون خروجی در ثانیه" value={formatSciPlain(photonsOutPerSec, 2)} unit="s⁻¹" color="rose" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 4-5: Nuclear Structure & Valley of Stability (N vs Z)
   ========================================================= */
const nuclidePresets = [
  { label: '¹H (پروتیوم)', Z: 1, N: 0, sym: 'H', stable: true },
  { label: '¹²C (کربن-۱۲)', Z: 6, N: 6, sym: 'C', stable: true },
  { label: '¹⁴C (پرتوزا)', Z: 6, N: 8, sym: 'C', stable: false },
  { label: '²⁷Al (آلومینیم)', Z: 13, N: 14, sym: 'Al', stable: true },
  { label: '²⁰⁹Bi (آخرین پایدار)', Z: 83, N: 126, sym: 'Bi', stable: true },
  { label: '²³⁸U (اورانیم)', Z: 92, N: 146, sym: 'U', stable: false },
];

export const Lab4_5: React.FC = () => {
  const [Z, setZ] = useState(6);
  const [N, setN] = useState(6);

  const A = Z + N;
  const ratio = Z > 0 ? N / Z : 0;
  // Approximate stability band
  const idealN = Z <= 20 ? Z : Z * (1 + 0.0068 * (Z - 16));
  const isStable = Z <= 83 && Math.abs(N - idealN) <= Math.max(1.5, Z * 0.08);
  const qNucleus = Z * 1.6e-19;

  // Stability curve points for SVG (Z: 0..100, N: 0..160)
  const mapZ = (z: number) => 240 + (z / 100) * 185;
  const mapN = (n: number) => 176 - (n / 160) * 145;
  const stabLine = Array.from({ length: 42 }, (_, i) => {
    const z = i * 2 + 1;
    const nIdeal = z <= 20 ? z : z * (1 + 0.0068 * (z - 16));
    return `${mapZ(z).toFixed(1)},${mapN(nIdeal).toFixed(1)}`;
  }).join(' ');

  // Draw clustered nucleons (capped visually at 36 for clarity)
  const visCount = Math.min(36, A);
  const visProtons = Math.round((Z / (A || 1)) * visCount);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
            {/* Left: Visual Nucleus Cluster & Notation */}
            <rect x="14" y="14" width="186" height="178" rx="14" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
            <text x="107" y="36" textAnchor="middle" fontSize="13" fontWeight="900" className="fill-slate-800 dark:fill-white">
              A={A} | Z={Z} | N={N}
            </text>
            <g transform="translate(107, 108)">
              {Array.from({ length: visCount }, (_, i) => {
                const rad = i === 0 ? 0 : 12 * Math.sqrt(i);
                const ang = i * 2.39996; // golden angle packing
                const x = rad * Math.cos(ang);
                const y = rad * Math.sin(ang);
                const isP = i < visProtons;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="8"
                    fill={isP ? '#ef4444' : '#64748b'}
                    stroke="#fff"
                    strokeWidth="1.3"
                  />
                );
              })}
            </g>
            <text x="107" y="180" textAnchor="middle" fontSize="10" fontWeight="900" fill={isStable ? '#059669' : '#e11d48'}>
              {isStable ? 'در نوار پایداری (پایدار)' : Z > 83 ? 'Z > 83 ← ناپایدار (پرتوزا!)' : 'خارج از نوار پایداری (ناپایدار)'}
            </text>

            {/* Right: N vs Z Stability Chart (Figure 4-22!) */}
            <rect x="212" y="14" width="234" height="178" rx="14" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
            <text x="329" y="31" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
              نمودار پایداری هسته (N برحسب Z — شکل ۴-۲۲)
            </text>
            <line x1="240" y1="176" x2="430" y2="176" stroke="#64748b" strokeWidth="1.5" />
            <line x1="240" y1="176" x2="240" y2="38" stroke="#64748b" strokeWidth="1.5" />
            <text x="432" y="179" fontSize="9.5" fontWeight="800" className="fill-slate-500">Z</text>
            <text x="230" y="42" fontSize="9.5" fontWeight="800" className="fill-slate-500">N</text>

            {/* N = Z reference dashed line */}
            <line x1={mapZ(0)} y1={mapN(0)} x2={mapZ(100)} y2={mapN(100)} stroke="#94a3b8" strokeDasharray="4 3" strokeWidth="1.5" />
            <text x={mapZ(82)} y={mapN(78)} fontSize="8.5" className="fill-slate-400">N = Z</text>

            {/* Stability band */}
            <polyline points={stabLine} fill="none" stroke="#0284c7" strokeWidth="8" strokeOpacity="0.3" strokeLinecap="round" />
            <polyline points={stabLine} fill="none" stroke="#0284c7" strokeWidth="2.5" />

            {/* Z=83 Bi boundary */}
            <line x1={mapZ(83)} y1="38" x2={mapZ(83)} y2="176" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1.3" />
            <text x={mapZ(83)} y="46" textAnchor="middle" fontSize="8" fontWeight="800" fill="#d97706">Bi(83)</text>

            {/* Current nucleus pulsing dot */}
            <circle cx={mapZ(Z)} cy={mapN(N)} r="6.5" fill={isStable ? '#10b981' : '#ef4444'} stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="{}^{A}_{Z}\text{X}_{N} \quad \Longrightarrow \quad A = Z + N, \qquad q_{\text{هسته}} = +Z e"
          substitutedTex={`A = ${Z} + ${N} = ${A}, \\qquad \\frac{N}{Z} = ${ratio.toFixed(2)}, \\qquad q_{\\text{هسته}} = +${formatSci(qNucleus, 2)}\\;\\text{C}`}
          symbols={[
            { symbol: 'Z', meaning: 'عدد اتمی (تعداد پروتون‌های قرمز — تعیین‌کننده عنصر)', unit: 'پروتون' },
            { symbol: 'N', meaning: 'عدد نوترونی (تعداد نوترون‌های خاکستری)', unit: 'نوترون' },
            { symbol: 'A', meaning: 'عدد جرمی (کل نوکلئون‌های هسته = $Z+N$)', unit: 'نوکلئون' },
          ]}
          insight="روی دکمه ²⁰⁹Bi و ²³⁸U کلیک کنید و ببینید چگونه در هسته‌های سنگین نقطه روی نمودار بالای خط N = Z قرار می‌گیرد تا نوترون‌های اضافی بر دافعه پروتون‌ها غلبه کنند!"
        />
      }
      controls={
        <>
          <SliderControl label="تعداد پروتون (عدد اتمی)" symbol="Z" value={Z} min={1} max={92} step={1} accentClass="text-rose-500" onChange={setZ} />
          <SliderControl label="تعداد نوترون" symbol="N" value={N} min={0} max={146} step={1} accentClass="text-slate-600" onChange={setN} />
          <div className="grid grid-cols-2 gap-1.5">
            {nuclidePresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setZ(p.Z); setN(p.N); }}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/50 text-[11px] font-bold cursor-pointer text-right"
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="عدد جرمی (نوکلئون A)" value={String(A)} sublabel={`نسبت N/Z = ${ratio.toFixed(2)}`} color="amber" />
          <MetricCard label="بار خالص هسته" value={`+${formatSciPlain(qNucleus, 2)}`} unit="C" color="rose" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 4-6: Natural Radioactivity (α, β⁻, β⁺, γ) & Half-Life Simulator
   ========================================================= */
const decayPresets = {
  alpha: {
    title: 'واپاشی آلفا (α)',
    parent: '{}^{238}_{92}\\text{U}',
    daughter: '{}^{234}_{90}\\text{Th}',
    particle: '{}^{4}_{2}\\text{He}',
    rule: 'A → A−4,  Z → Z−2',
    shield: 'ورقه نازک سرب (0.01 mm) یا کاغذ متوقفش می‌کند',
    magDir: 'انحراف کم به یک سو (بار +2e، سنگین)',
    col: '#f59e0b',
  },
  betaMinus: {
    title: 'واپاشی بتای منفی (β⁻)',
    parent: '{}^{234}_{90}\\text{Th}',
    daughter: '{}^{234}_{91}\\text{Pa}',
    particle: '{}^{0}_{-1}e^-',
    rule: 'A ثابت,  Z → Z+1 (نوترون ← پروتون + e⁻)',
    shield: 'حدود 0.1 mm سرب متوقفش می‌کند',
    magDir: 'انحراف شدید به سوی مخالف α (بار −e، سبک)',
    col: '#0284c7',
  },
  betaPlus: {
    title: 'واپاشی بتای مثبت (β⁺)',
    parent: '{}^{124}_{53}\\text{I}',
    daughter: '{}^{124}_{52}\\text{Te}',
    particle: '{}^{0}_{+1}e^+',
    rule: 'A ثابت,  Z → Z−1 (پروتون ← نوترون + e⁺)',
    shield: 'حدود 0.1 mm سرب متوقفش می‌کند',
    magDir: 'انحراف شدید هم‌سوی α (بار +e، سبک)',
    col: '#10b981',
  },
  gamma: {
    title: 'واپاشی گاما (γ)',
    parent: '{}^{231*}_{90}\\text{Th}',
    daughter: '{}^{231}_{90}\\text{Th}',
    particle: '\\gamma',
    rule: 'A و Z هر دو ثابت (فقط خروج فوتون پرانرژی)',
    shield: 'بیشترین نفوذ! حتی از ~100 mm سرب عبور می‌کند',
    magDir: 'بدون هیچ انحرافی مستقیم می‌رود (خنثی)',
    col: '#a855f7',
  },
};

export const Lab4_6: React.FC = () => {
  const [subMode, setSubMode] = useState<'halflife' | 'decay'>('halflife');

  // Half-life mode
  const [nHalves, setNHalves] = useState(2); // 0..6 integer half-lives
  const [tHalf, setTHalf] = useState(8); // days (I-131 example 4-5!)
  const [n0, setN0] = useState(64); // initial sample (64 nuclei visual grid)

  // Decay mode
  const [decayType, setDecayType] = useState<'alpha' | 'betaMinus' | 'betaPlus' | 'gamma'>('alpha');

  const remainingFrac = Math.pow(0.5, nHalves);
  const remaining = n0 * remainingFrac;
  const decayed = n0 - remaining;
  const elapsed = nHalves * tHalf;

  // Deterministic visual grid of 64 nuclei (red = active parent, blue = decayed daughter)
  const activeDots = Math.round(64 * remainingFrac);
  const decayPts = Array.from({ length: 61 }, (_, i) => {
    const xVal = (i / 60) * 6;
    const yVal = Math.pow(0.5, xVal);
    const px = 248 + (xVal / 6) * 182;
    const py = 174 - yVal * 124;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');

  const dInfo = decayPresets[decayType];

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={subMode}
              onChange={setSubMode}
              options={[
                { value: 'halflife', label: 'آزمایشگاه نیمه‌عمر (شکل ۴-۲۸)' },
                { value: 'decay', label: 'واپاشی‌های α, β⁻, β⁺, γ و قدرت نفوذ' },
              ]}
            />
          </div>

          {subMode === 'halflife' ? (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              {/* Left: 8x8 grid of 64 parent/daughter nuclei */}
              <rect x="14" y="14" width="194" height="178" rx="14" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
              <text x="111" y="32" textAnchor="middle" fontSize="9.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                قرمز: مادر فعال ({activeDots}/64) | آبی: واپاشیده
              </text>
              {Array.from({ length: 64 }, (_, idx) => {
                // Pseudo-shuffled index so decay looks naturally random across the sample
                const order = (idx * 29 + 11) % 64;
                const isAlive = order < activeDots;
                const r = Math.floor(idx / 8);
                const c = idx % 8;
                return (
                  <circle
                    key={idx}
                    cx={36 + c * 21.5}
                    cy={48 + r * 18}
                    r="6.2"
                    fill={isAlive ? '#ef4444' : '#93c5fd'}
                  />
                );
              })}

              {/* Right: Half-life decay curve */}
              <rect x="220" y="14" width="226" height="178" rx="14" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
              <text x="333" y="32" textAnchor="middle" fontSize="10" fontWeight="800" fill="#d97706">
                نمودار واپاشی N = N₀ (1/2)ⁿ
              </text>
              <line x1="248" y1="174" x2="434" y2="174" stroke="#64748b" strokeWidth="1.5" />
              <line x1="248" y1="174" x2="248" y2="42" stroke="#64748b" strokeWidth="1.5" />
              {[0, 1, 2, 3, 4, 5, 6].map((k) => {
                const px = 248 + (k / 6) * 182;
                return (
                  <text key={k} x={px} y="187" textAnchor="middle" fontSize="8.5" className="fill-slate-500">
                    {k}T½
                  </text>
                );
              })}
              <polyline points={decayPts} fill="none" stroke="#ef4444" strokeWidth="3" />
              <circle
                cx={248 + (nHalves / 6) * 182}
                cy={174 - remainingFrac * 124}
                r="6"
                fill="#ef4444"
                stroke="#fff"
                strokeWidth="2"
              />
              <text x="348" y="68" textAnchor="middle" fontSize="10" fontWeight="900" fill="#dc2626">
                باقی‌مانده: 1/{Math.pow(2, nHalves)} ({(remainingFrac * 100).toFixed(1)}%)
              </text>
              <text x="348" y="84" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#2563eb">
                واپاشیده: {Math.pow(2, nHalves) - 1}/{Math.pow(2, nHalves)} ({((1 - remainingFrac) * 100).toFixed(1)}%)
              </text>
            </svg>
          ) : (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              <rect x="14" y="12" width="432" height="182" rx="14" fill="#0f172a" />

              {/* Left: Lead shielding penetration comparison */}
              <circle cx="52" cy="105" r="18" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
              <text x="52" y="109" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="white">چشمه</text>

              {/* Paper / 0.01mm Pb */}
              <rect x="142" y="42" width="10" height="126" rx="2" fill="#fde68a" />
              <text x="147" y="182" textAnchor="middle" fontSize="8.5" fill="#fde68a">0.01mm Pb</text>
              {/* 0.1mm Pb */}
              <rect x="228" y="42" width="18" height="126" rx="2" fill="#94a3b8" />
              <text x="237" y="182" textAnchor="middle" fontSize="8.5" fill="#cbd5e1">0.1mm Pb</text>
              {/* 100mm Pb */}
              <rect x="330" y="42" width="44" height="126" rx="3" fill="#475569" />
              <text x="352" y="182" textAnchor="middle" fontSize="8.5" fill="#cbd5e1">100mm Pb</text>

              {/* Rays */}
              <line x1="70" y1="68" x2="142" y2="68" stroke="#f59e0b" strokeWidth={decayType === 'alpha' ? 5 : 2.2} strokeOpacity={decayType === 'alpha' ? 1 : 0.4} />
              <text x="106" y="61" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fbbf24">α</text>

              <line x1="70" y1="105" x2="228" y2="105" stroke="#38bdf8" strokeWidth={decayType === 'betaMinus' || decayType === 'betaPlus' ? 5 : 2.2} strokeOpacity={decayType === 'betaMinus' || decayType === 'betaPlus' ? 1 : 0.4} />
              <text x="106" y="98" textAnchor="middle" fontSize="10" fontWeight="900" fill="#38bdf8">β⁻ / β⁺</text>

              <line x1="70" y1="142" x2="418" y2="142" stroke="#c084fc" strokeWidth={decayType === 'gamma' ? 5 : 2.2} strokeOpacity={decayType === 'gamma' ? 1 : 0.4} strokeDasharray="7 3" />
              <text x="106" y="135" textAnchor="middle" fontSize="10" fontWeight="900" fill="#c084fc">γ</text>

              <text x="230" y="29" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={dInfo.col}>
                {dInfo.title} — {dInfo.shield}
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        subMode === 'halflife' ? (
          <LiveFormulaCard
            formulaTex="N = N_0\left(\frac{1}{2}\right)^n, \qquad n = \frac{t}{T_{1/2}}, \qquad N_{\text{واپاشیده}} = N_0 - N"
            substitutedTex={`t = ${nHalves} \\times ${tHalf} = ${elapsed}, \\quad N = ${n0}\\left(\\frac{1}{2}\\right)^{${nHalves}} = ${remaining.toFixed(2)}, \\quad N_{\\text{واپاشیده}} = ${decayed.toFixed(2)}`}
            symbols={[
              { symbol: 'N_0, N', meaning: 'مقدار اولیه و مقدار **باقی‌مانده**', unit: 'g' },
              { symbol: 'T_{1/2}', meaning: 'نیمه‌عمر (زمان نصف شدن هسته‌ها)', unit: 'زمان' },
              { symbol: 'n', meaning: 'تعداد نیمه‌عمرهای سپری‌شده (صحیح)', unit: 'عدد' },
            ]}
            insight="همیشه حواستان باشد در تست کنکور «باقی‌مانده» خواسته شده یا «واپاشیده»! مثلاً در n = 3 نیمه‌عمر، ۱/۸ باقی مانده ولی ۷/۸ واپاشی کرده است!"
          />
        ) : (
          <LiveFormulaCard
            formulaTex={`${dInfo.parent} \\longrightarrow ${dInfo.daughter} + ${dInfo.particle}`}
            symbols={[
              { symbol: 'A, Z', meaning: dInfo.rule, unit: 'پایستگی' },
              { symbol: '\\vec{B}', meaning: dInfo.magDir, unit: 'مغناطیس' },
            ]}
            insight="در تمام واپاشی‌های پرتوزا مجموع عددهای جرمی (بالا) و مجموع عددهای اتمی (پایین) در دو طرف واکنش دقیقاً با هم برابرند!"
          />
        )
      }
      controls={
        subMode === 'halflife' ? (
          <>
            <SliderControl label="تعداد نیمه‌عمر سپری‌شده" symbol="n" value={nHalves} min={0} max={6} step={1} accentClass="text-rose-500" onChange={setNHalves} />
            <SliderControl label="نیمه‌عمر ماده (T₁/₂)" symbol="T_{1/2}" value={tHalf} min={1} max={60} step={1} unit="واحد زمان" accentClass="text-amber-500" onChange={setTHalf} />
            <SliderControl label="مقدار اولیه نمونه" symbol="N_0" value={n0} min={16} max={256} step={16} unit="g" accentClass="text-cyan-600" onChange={setN0} />
            <div className="grid grid-cols-2 gap-1.5">
              <button type="button" onClick={() => { setTHalf(8); setNHalves(5); setN0(64); }} className="py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold cursor-pointer">مثال ۴-۵ (ید-۱۳۱، 40 روز)</button>
              <button type="button" onClick={() => { setTHalf(60); setNHalves(4); setN0(128); }} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">بیسموت-۲۱۲ (4 ساعت)</button>
            </div>
          </>
        ) : (
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">نوع واپاشی پرتوزا را انتخاب کنید:</div>
            <SegmentedButtons
              value={decayType}
              onChange={setDecayType}
              options={[
                { value: 'alpha', label: 'آلفا (α)' },
                { value: 'betaMinus', label: 'بتا منفی (β⁻)' },
                { value: 'betaPlus', label: 'بتا مثبت (β⁺)' },
                { value: 'gamma', label: 'گاما (γ)' },
              ]}
            />
            <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-xs leading-6 text-slate-700 dark:text-slate-200">
              <strong>رفتار در میدان مغناطیسی (پرسش ۴-۳):</strong> {dInfo.magDir}
            </div>
          </div>
        )
      }
      metrics={
        subMode === 'halflife' ? (
          <>
            <MetricCard label="مقدار باقی‌مانده (N)" value={remaining.toFixed(2)} unit="g" sublabel={`کسر 1/${Math.pow(2, nHalves)}`} color="rose" />
            <MetricCard label="مقدار واپاشیده (ΔN)" value={decayed.toFixed(2)} unit="g" sublabel={`زمان کل t = ${elapsed}`} color="cyan" />
          </>
        ) : (
          <>
            <MetricCard label="تغییر عدد جرمی و اتمی" value={decayType === 'alpha' ? 'A−4, Z−2' : decayType === 'betaMinus' ? 'A ثابت, Z+1' : decayType === 'betaPlus' ? 'A ثابت, Z−1' : 'A و Z ثابت'} color="amber" />
            <MetricCard label="قدرت نفوذ" value={decayType === 'alpha' ? 'کمترین' : decayType === 'gamma' ? 'بیشترین' : 'متوسط'} color="violet" />
          </>
        )
      }
    />
  );
};
