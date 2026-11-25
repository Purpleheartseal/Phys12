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
   LAB 3-5: Mechanical Waves — Transverse vs Longitudinal Slinky
   ========================================================= */
export const Lab3_5: React.FC = () => {
  const [waveType, setWaveType] = useState<'transverse' | 'longitudinal'>('transverse');
  const [freq, setFreq] = useState(1.2); // Hz
  const [amp, setAmp] = useState(28);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setPhase((p) => (p + 0.08 * freq) % (Math.PI * 20)), 35);
    return () => window.clearInterval(id);
  }, [playing, freq]);

  const numNodes = 36;
  const k = (2 * Math.PI) / 145;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={waveType}
              onChange={setWaveType}
              options={[
                { value: 'transverse', label: 'موج عرضی (نوسان ⊥ انتشار)' },
                { value: 'longitudinal', label: 'موج طولی (تراکم و انبساط ∥ انتشار)' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
            {/* Propagation direction arrow */}
            <line x1="150" y1="26" x2="310" y2="26" stroke="#0284c7" strokeWidth="3" />
            <polygon points="318,26 306,20 306,32" fill="#0284c7" />
            <text x="230" y="18" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#0284c7">
              جهت انتشار موج و انتقال انرژی (v)
            </text>

            {/* Equilibrium line */}
            <line x1="32" y1="115" x2="428" y2="115" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />

            {waveType === 'transverse' ? (
              <g>
                {/* Rope curve */}
                <polyline
                  points={Array.from({ length: 100 }, (_, i) => {
                    const x = 35 + (i / 99) * 390;
                    const y = 115 - amp * Math.sin(k * (x - 35) - phase);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3.5"
                />
                {/* Discrete beads with ONE tagged red bead */}
                {Array.from({ length: 17 }, (_, i) => {
                  const x = 35 + (i / 16) * 390;
                  const y = 115 - amp * Math.sin(k * (x - 35) - phase);
                  const isTagged = i === 8;
                  return (
                    <g key={i}>
                      {isTagged && (
                        <>
                          <line x1={x} y1={115 - amp - 12} x2={x} y2={115 + amp + 12} stroke="#ef4444" strokeDasharray="3 3" strokeWidth="1.8" />
                          <text x={x} y="186" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ef4444">
                            ذره قرمز فقط بالا و پایین می‌رود (جابه‌جایی افقی ندارد!)
                          </text>
                        </>
                      )}
                      <circle cx={x} cy={y} r={isTagged ? 8 : 4} fill={isTagged ? '#ef4444' : '#6366f1'} stroke="#fff" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </g>
            ) : (
              <g>
                {/* Slinky longitudinal coils */}
                {Array.from({ length: numNodes }, (_, i) => {
                  const baseX = 40 + (i / (numNodes - 1)) * 380;
                  const disp = (amp * 0.42) * Math.sin(k * (baseX - 40) - phase);
                  const cx = baseX + disp;
                  const isTagged = i === 18;
                  return (
                    <g key={i}>
                      <ellipse
                        cx={cx}
                        cy="115"
                        rx="6"
                        ry="34"
                        fill="none"
                        stroke={isTagged ? '#ef4444' : '#7c3aed'}
                        strokeWidth={isTagged ? 3.5 : 2}
                        strokeOpacity={isTagged ? 1 : 0.78}
                      />
                      {isTagged && (
                        <>
                          <circle cx={cx} cy="81" r="5" fill="#ef4444" />
                          <line x1={baseX - 18} y1="68" x2={baseX + 18} y2="68" stroke="#ef4444" strokeWidth="2.2" />
                          <text x="230" y="186" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ef4444">
                            حلقه قرمز فقط عقب و جلو نوسان می‌کند ← تراکم‌ها و انبساط‌ها به راست می‌روند!
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\text{انتقال انرژی بدون انتقال ماده: } \quad f_{\text{ذرات محیط}} = f_{\text{چشمه}}"
          symbols={[
            { symbol: '\\text{موج عرضی}', meaning: 'نوسان ذرات عمود بر جهت انتشار (تار، نور، امواج S)', unit: 'قله و دره' },
            { symbol: '\\text{موج طولی}', meaning: 'نوسان ذرات هم‌راستای انتشار (صوت، امواج P)', unit: 'تراکم و انبساط' },
            { symbol: '\\text{مکانیکی / EM}', meaning: 'مکانیکی نیاز به محیط مادی دارد؛ EM در خلأ هم منتشر می‌شود', unit: 'نوع موج' },
          ]}
          insight="روی ذره قرمز تمرکز کنید: موج پیوسته به سمت راست می‌رود ولی ذره قرمز فقط سر جای خود نوسان می‌کند (در عرضی بالا–پایین و در طولی چپ–راست)!"
        />
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold cursor-pointer"
          >
            {playing ? 'توقف تصویر لحظه‌ای' : 'ادامه انتشار موج'}
          </button>
          <SliderControl label="بسامد چشمه" symbol="f" value={freq} min={0.4} max={2.5} step={0.1} unit="Hz" accentClass="text-violet-600" onChange={setFreq} />
          <SliderControl label="دامنه نوسان" symbol="A" value={amp} min={10} max={42} step={2} unit="mm" accentClass="text-amber-500" onChange={setAmp} />
        </>
      }
      metrics={
        <>
          <MetricCard
            label="زاویه نوسان با انتشار"
            value={waveType === 'transverse' ? '90° (عمود)' : '0° (هم‌راستا)'}
            color="violet"
          />
          <MetricCard
            label="مثال‌های مهم کتاب"
            value={waveType === 'transverse' ? 'نور، تار، S' : 'صوت، فنر، P'}
            color="cyan"
          />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-6: Wave Properties (String v=sqrt(F/µ), Sound dB, Doppler, EM Spectrum)
   ========================================================= */
export const Lab3_6: React.FC = () => {
  const [subMode, setSubMode] = useState<'string' | 'sound' | 'doppler' | 'em'>('string');

  // 1. String wave
  const [F, setF] = useState(40); // N
  const [muG, setMuG] = useState(10); // g/m (= 0.01 kg/m)
  const [fStr, setFStr] = useState(20); // Hz
  const [phase, setPhase] = useState(0);

  // 2. Sound intensity & dB
  const [powerMw, setPowerMw] = useState(12.56); // mW (so P / 4pi = 1e-3 W)
  const [distR, setDistR] = useState(10); // m

  // 3. Doppler effect
  const [vSourceFrac, setVSourceFrac] = useState(0.45); // vs / v_sound (-0.75 .. +0.75)

  // 4. EM spectrum
  const [logFreq, setLogFreq] = useState(14.7); // 10^logFreq Hz (visible ~ 14.63 - 14.88)

  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 0.14) % (Math.PI * 20)), 35);
    return () => window.clearInterval(id);
  }, []);

  // String calcs
  const mu = muG * 1e-3;
  const vStr = Math.sqrt(F / mu);
  const lambdaStr = vStr / fStr;

  // Sound calcs
  const P = powerMw * 1e-3;
  const I = P / (4 * Math.PI * distR * distR);
  const beta = Math.max(0, 10 * Math.log10(I / 1e-12));
  const soundRef =
    beta < 25 ? 'پچ‌پچ آرام' : beta < 45 ? 'کتابخانه / خیابان خلوت' : beta < 68 ? 'صحبت معمولی' : beta < 88 ? 'خیابان پرسرصدا / جاروبرقی' : beta < 112 ? 'قطار / کارگاه' : 'مته سنگ‌شکن / موتور جت!';

  // EM calcs
  const fEm = Math.pow(10, logFreq);
  const lamEm = 3e8 / fEm;
  const emBand =
    logFreq < 9
      ? 'امواج رادیویی'
      : logFreq < 11.5
      ? 'میکروموج (ریزموج)'
      : logFreq < 14.6
      ? 'فروسرخ (IR)'
      : logFreq <= 14.9
      ? 'نور مرئی (400 تا 700 nm)'
      : logFreq < 16.5
      ? 'فرابنفش (UV)'
      : logFreq < 19
      ? 'پرتوهای X'
      : 'پرتوهای گاما (γ)';

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={subMode}
              onChange={setSubMode}
              options={[
                { value: 'string', label: 'موج در تار (v=√F/μ)' },
                { value: 'sound', label: 'شدت و تراز صوت (dB)' },
                { value: 'doppler', label: 'اثر دوپلر' },
                { value: 'em', label: 'طیف الکترومغناطیس' },
              ]}
            />
          </div>

          {subMode === 'string' && (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              <line x1="30" y1="110" x2="430" y2="110" stroke="#94a3b8" strokeDasharray="4 4" />
              {(() => {
                // Visual wavelength proportional to lambdaStr
                const lamPx = Math.max(38, Math.min(260, lambdaStr * 45));
                const pts = Array.from({ length: 140 }, (_, i) => {
                  const x = 32 + (i / 139) * 396;
                  const y = 110 - 38 * Math.sin((2 * Math.PI * (x - 32)) / lamPx - phase);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');
                return (
                  <>
                    <polyline points={pts} fill="none" stroke="#7c3aed" strokeWidth="3.2" />
                    {/* Wavelength bracket */}
                    <line x1="60" y1="45" x2={60 + lamPx} y2="45" stroke="#f59e0b" strokeWidth="2.2" />
                    <line x1="60" y1="40" x2="60" y2="50" stroke="#f59e0b" strokeWidth="2.2" />
                    <line x1={60 + lamPx} y1="40" x2={60 + lamPx} y2="50" stroke="#f59e0b" strokeWidth="2.2" />
                    <text x={60 + lamPx / 2} y="36" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#d97706">
                      λ = {lambdaStr.toFixed(2)} m
                    </text>
                  </>
                );
              })()}
              <text x="230" y="186" textAnchor="middle" fontSize="10.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                تندی انتشار v = {vStr.toFixed(1)} m/s (فقط تابع F و μ است — مستقل از بسامد چشمه f!)
              </text>
            </svg>
          )}

          {subMode === 'sound' && (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              {/* Speaker */}
              <g transform="translate(55, 105)">
                <rect x="-18" y="-14" width="16" height="28" rx="3" fill="#475569" />
                <polygon points="-2,-14 16,-28 16,28 -2,14" fill="#6366f1" />
              </g>
              {/* Expanding spherical wavefronts */}
              {[1, 2, 3, 4, 5].map((n) => {
                const rad = ((n * 44 + phase * 14) % 230) + 18;
                return (
                  <path
                    key={n}
                    d={`M ${68 + rad * 0.72} ${105 - rad * 0.58} A ${rad} ${rad} 0 0 1 ${68 + rad * 0.72} ${105 + rad * 0.58}`}
                    fill="none"
                    stroke="#7c3aed"
                    strokeOpacity={Math.max(0.12, 1 - rad / 250)}
                    strokeWidth="2.5"
                  />
                );
              })}
              {/* Listener at distance r */}
              {(() => {
                const lx = 95 + (distR / 50) * 200;
                return (
                  <g transform={`translate(${lx}, 105)`}>
                    <circle cx="0" cy="0" r="14" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="white">گوش</text>
                    <text x="0" y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">r = {distR} m</text>
                  </g>
                );
              })()}
              {/* dB vertical meter */}
              <g transform="translate(360, 26)">
                <rect x="0" y="0" width="76" height="154" rx="12" className="fill-slate-900" />
                <rect x="18" y="20" width="40" height="106" rx="6" fill="#1e293b" />
                <rect
                  x="18"
                  y={20 + (1 - Math.min(1, beta / 130)) * 106}
                  width="40"
                  height={Math.min(1, beta / 130) * 106}
                  rx="6"
                  fill={beta > 95 ? '#ef4444' : beta > 65 ? '#f59e0b' : '#10b981'}
                />
                <text x="38" y="144" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">
                  {beta.toFixed(1)} dB
                </text>
              </g>
              <text x="190" y="192" textAnchor="middle" fontSize="10.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                معادل صوتی جدول ۳-۲ کتاب: {soundRef}
              </text>
            </svg>
          )}

          {subMode === 'doppler' && (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              {/* Eccentric circular wavefronts (Figure 3-27!) */}
              {[1, 2, 3, 4, 5, 6].map((n) => {
                const age = ((n * 18 + phase * 6) % 108) + 8;
                const centerX = 230 - vSourceFrac * age;
                return (
                  <circle
                    key={n}
                    cx={centerX}
                    cy="102"
                    r={age}
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2.2"
                    strokeOpacity={Math.max(0.2, 1 - age / 120)}
                  />
                );
              })}
              {/* Moving siren */}
              <rect x="210" y="90" width="40" height="24" rx="7" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <text x="230" y="106" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="white">آژیر</text>

              {/* Stationary observers left & right */}
              <circle cx="48" cy="102" r="14" fill="#0284c7" />
              <text x="48" y="106" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">چپ</text>
              <text x="48" y="132" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0284c7">
                {vSourceFrac > 0.05 ? 'λ بیشتر ← f کمتر' : vSourceFrac < -0.05 ? 'λ کمتر ← f بیشتر' : 'f = f₀'}
              </text>

              <circle cx="412" cy="102" r="14" fill="#10b981" />
              <text x="412" y="106" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">راست</text>
              <text x="412" y="132" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#059669">
                {vSourceFrac > 0.05 ? 'λ کمتر ← f بیشتر!' : vSourceFrac < -0.05 ? 'λ بیشتر ← f کمتر' : 'f = f₀'}
              </text>

              <text x="230" y="192" textAnchor="middle" fontSize="10.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                {Math.abs(vSourceFrac) < 0.05
                  ? 'چشمه ساکن است ← فاصله جبهه‌های موج در جلو و عقب یکسان است.'
                  : `چشمه به سمت ${vSourceFrac > 0 ? 'راست' : 'چپ'} حرکت می‌کند ← جبهه‌های موج جلوی آن فشرده می‌شوند!`}
              </text>
            </svg>
          )}

          {subMode === 'em' && (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              {/* Spectrum bar */}
              <defs>
                <linearGradient id="visGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="75%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <text x="230" y="24" textAnchor="middle" fontSize="11" fontWeight="900" className="fill-slate-700 dark:fill-slate-200">
                طیف پیوسته امواج الکترومغناطیسی (همگی در خلأ با c = 3×10⁸ m/s)
              </text>
              {/* Bands */}
              {[
                { label: 'رادیویی', x: 24, w: 66, col: '#94a3b8' },
                { label: 'میکروموج', x: 92, w: 56, col: '#64748b' },
                { label: 'فروسرخ', x: 150, w: 58, col: '#f87171' },
                { label: 'مرئی', x: 210, w: 46, col: 'url(#visGrad)' },
                { label: 'فرابنفش', x: 258, w: 56, col: '#a78bfa' },
                { label: 'پرتو X', x: 316, w: 58, col: '#6366f1' },
                { label: 'گاما γ', x: 376, w: 60, col: '#312e81' },
              ].map((b) => (
                <g key={b.label}>
                  <rect x={b.x} y="44" width={b.w} height="48" rx="6" fill={b.col} />
                  <text x={b.x + b.w / 2} y="73" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="white">
                    {b.label}
                  </text>
                </g>
              ))}
              {/* Pointer marker */}
              {(() => {
                const px = 24 + ((logFreq - 6) / 16) * 412;
                return (
                  <g>
                    <polygon points={`${px},98 ${px - 7},110 ${px + 7},110`} fill="#ef4444" />
                    <line x1={px} y1="40" x2={px} y2="96" stroke="#ef4444" strokeWidth="2.5" />
                  </g>
                );
              })()}
              {/* E perp B perp v schematic */}
              <g transform="translate(230, 152)">
                <line x1="-100" y1="0" x2="100" y2="0" stroke="#0284c7" strokeWidth="2.5" />
                <polygon points="108,0 97,-5 97,5" fill="#0284c7" />
                <text x="115" y="4" fontSize="10" fontWeight="900" fill="#0284c7">v (انتشار)</text>
                <line x1="0" y1="0" x2="0" y2="-32" stroke="#ef4444" strokeWidth="3" />
                <text x="8" y="-24" fontSize="10" fontWeight="900" fill="#ef4444">E (قائم)</text>
                <line x1="0" y1="0" x2="-24" y2="20" stroke="#10b981" strokeWidth="3" />
                <text x="-66" y="25" fontSize="10" fontWeight="900" fill="#059669">B (افقی ⊥ E)</text>
              </g>
              <text x="230" y="196" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#7c3aed">
                ناحیه فعلی: {emBand}
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        subMode === 'string' ? (
          <LiveFormulaCard
            formulaTex="v = \sqrt{\frac{F}{\mu}}, \qquad \lambda = \frac{v}{f}"
            substitutedTex={`v = \\sqrt{\\frac{${F}}{${mu.toFixed(3)}}} = ${vStr.toFixed(1)}\\;\\text{m/s}, \\qquad \\lambda = \\frac{${vStr.toFixed(1)}}{${fStr}} = ${lambdaStr.toFixed(2)}\\;\\text{m}`}
            symbols={[
              { symbol: 'F', meaning: 'نیروی کشش تار', unit: 'N' },
              { symbol: '\\mu', meaning: 'چگالی خطی جرم ($m/L = \\rho A$)', unit: 'kg/m' },
              { symbol: 'v, \\lambda, f', meaning: 'تندی انتشار، طول‌موج و بسامد چشمه', unit: 'm/s, m, Hz' },
            ]}
            insight="فقط بسامد f را تغییر دهید: تندی v ثابت می‌ماند و طول‌موج λ برعکس تغییر می‌کند. حالا کشش F را زیاد کنید: v و λ هر دو زیاد می‌شوند!"
          />
        ) : subMode === 'sound' ? (
          <LiveFormulaCard
            formulaTex="I = \frac{P_{\text{av}}}{4\pi r^2}, \qquad \beta = 10\log\!\left(\frac{I}{I_0}\right) \;\; (I_0 = 10^{-12}\;\text{W/m}^2)"
            substitutedTex={`I = ${formatSci(I, 2)}\\;\\text{W/m}^2 \\;\\Rightarrow\\; \\beta = 10\\log\\!\\left(\\frac{${formatSci(I, 2)}}{10^{-12}}\\right) = ${beta.toFixed(1)}\\;\\text{dB}`}
            symbols={[
              { symbol: 'P_{\\text{av}}', meaning: 'توان صوتی چشمه نقطه‌ای همسانگرد', unit: 'W' },
              { symbol: 'r', meaning: 'فاصله شنونده تا چشمه', unit: 'm' },
              { symbol: 'I, \\beta', meaning: 'شدت صوت و تراز شدت صوت', unit: 'W/m², dB' },
            ]}
            insight="فاصله r را دقیقاً نصف کنید (مثلاً از 20 m به 10 m): شدت صوت ۴ برابر می‌شود و تراز شدت صوت دقیقاً 6 dB بالا می‌رود!"
          />
        ) : subMode === 'doppler' ? (
          <LiveFormulaCard
            formulaTex="\text{نزدیک شدن: } \lambda' < \lambda \Rightarrow f' > f \qquad | \qquad \text{دور شدن: } \lambda' > \lambda \Rightarrow f' < f"
            symbols={[
              { symbol: 'v_s', meaning: 'تندی چشمه صوتی نسبت به محیط', unit: 'm/s' },
              { symbol: "\\lambda', f'", meaning: 'طول‌موج و بسامد ادراک‌شده توسط ناظر', unit: 'm, Hz' },
              { symbol: 'v', meaning: 'تندی انتشار صوت در هوا (ثابت و مستقل از حرکت چشمه!)', unit: '340 m/s' },
            ]}
            insight="طبق کتاب فیزیک ۱۲ تجربی، بررسی اثر دوپلر کاملاً کیفی است: جهت حرکت چشمه را عوض کنید و فشردگی جبهه‌های موج را جلو و عقب خودرو ببینید."
          />
        ) : (
          <LiveFormulaCard
            formulaTex="c = \lambda f = 3.00 \times 10^8\;\text{m/s}"
            substitutedTex={`f = ${formatSci(fEm, 2)}\\;\\text{Hz} \\;\\Rightarrow\\; \\lambda = \\frac{3\\times 10^8}{f} = ${formatSci(lamEm, 2)}\\;\\text{m}`}
            symbols={[
              { symbol: 'c', meaning: 'تندی امواج الکترومغناطیسی در خلأ ($3\\times 10^8$)', unit: 'm/s' },
              { symbol: 'f, \\lambda', meaning: 'بسامد و طول‌موج (رابطه وارون)', unit: 'Hz, m' },
            ]}
            insight="با حرکت از رادیویی به سمت گاما، بسامد (و انرژی فوتون) افزایش و طول‌موج کاهش می‌یابد، اما تندی در خلأ ثابت می‌ماند."
          />
        )
      }
      controls={
        subMode === 'string' ? (
          <>
            <SliderControl label="نیروی کشش تار" symbol="F" value={F} min={10} max={200} step={5} unit="N" accentClass="text-violet-600" onChange={setF} />
            <SliderControl label="چگالی خطی جرم" symbol="\mu" value={muG} min={2} max={40} step={2} unit="g/m" accentClass="text-cyan-600" onChange={setMuG} />
            <SliderControl label="بسامد چشمه" symbol="f" value={fStr} min={5} max={50} step={5} unit="Hz" accentClass="text-amber-500" onChange={setFStr} />
          </>
        ) : subMode === 'sound' ? (
          <>
            <SliderControl label="توان چشمه صوت" symbol="P_{\text{av}}" value={powerMw} min={1} max={100} step={1} unit="mW" accentClass="text-violet-600" onChange={setPowerMw} />
            <SliderControl label="فاصله شنونده تا چشمه" symbol="r" value={distR} min={2} max={50} step={1} unit="m" accentClass="text-emerald-600" onChange={setDistR} />
          </>
        ) : subMode === 'doppler' ? (
          <>
            <SliderControl
              label="سرعت چشمه نسبت به صوت (چپ − / راست +)"
              symbol="v_s/v"
              value={vSourceFrac}
              min={-0.7}
              max={0.7}
              step={0.05}
              accentClass="text-rose-500"
              onChange={setVSourceFrac}
            />
            <button
              type="button"
              onClick={() => setVSourceFrac(0)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              توقف چشمه (vs = 0)
            </button>
          </>
        ) : (
          <>
            <SliderControl label="توان دهِ بسامد (log₁₀ f)" symbol="\log f" value={logFreq} min={6} max={21} step={0.1} displayValue={`10^${logFreq.toFixed(1)}`} unit="Hz" accentClass="text-violet-600" onChange={setLogFreq} />
            <div className="grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => setLogFreq(8)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">رادیویی</button>
              <button type="button" onClick={() => setLogFreq(14.75)} className="py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[11px] font-bold cursor-pointer">نور مرئی</button>
              <button type="button" onClick={() => setLogFreq(20)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">پرتو گاما</button>
            </div>
          </>
        )
      }
      metrics={
        subMode === 'string' ? (
          <>
            <MetricCard label="تندی موج در تار (v)" value={vStr.toFixed(1)} unit="m/s" color="violet" />
            <MetricCard label="طول‌موج (λ)" value={lambdaStr.toFixed(2)} unit="m" color="amber" />
          </>
        ) : subMode === 'sound' ? (
          <>
            <MetricCard label="تراز شدت صوت (β)" value={beta.toFixed(1)} unit="dB" color="violet" />
            <MetricCard label="شدت صوت (I)" value={formatSciPlain(I, 2)} unit="W/m²" color="emerald" />
          </>
        ) : subMode === 'doppler' ? (
          <>
            <MetricCard label="ناظر سمت راست" value={vSourceFrac > 0.05 ? 'بسامد ↑ (زیرتر)' : vSourceFrac < -0.05 ? 'بسامد ↓ (بم‌تر)' : 'بدون تغییر'} color="emerald" />
            <MetricCard label="ناظر سمت چپ" value={vSourceFrac > 0.05 ? 'بسامد ↓ (بم‌تر)' : vSourceFrac < -0.05 ? 'بسامد ↑ (زیرتر)' : 'بدون تغییر'} color="cyan" />
          </>
        ) : (
          <>
            <MetricCard label="بسامد موج (f)" value={formatSciPlain(fEm, 2)} unit="Hz" color="violet" />
            <MetricCard label="طول‌موج در خلأ (λ)" value={formatSciPlain(lamEm, 2)} unit="m" color="cyan" />
          </>
        )
      }
    />
  );
};

/* =========================================================
   LAB 3-7: Reflection (Mirror/Diffuse, Fixed-End Pulse Inversion, Echo/Sonar)
   ========================================================= */
export const Lab3_7: React.FC = () => {
  const [subMode, setSubMode] = useState<'ray' | 'pulse' | 'echo'>('ray');

  // 1. Law of reflection
  const [thetaI, setThetaI] = useState(40); // degrees
  const [rough, setRough] = useState(false);

  // 2. Fixed-end pulse reflection
  const [pulsePos, setPulsePos] = useState(25); // 0..100 incoming, 100..200 reflected inverted
  const [playingPulse, setPlayingPulse] = useState(true);

  // 3. Echo & Echolocation
  const [cliffL, setCliffL] = useState(85); // m
  const [vSound, setVSound] = useState(340); // m/s (air 340, sea 1520)

  useEffect(() => {
    if (subMode !== 'pulse' || !playingPulse) return;
    const id = window.setInterval(() => setPulsePos((p) => (p + 2.5) % 200), 35);
    return () => window.clearInterval(id);
  }, [subMode, playingPulse]);

  const rad = (thetaI * Math.PI) / 180;
  const echoTime = (2 * cliffL) / vSound;
  const canHearEcho = echoTime >= 0.1;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={subMode}
              onChange={setSubMode}
              options={[
                { value: 'ray', label: 'قانون بازتاب و آینه‌ای/پخشنده' },
                { value: 'pulse', label: 'وارونگی تپ (انتهای بسته)' },
                { value: 'echo', label: 'پژواک و سونار (t = 2L/v)' },
              ]}
            />
          </div>

          {subMode === 'ray' && (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {/* Mirror or Rough surface */}
              {!rough ? (
                <>
                  <rect x="40" y="165" width="380" height="12" rx="4" fill="#94a3b8" />
                  {/* Normal line */}
                  <line x1="230" y1="25" x2="230" y2="165" stroke="#64748b" strokeDasharray="5 4" strokeWidth="1.8" />
                  <text x="236" y="38" fontSize="10" fontWeight="700" className="fill-slate-500">خط عمود</text>
                  {/* Incident & Reflected rays */}
                  {(() => {
                    const len = 145;
                    const ix = 230 - len * Math.sin(rad);
                    const iy = 165 - len * Math.cos(rad);
                    const rx = 230 + len * Math.sin(rad);
                    const ry = 165 - len * Math.cos(rad);
                    return (
                      <>
                        <line x1={ix} y1={iy} x2="230" y2="165" stroke="#0284c7" strokeWidth="3.5" />
                        <line x1="230" y1="165" x2={rx} y2={ry} stroke="#e11d48" strokeWidth="3.5" />
                        <text x={ix - 6} y={iy + 12} textAnchor="end" fontSize="10.5" fontWeight="900" fill="#0284c7">تابش (θi={thetaI}°)</text>
                        <text x={rx + 6} y={ry + 12} textAnchor="start" fontSize="10.5" fontWeight="900" fill="#e11d48">بازتاب (θr={thetaI}°)</text>
                      </>
                    );
                  })()}
                  <text x="230" y="198" textAnchor="middle" fontSize="10.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                    بازتاب آینه‌ای (منظم): سطح بسیار هموار ← پرتوهای موازی، موازی بازمی‌تابند
                  </text>
                </>
              ) : (
                <>
                  {/* Rough surface zig-zag */}
                  <polyline
                    points="40,170 75,155 110,172 155,152 200,168 245,150 290,170 335,154 380,170 420,158"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="4"
                  />
                  {/* Parallel incident rays scattering in different directions */}
                  {[115, 195, 275, 345].map((x, idx) => {
                    const outDx = [-70, 55, -20, 85][idx];
                    return (
                      <g key={x}>
                        <line x1={x - 50} y1="40" x2={x} y2="160" stroke="#0284c7" strokeWidth="2.5" />
                        <line x1={x} y1="160" x2={x + outDx} y2="45" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="5 2" />
                      </g>
                    );
                  })}
                  <text x="230" y="198" textAnchor="middle" fontSize="10.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                    بازتاب پخشنده (کاغذ/دیوار): در هر نقطه θi = θr برقرار است ولی نور در همه جهات پخش می‌شود!
                  </text>
                </>
              )}
            </svg>
          )}

          {subMode === 'pulse' && (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              {/* Fixed wall on right */}
              <rect x="400" y="30" width="22" height="145" rx="4" fill="#475569" />
              <text x="411" y="22" textAnchor="middle" fontSize="9.5" fontWeight="800" className="fill-slate-500">تکیه‌گاه ثابت</text>
              <line x1="32" y1="108" x2="400" y2="108" stroke="#94a3b8" strokeDasharray="4 4" />
              {(() => {
                const isReflected = pulsePos >= 100;
                const center = isReflected ? 395 - ((pulsePos - 100) / 100) * 340 : 55 + (pulsePos / 100) * 340;
                const sign = isReflected ? -1 : 1;
                const pts = Array.from({ length: 120 }, (_, i) => {
                  const x = 32 + (i / 119) * 368;
                  const y = 108 - sign * 48 * Math.exp(-Math.pow((x - center) / 26, 2));
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');
                return (
                  <>
                    <polyline points={pts} fill="none" stroke={isReflected ? '#e11d48' : '#7c3aed'} strokeWidth="3.8" />
                    <circle cx="400" cy="108" r="5" fill="#0f172a" />
                    <text x="215" y="188" textAnchor="middle" fontSize="11" fontWeight="900" fill={isReflected ? '#e11d48' : '#7c3aed'}>
                      {isReflected
                        ? 'تپ بازتابیده (وارونه شده! — طبق قانون سوم نیوتون در مرز ثابت)'
                        : 'تپ فرودی در حال پیشروی به سمت تکیه‌گاه ثابت →'}
                    </text>
                  </>
                );
              })()}
            </svg>
          )}

          {subMode === 'echo' && (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              {/* Person / Sonar source */}
              <circle cx="65" cy="112" r="18" fill="#0284c7" />
              <text x="65" y="116" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">چشمه</text>
              {/* Cliff / Obstacle */}
              <rect x="370" y="34" width="42" height="142" rx="6" fill="#64748b" />
              <text x="391" y="110" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">صخره</text>

              {/* Outgoing arrow */}
              <line x1="92" y1="88" x2="358" y2="88" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 4" />
              <polygon points="366,88 355,82 355,94" fill="#0284c7" />
              <text x="230" y="78" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0284c7">مسیر رفت (L = {cliffL} m)</text>

              {/* Returning echo arrow */}
              <line x1="362" y1="132" x2="96" y2="132" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" />
              <polygon points="88,132 99,126 99,138" fill="#10b981" />
              <text x="230" y="150" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#059669">بازگشت پژواک (مسیر کل = {2 * cliffL} m)</text>

              <text x="230" y="192" textAnchor="middle" fontSize="11" fontWeight="900" fill={canHearEcho ? '#059669' : '#e11d48'}>
                {canHearEcho
                  ? `زمان رفت‌وبرگشت t = ${echoTime.toFixed(3)} s ≥ 0.1 s ← پژواک به‌وضوح شنیده می‌شود!`
                  : `زمان t = ${echoTime.toFixed(3)} s < 0.1 s ← گوش انسان نمی‌تواند پژواک را از صدای اصلی جدا کند!`}
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        subMode === 'echo' ? (
          <LiveFormulaCard
            formulaTex="t = \frac{2L}{v}, \qquad L_{\min} = \frac{v \times 0.1\;\text{s}}{2}"
            substitutedTex={`t = \\frac{2(${cliffL})}{${vSound}} = ${echoTime.toFixed(3)}\\;\\text{s} \\qquad \\left(L_{\\min} = ${((vSound * 0.1) / 2).toFixed(1)}\\;\\text{m}\\right)`}
            symbols={[
              { symbol: 'L', meaning: 'فاصله چشمه صوت تا صخره یا مانع', unit: 'm' },
              { symbol: 'v', meaning: 'تندی انتشار صوت در محیط (هوا 340، آب دریا 1520)', unit: 'm/s' },
              { symbol: 't', meaning: 'مدت زمان رفت‌وبرگشت (حداقل 0.1 ثانیه برای پژواک)', unit: 's' },
            ]}
            insight="فاصله L را در هوا کمتر از 17 متر کنید تا ببینید چگونه زمان رفت‌وبرگشت کمتر از 0.1 ثانیه شده و پژواک قابل تشخیص نیست (تمرین ۳-۸ کتاب)!"
          />
        ) : (
          <LiveFormulaCard
            formulaTex="\theta_r = \theta_i \qquad (\text{در بازتاب، } v \text{ و } f \text{ و } \lambda \text{ ثابت می‌مانند!})"
            substitutedTex={`\\theta_i = ${thetaI}^\\circ \\;\\Longrightarrow\\; \\theta_r = ${thetaI}^\\circ`}
            symbols={[
              { symbol: '\\theta_i', meaning: 'زاویه تابش (بین پرتو فرودی و خط عمود بر سطح)', unit: 'درجه' },
              { symbol: '\\theta_r', meaning: 'زاویه بازتابش (بین پرتو بازتابیده و خط عمود)', unit: 'درجه' },
            ]}
            insight="چه در بازتاب آینه‌ای و چه در بازتاب پخشنده، در هر نقطه دقیقاً θi = θr است و هیچ تغییری در بسامد، تندی و طول‌موج رخ نمی‌دهد."
          />
        )
      }
      controls={
        subMode === 'ray' ? (
          <>
            <SliderControl label="زاویه تابش با خط عمود" symbol="\theta_i" value={thetaI} min={5} max={80} step={1} unit="°" accentClass="text-violet-600" onChange={setThetaI} />
            <button
              type="button"
              onClick={() => setRough((r) => !r)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold cursor-pointer"
            >
              {rough ? 'تبدیل به سطح صیقلی (بازتاب آینه‌ای)' : 'تبدیل به سطح ناهموار (بازتاب پخشنده)'}
            </button>
          </>
        ) : subMode === 'pulse' ? (
          <>
            <button
              type="button"
              onClick={() => setPlayingPulse((p) => !p)}
              className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold cursor-pointer"
            >
              {playingPulse ? 'توقف حرکت تپ' : 'پخش حرکت تپ'}
            </button>
            <SliderControl label="موقعیت دستی تپ (رفت → بازگشت وارونه)" value={Math.round(pulsePos)} min={0} max={199} step={1} displayValue={pulsePos < 100 ? 'تپ فرودی' : 'تپ بازتابیده'} accentClass="text-rose-500" onChange={(v) => { setPlayingPulse(false); setPulsePos(v); }} />
          </>
        ) : (
          <>
            <SliderControl label="فاصله تا مانع (صخره)" symbol="L" value={cliffL} min={5} max={300} step={1} unit="m" accentClass="text-emerald-600" onChange={setCliffL} />
            <SliderControl label="تندی صوت در محیط" symbol="v" value={vSound} min={300} max={1600} step={20} unit="m/s" accentClass="text-cyan-600" onChange={setVSound} />
            <div className="grid grid-cols-2 gap-1.5">
              <button type="button" onClick={() => setVSound(340)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">هوا (340 m/s)</button>
              <button type="button" onClick={() => setVSound(1520)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">آب دریا (1520 m/s)</button>
            </div>
          </>
        )
      }
      metrics={
        subMode === 'echo' ? (
          <>
            <MetricCard label="زمان رفت‌وبرگشت (t)" value={echoTime.toFixed(3)} unit="s" color={canHearEcho ? 'emerald' : 'rose'} />
            <MetricCard label="حداقل فاصله پژواک" value={((vSound * 0.1) / 2).toFixed(1)} unit="m" color="cyan" />
          </>
        ) : (
          <>
            <MetricCard label="زاویه بازتابش (θr)" value={`${thetaI}°`} color="rose" />
            <MetricCard label="زاویه با سطح آینه" value={`${90 - thetaI}°`} sublabel="متمم زاویه تابش" color="violet" />
          </>
        )
      }
    />
  );
};

/* =========================================================
   LAB 3-8: Refraction, Snell's Law, Total Internal Reflection & Dispersion
   ========================================================= */
export const Lab3_8: React.FC = () => {
  const [subMode, setSubMode] = useState<'snell' | 'prism'>('snell');
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.52);
  const [theta1, setTheta1] = useState(45);

  const sin1 = Math.sin((theta1 * Math.PI) / 180);
  const sin2 = (n1 * sin1) / n2;
  const isTIR = sin2 > 1;
  const theta2Deg = isTIR ? 90 : (Math.asin(Math.min(1, sin2)) * 180) / Math.PI;
  const hasCritical = n1 > n2;
  const thetaCrit = hasCritical ? (Math.asin(n2 / n1) * 180) / Math.PI : null;
  const v1Frac = 1 / n1;
  const v2Frac = 1 / n2;

  const rad1 = (theta1 * Math.PI) / 180;
  const rad2 = (theta2Deg * Math.PI) / 180;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={subMode}
              onChange={setSubMode}
              options={[
                { value: 'snell', label: 'قانون اسنل و بازتاب داخلی کلی' },
                { value: 'prism', label: 'پاشندگی در منشور و سراب' },
              ]}
            />
          </div>

          {subMode === 'snell' ? (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Medium 1 (top) and Medium 2 (bottom) */}
              <rect x="20" y="12" width="420" height="98" rx="8" fill="#e0f2fe" fillOpacity={0.18 + (n1 - 1) * 0.25} />
              <rect x="20" y="110" width="420" height="98" rx="8" fill="#818cf8" fillOpacity={0.12 + (n2 - 1) * 0.25} />
              <line x1="20" y1="110" x2="440" y2="110" stroke="#475569" strokeWidth="2.2" />
              {/* Normal */}
              <line x1="230" y1="18" x2="230" y2="202" stroke="#64748b" strokeDasharray="5 4" strokeWidth="1.6" />

              <text x="34" y="32" fontSize="10.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                محیط ۱: n₁ = {n1.toFixed(2)} (v₁ = {v1Frac.toFixed(2)}c)
              </text>
              <text x="34" y="198" fontSize="10.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                محیط ۲: n₂ = {n2.toFixed(2)} (v₂ = {v2Frac.toFixed(2)}c)
              </text>

              {/* Incident ray */}
              <line x1={230 - 110 * Math.sin(rad1)} y1={110 - 110 * Math.cos(rad1)} x2="230" y2="110" stroke="#0284c7" strokeWidth="3.5" />
              {/* Weak/Total Reflected ray */}
              <line
                x1="230"
                y1="110"
                x2={230 + 110 * Math.sin(rad1)}
                y2={110 - 110 * Math.cos(rad1)}
                stroke="#ef4444"
                strokeWidth={isTIR ? 4 : 1.8}
                strokeOpacity={isTIR ? 1 : 0.45}
                strokeDasharray={isTIR ? undefined : '4 3'}
              />

              {/* Refracted ray if not TIR */}
              {!isTIR ? (
                <>
                  <line x1="230" y1="110" x2={230 + 110 * Math.sin(rad2)} y2={110 + 110 * Math.cos(rad2)} stroke="#7c3aed" strokeWidth="3.5" />
                  <text x={230 + 82 * Math.sin(rad2) + 12} y={110 + 82 * Math.cos(rad2)} fontSize="10.5" fontWeight="900" fill="#7c3aed">
                    θ₂ = {theta2Deg.toFixed(1)}°
                  </text>
                </>
              ) : (
                <text x="335" y="50" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ef4444">
                  بازتاب داخلی کلی! (θ₁ &gt; θc = {thetaCrit?.toFixed(1)}°)
                </text>
              )}

              <text x={230 - 80 * Math.sin(rad1) - 10} y={110 - 80 * Math.cos(rad1)} textAnchor="end" fontSize="10.5" fontWeight="900" fill="#0284c7">
                θ₁ = {theta1}°
              </text>
            </svg>
          ) : (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              <rect x="14" y="14" width="432" height="192" rx="14" fill="#0f172a" />
              {/* White light beam */}
              <line x1="28" y1="138" x2="178" y2="110" stroke="#ffffff" strokeWidth="5" />
              <text x="85" y="108" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#e2e8f0">نور سفید</text>
              {/* Glass triangular prism */}
              <polygon points="225,38 145,172 305,172" fill="#38bdf8" fillOpacity="0.22" stroke="#7dd3fc" strokeWidth="2.5" />
              {/* Dispersed spectrum exiting prism */}
              {[
                { col: '#ef4444', yIn: 112, yOut: 108, label: 'قرمز (n کمتر، کمترین شکست)' },
                { col: '#f59e0b', yIn: 116, yOut: 120, label: '' },
                { col: '#eab308', yIn: 120, yOut: 132, label: '' },
                { col: '#22c55e', yIn: 124, yOut: 144, label: '' },
                { col: '#3b82f6', yIn: 128, yOut: 156, label: '' },
                { col: '#a855f7', yIn: 132, yOut: 170, label: 'بنفش (n بیشتر، بیشترین شکست!)' },
              ].map((r, i) => (
                <g key={i}>
                  <line x1="178" y1="110" x2={267 + i * 2} y2={r.yIn} stroke={r.col} strokeWidth="2.4" />
                  <line x1={267 + i * 2} y1={r.yIn} x2="425" y2={r.yOut} stroke={r.col} strokeWidth="2.8" />
                </g>
              ))}
              <text x="355" y="96" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fca5a5">قرمز (n≈1.51)</text>
              <text x="355" y="186" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#d8b4fe">بنفش (n≈1.54)</text>
              <text x="230" y="30" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#bae6fd">
                پاشندگی نور در منشور: کوتاه‌ترین طول‌موج (بنفش) بیشترین ضریب شکست و بیشترین خمیدگی را دارد
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="n_1 \sin\theta_1 = n_2 \sin\theta_2, \qquad \frac{\lambda_2}{\lambda_1} = \frac{v_2}{v_1} = \frac{n_1}{n_2}"
          substitutedTex={
            isTIR
              ? `(${n1.toFixed(2)})\\sin(${theta1}^\\circ) = ${(n1 * sin1).toFixed(2)} > n_2 (${n2.toFixed(2)}) \\;\\Rightarrow\\; \\text{بازتاب داخلی کلی!}`
              : `(${n1.toFixed(2)})\\sin(${theta1}^\\circ) = (${n2.toFixed(2)})\\sin(${theta2Deg.toFixed(1)}^\\circ)`
          }
          symbols={[
            { symbol: 'n_1, n_2', meaning: 'ضریب شکست محیط اول و دوم ($n = c/v$)', unit: 'بدون یکا' },
            { symbol: '\\theta_1, \\theta_2', meaning: 'زاویه تابش و زاویه شکست (نسبت به خط عمود)', unit: 'درجه' },
            { symbol: '\\theta_c', meaning: 'زاویه حد (فقط وقتی $n_1 > n_2$: $\\sin\\theta_c = n_2/n_1$)', unit: 'درجه' },
          ]}
          insight="دکمه «شیشه به هوا (تار نوری)» را بزنید و زاویه تابش θ₁ را از 42° بیشتر کنید تا پدیده بازتاب داخلی کلی را زنده ببینید!"
        />
      }
      controls={
        <>
          <SliderControl label="زاویه تابش" symbol="\theta_1" value={theta1} min={0} max={85} step={1} unit="°" accentClass="text-cyan-600" onChange={setTheta1} />
          <SliderControl label="ضریب شکست محیط اول" symbol="n_1" value={n1} min={1.0} max={2.42} step={0.02} accentClass="text-indigo-600" onChange={setN1} />
          <SliderControl label="ضریب شکست محیط دوم" symbol="n_2" value={n2} min={1.0} max={2.42} step={0.02} accentClass="text-violet-600" onChange={setN2} />
          <div className="grid grid-cols-2 gap-1.5">
            <button type="button" onClick={() => { setN1(1.0); setN2(1.33); setTheta1(45); setSubMode('snell'); }} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">هوا → آب (1.33)</button>
            <button type="button" onClick={() => { setN1(1.0); setN2(1.52); setTheta1(60); setSubMode('snell'); }} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">مثال ۳-۱۱ (هوا→شیشه)</button>
            <button type="button" onClick={() => { setN1(1.52); setN2(1.0); setTheta1(50); setSubMode('snell'); }} className="py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-bold cursor-pointer">شیشه→هوا (تار نوری!)</button>
            <button type="button" onClick={() => { setN1(2.42); setN2(1.0); setTheta1(30); setSubMode('snell'); }} className="py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold cursor-pointer">الماس→هوا (θc=24.4°)</button>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="زاویه شکست (θ₂)" value={isTIR ? 'بازتاب کلی!' : `${theta2Deg.toFixed(1)}°`} color={isTIR ? 'rose' : 'violet'} />
          <MetricCard
            label="زاویه حد (θc)"
            value={thetaCrit !== null ? `${thetaCrit.toFixed(1)}°` : 'ندارد (n₁≤n₂)'}
            sublabel={`نسبت λ₂/λ₁ = ${(n1 / n2).toFixed(2)}`}
            color="cyan"
          />
        </>
      }
    />
  );
};
