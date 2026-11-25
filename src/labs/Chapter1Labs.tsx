import React, { useState, useEffect } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
} from '../components/LabUI';

/* =========================================================
   LAB 1-1: Kinematics Basics (Distance/Disp, x-t Secant->Tangent, v-t Accel)
   ========================================================= */
export const Lab1_1: React.FC = () => {
  const [mode, setMode] = useState<'disp' | 'xt' | 'vt'>('disp');

  // Mode 1: Distance vs Displacement on 1D axis
  const [x1, setX1] = useState(-10);
  const [x2, setX2] = useState(25);
  const [x3, setX3] = useState(5);
  const [dt1, setDt1] = useState(10);

  // Mode 2: x-t Secant -> Tangent (x(t) = 0.5 t^2 - 2t + 2)
  const [tA, setTA] = useState(2.0);
  const [dtSec, setDtSec] = useState(3.0);

  // Mode 3: v-t Average Acceleration
  const [v1, setV1] = useState(12);
  const [v2, setV2] = useState(-8);
  const [dtAcc, setDtAcc] = useState(4);

  // Mode 1 calculations
  const seg1 = Math.abs(x2 - x1);
  const seg2 = Math.abs(x3 - x2);
  const dist = seg1 + seg2;
  const disp = x3 - x1;
  const sAv = dist / dt1;
  const vAv = disp / dt1;
  const mapX1 = (val: number) => 230 + (val / 35) * 185;

  // Mode 2 calculations: x(t) = 0.6 t^2 - 1.2 t + 1
  const xFunc = (t: number) => 0.6 * t * t - 1.2 * t + 1;
  const vInstFunc = (t: number) => 1.2 * t - 1.2;
  const tB = tA + dtSec;
  const xA = xFunc(tA);
  const xB = xFunc(tB);
  const vSec = (xB - xA) / dtSec;
  const vInst = vInstFunc(tA);
  const mapT2 = (t: number) => 55 + (t / 6.5) * 370;
  const mapY2 = (x: number) => 190 - (x / 19) * 155;
  const curvePts = Array.from({ length: 66 }, (_, i) => {
    const t = i * 0.1;
    return `${mapT2(t).toFixed(1)},${mapY2(xFunc(t)).toFixed(1)}`;
  }).join(' ');

  // Mode 3 calculations
  const dv = v2 - v1;
  const aAv = dv / dtAcc;
  const mapY3 = (v: number) => 115 - (v / 24) * 85;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-cyan-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'disp', label: 'مسافت و جابه‌جایی' },
                { value: 'xt', label: 'شیب وتر و مماس (x-t)' },
                { value: 'vt', label: 'شتاب متوسط (v-t)' },
              ]}
            />
          </div>

          {mode === 'disp' && (
            <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
              {/* Axis */}
              <line x1="30" y1="145" x2="432" y2="145" stroke="#64748b" strokeWidth="2.5" />
              <polygon points="438,145 428,140 428,150" fill="#64748b" />
              <text x="442" y="149" fontSize="12" fontWeight="900" className="fill-slate-600 dark:fill-slate-300">
                x(m)
              </text>
              {[-30, -20, -10, 0, 10, 20, 30].map((tick) => {
                const tx = mapX1(tick);
                return (
                  <g key={tick}>
                    <line x1={tx} y1="139" x2={tx} y2="151" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x={tx} y="166" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Path Segment 1: x1 -> x2 */}
              <path
                d={`M ${mapX1(x1)} 132 Q ${(mapX1(x1) + mapX1(x2)) / 2} 84 ${mapX1(x2)} 105`}
                fill="none"
                stroke="#0284c7"
                strokeWidth="3"
                strokeDasharray="6 3"
              />
              <text
                x={(mapX1(x1) + mapX1(x2)) / 2}
                y="86"
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#0284c7"
              >
                مرحله ۱: {seg1} m
              </text>

              {/* Path Segment 2: x2 -> x3 */}
              <path
                d={`M ${mapX1(x2)} 105 Q ${(mapX1(x2) + mapX1(x3)) / 2} 50 ${mapX1(x3)} 132`}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeDasharray="6 3"
              />
              <text
                x={(mapX1(x2) + mapX1(x3)) / 2}
                y="58"
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#7c3aed"
              >
                مرحله ۲: {seg2} m
              </text>

              {/* Displacement vector d = x3 - x1 */}
              {Math.abs(disp) > 0.5 && (
                <g>
                  <line
                    x1={mapX1(x1)}
                    y1="190"
                    x2={mapX1(x3)}
                    y2="190"
                    stroke="#ef4444"
                    strokeWidth="4"
                  />
                  <polygon
                    points={
                      disp > 0
                        ? `${mapX1(x3) + 6},190 ${mapX1(x3) - 5},184 ${mapX1(x3) - 5},196`
                        : `${mapX1(x3) - 6},190 ${mapX1(x3) + 5},184 ${mapX1(x3) + 5},196`
                    }
                    fill="#ef4444"
                  />
                  <text
                    x={(mapX1(x1) + mapX1(x3)) / 2}
                    y="210"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="900"
                    fill="#ef4444"
                  >
                    بردار جابه‌جایی: Δx = {disp > 0 ? `+${disp}` : disp} m
                  </text>
                </g>
              )}

              {/* Markers */}
              <circle cx={mapX1(x1)} cy="145" r="7" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <text x={mapX1(x1)} y="132" textAnchor="middle" fontSize="10" fontWeight="900" fill="#059669">
                شروع ({x1})
              </text>

              <circle cx={mapX1(x2)} cy="105" r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <text x={mapX1(x2)} y="96" textAnchor="middle" fontSize="10" fontWeight="900" fill="#d97706">
                میانی ({x2})
              </text>

              <circle cx={mapX1(x3)} cy="145" r="7" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <text x={mapX1(x3)} y="182" textAnchor="middle" fontSize="10" fontWeight="900" fill="#dc2626">
                پایان ({x3})
              </text>

              <text x="230" y="24" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                {Math.abs(disp) === dist
                  ? 'حرکت بدون تغییر جهت ← اندازه جابه‌جایی = مسافت!'
                  : `تغییر جهت رخ داد ← مسافت (${dist} m) بزرگ‌تر از اندازه جابه‌جایی (${Math.abs(disp)} m) است!`}
              </text>
            </svg>
          )}

          {mode === 'xt' && (
            <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
              {/* Grid & Axes */}
              <line x1="55" y1="190" x2="435" y2="190" stroke="#64748b" strokeWidth="2" />
              <line x1="55" y1="200" x2="55" y2="22" stroke="#64748b" strokeWidth="2" />
              <text x="438" y="194" fontSize="11" fontWeight="900" className="fill-slate-600 dark:fill-slate-300">t(s)</text>
              <text x="42" y="24" fontSize="11" fontWeight="900" className="fill-slate-600 dark:fill-slate-300">x(m)</text>
              {[1, 2, 3, 4, 5, 6].map((t) => (
                <g key={t}>
                  <line x1={mapT2(t)} y1="186" x2={mapT2(t)} y2="194" stroke="#94a3b8" />
                  <text x={mapT2(t)} y="207" textAnchor="middle" fontSize="9.5" className="fill-slate-500">{t}</text>
                </g>
              ))}

              {/* x(t) curve */}
              <polyline points={curvePts} fill="none" stroke="#0284c7" strokeWidth="3" />

              {/* Tangent line at tA */}
              {(() => {
                const tL = Math.max(0, tA - 1.3);
                const tR = Math.min(6.4, tA + 1.5);
                const yL = xA + vInst * (tL - tA);
                const yR = xA + vInst * (tR - tA);
                return (
                  <line
                    x1={mapT2(tL)}
                    y1={mapY2(yL)}
                    x2={mapT2(tR)}
                    y2={mapY2(yR)}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                  />
                );
              })()}

              {/* Secant triangle + line */}
              <line x1={mapT2(tA)} y1={mapY2(xA)} x2={mapT2(tB)} y2={mapY2(xA)} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1.8" />
              <line x1={mapT2(tB)} y1={mapY2(xA)} x2={mapT2(tB)} y2={mapY2(xB)} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1.8" />
              <line x1={mapT2(tA)} y1={mapY2(xA)} x2={mapT2(tB)} y2={mapY2(xB)} stroke="#ef4444" strokeWidth="3" />

              <circle cx={mapT2(tA)} cy={mapY2(xA)} r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx={mapT2(tB)} cy={mapY2(xB)} r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <text x={mapT2(tA) - 10} y={mapY2(xA) - 10} fontSize="11" fontWeight="900" fill="#059669">A</text>
              <text x={mapT2(tB) + 8} y={mapY2(xB) - 6} fontSize="11" fontWeight="900" fill="#dc2626">B</text>

              {/* Legend */}
              <rect x="70" y="24" width="215" height="46" rx="10" className="fill-white/90 dark:fill-slate-800/90 stroke-slate-200 dark:stroke-slate-700" />
              <line x1="82" y1="39" x2="106" y2="39" stroke="#ef4444" strokeWidth="3" />
              <text x="112" y="43" fontSize="10" fontWeight="700" className="fill-slate-700 dark:fill-slate-200">
                وتر AB (سرعت متوسط = {vSec.toFixed(2)} m/s)
              </text>
              <line x1="82" y1="57" x2="106" y2="57" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
              <text x="112" y="61" fontSize="10" fontWeight="700" className="fill-slate-700 dark:fill-slate-200">
                مماس در A (سرعت لحظه‌ای = {vInst.toFixed(2)} m/s)
              </text>
            </svg>
          )}

          {mode === 'vt' && (
            <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
              {/* Zero velocity axis */}
              <line x1="55" y1="115" x2="430" y2="115" stroke="#64748b" strokeWidth="2" />
              <line x1="55" y1="205" x2="55" y2="25" stroke="#64748b" strokeWidth="2" />
              <text x="434" y="119" fontSize="11" fontWeight="900" className="fill-slate-600 dark:fill-slate-300">t(s)</text>
              <text x="20" y="28" fontSize="11" fontWeight="900" className="fill-slate-600 dark:fill-slate-300">v(m/s)</text>
              {[-20, -10, 0, 10, 20].map((v) => (
                <g key={v}>
                  <line x1="50" y1={mapY3(v)} x2="60" y2={mapY3(v)} stroke="#94a3b8" />
                  <text x="44" y={mapY3(v) + 4} textAnchor="end" fontSize="9.5" className="fill-slate-500">{v}</text>
                </g>
              ))}

              {/* v1 to v2 line */}
              <line x1="110" y1={mapY3(v1)} x2={110 + dtAcc * 28} y2={mapY3(v2)} stroke="#0284c7" strokeWidth="3.5" />
              {/* Slope triangle */}
              <line x1="110" y1={mapY3(v1)} x2={110 + dtAcc * 28} y2={mapY3(v1)} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth="2" />
              <line x1={110 + dtAcc * 28} y1={mapY3(v1)} x2={110 + dtAcc * 28} y2={mapY3(v2)} stroke="#ef4444" strokeDasharray="4 3" strokeWidth="2" />

              <circle cx="110" cy={mapY3(v1)} r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx={110 + dtAcc * 28} cy={mapY3(v2)} r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <text x="110" y={mapY3(v1) - 10} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#059669">
                v₁={v1} m/s
              </text>
              <text x={110 + dtAcc * 28} y={mapY3(v2) + (v2 >= v1 ? -10 : 18)} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#dc2626">
                v₂={v2} m/s
              </text>
              <text x="245" y="24" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                {v1 * v2 < 0
                  ? 'تغییر علامت سرعت ← تغییر جهت حرکت! (|Δv| برابر جمع اندازه‌هاست)'
                  : aAv === 0
                  ? 'سرعت ثابت ← شتاب متوسط صفر'
                  : `شیب خط = شتاب متوسط = ${aAv.toFixed(2)} m/s²`}
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        mode === 'disp' ? (
          <LiveFormulaCard
            formulaTex="s_{\text{av}} = \frac{l}{\Delta t}, \qquad v_{\text{av}} = \frac{\Delta x}{\Delta t} = \frac{x_3 - x_1}{\Delta t}"
            substitutedTex={`s_{\\text{av}} = \\frac{${seg1} + ${seg2}}{${dt1}} = ${sAv.toFixed(2)}\\;\\text{m/s}, \\qquad v_{\\text{av}} = \\frac{${x3} - (${x1})}{${dt1}} = ${vAv.toFixed(2)}\\;\\text{m/s}`}
            symbols={[
              { symbol: 'l', meaning: 'مسافت کل پیموده‌شده (جمع طول مسیرها)', unit: 'm' },
              { symbol: '\\Delta x', meaning: 'جابه‌جایی خالص (مکان پایان منهای شروع)', unit: 'm' },
              { symbol: 's_{\\text{av}}, v_{\\text{av}}', meaning: 'تندی متوسط (نرده‌ای) و سرعت متوسط (برداری)', unit: 'm/s' },
              { symbol: '\\Delta t', meaning: 'مدت زمان کل حرکت', unit: 's' },
            ]}
            insight="سعی کنید مکان پایانی (x₃) را دقیقاً برابر مکان شروع (x₁) قرار دهید: می‌بینید که مسافت و تندی متوسط بزرگ‌اند اما جابه‌جایی و سرعت متوسط کاملاً صفر می‌شوند!"
          />
        ) : mode === 'xt' ? (
          <LiveFormulaCard
            formulaTex="v_{\text{av}} = \frac{\Delta x}{\Delta t} = \text{شیب وتر } AB \;\; \xrightarrow{\Delta t \to 0} \;\; v(t_A) = \text{شیب خط مماس در } A"
            substitutedTex={`v_{\\text{av}} = \\frac{${xB.toFixed(2)} - ${xA.toFixed(2)}}{${dtSec.toFixed(2)}} = ${vSec.toFixed(2)}\\;\\text{m/s} \\;\\; | \\;\\; v_{\\text{لحظه‌ای}}(${tA.toFixed(1)}) = ${vInst.toFixed(2)}\\;\\text{m/s}`}
            symbols={[
              { symbol: '\\Delta t', meaning: 'فاصله زمانی دو نقطه A و B روی نمودار', unit: 's' },
              { symbol: 'v_{\\text{av}}', meaning: 'سرعت متوسط (شیب پاره‌خط قرمز AB)', unit: 'm/s' },
              { symbol: 'v(t_A)', meaning: 'سرعت لحظه‌ای در A (شیب خط مماس سبز)', unit: 'm/s' },
            ]}
            insight="اسلایدر Δt را به سمت 0.1 ثانیه کم کنید و ببینید چگونه خط قرمز (وتر AB) دقیقاً روی خط سبز (مماس در A) منطبق می‌شود و سرعت متوسط به سرعت لحظه‌ای میل می‌کند!"
          />
        ) : (
          <LiveFormulaCard
            formulaTex="a_{\text{av}} = \frac{\Delta v}{\Delta t} = \frac{v_2 - v_1}{\Delta t}"
            substitutedTex={`a_{\\text{av}} = \\frac{(${v2}) - (${v1})}{${dtAcc}} = \\frac{${dv}}{${dtAcc}} = ${aAv.toFixed(2)}\\;\\text{m/s}^2`}
            symbols={[
              { symbol: 'a_{\\text{av}}', meaning: 'شتاب متوسط (شیب نمودار سرعت–زمان)', unit: 'm/s²' },
              { symbol: 'v_1, v_2', meaning: 'سرعت اولیه و نهایی (با علامت جهت حرکت)', unit: 'm/s' },
              { symbol: '\\Delta v', meaning: 'تغییر سرعت ($v_2 - v_1$)', unit: 'm/s' },
              { symbol: '\\Delta t', meaning: 'مدت زمان تغییر سرعت', unit: 's' },
            ]}
            insight="اگر v₁ مثبت و v₂ منفی باشد (برخورد و برگشت)، تغییر سرعت Δv منفی و اندازه‌اش برابر مجموع تندی‌هاست!"
          />
        )
      }
      controls={
        mode === 'disp' ? (
          <>
            <SliderControl label="مکان شروع" symbol="x_1" value={x1} min={-30} max={30} unit="m" accentClass="text-emerald-600" onChange={setX1} />
            <SliderControl label="مکان میانی (نقطه عطف)" symbol="x_2" value={x2} min={-30} max={30} unit="m" accentClass="text-amber-500" onChange={setX2} />
            <SliderControl label="مکان پایان" symbol="x_3" value={x3} min={-30} max={30} unit="m" accentClass="text-rose-500" onChange={setX3} />
            <SliderControl label="مدت زمان کل" symbol="\Delta t" value={dt1} min={2} max={30} unit="s" accentClass="text-cyan-600" onChange={setDt1} />
          </>
        ) : mode === 'xt' ? (
          <>
            <SliderControl label="لحظه نقطه A" symbol="t_A" value={tA} min={0.5} max={4.5} step={0.1} unit="s" accentClass="text-emerald-600" onChange={setTA} />
            <SliderControl label="بازه زمانی تا نقطه B" symbol="\Delta t" value={dtSec} min={0.1} max={3.5} step={0.1} unit="s" accentClass="text-rose-500" onChange={setDtSec} />
            <button
              type="button"
              onClick={() => setDtSec(0.1)}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
            >
              کوچک کردن Δt → 0 (مشاهده خط مماس!)
            </button>
          </>
        ) : (
          <>
            <SliderControl label="سرعت اولیه" symbol="v_1" value={v1} min={-20} max={20} unit="m/s" accentClass="text-emerald-600" onChange={setV1} />
            <SliderControl label="سرعت نهایی" symbol="v_2" value={v2} min={-20} max={20} unit="m/s" accentClass="text-rose-500" onChange={setV2} />
            <SliderControl label="بازه زمانی" symbol="\Delta t" value={dtAcc} min={1} max={10} step={0.5} unit="s" accentClass="text-cyan-600" onChange={setDtAcc} />
          </>
        )
      }
      metrics={
        mode === 'disp' ? (
          <>
            <MetricCard label="تندی متوسط (s_av)" value={sAv.toFixed(2)} unit="m/s" sublabel={`مسافت l = ${dist} m`} color="cyan" />
            <MetricCard label="سرعت متوسط (v_av)" value={vAv.toFixed(2)} unit="m/s" sublabel={`جابه‌جایی Δx = ${disp} m`} color="rose" />
          </>
        ) : mode === 'xt' ? (
          <>
            <MetricCard label="سرعت متوسط (وتر)" value={vSec.toFixed(2)} unit="m/s" color="rose" />
            <MetricCard label="سرعت لحظه‌ای در A" value={vInst.toFixed(2)} unit="m/s" color="emerald" />
          </>
        ) : (
          <>
            <MetricCard label="شتاب متوسط (a_av)" value={aAv.toFixed(2)} unit="m/s²" color="cyan" />
            <MetricCard label="تغییر سرعت (Δv)" value={`${dv > 0 ? '+' : ''}${dv}`} unit="m/s" color="amber" />
          </>
        )
      }
    />
  );
};

/* =========================================================
   LAB 1-2: Uniform Velocity & Two-Car Meeting Lab
   ========================================================= */
export const Lab1_2: React.FC = () => {
  const [x0A, setX0A] = useState(-40);
  const [vA, setVA] = useState(12);
  const [x0B, setX0B] = useState(100);
  const [vB, setVB] = useState(-8);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setT((prev) => {
        if (prev >= 12) {
          setPlaying(false);
          return 12;
        }
        return Number((prev + 0.1).toFixed(2));
      });
    }, 45);
    return () => window.clearInterval(id);
  }, [playing]);

  const xA = x0A + vA * t;
  const xB = x0B + vB * t;
  const denom = vA - vB;
  const tMeet = Math.abs(denom) > 1e-6 ? (x0B - x0A) / denom : null;
  const validMeet = tMeet !== null && tMeet >= 0 && tMeet <= 12;
  const xMeet = validMeet && tMeet !== null ? x0A + vA * tMeet : null;

  const mapRoad = (x: number) => 230 + (Math.max(-140, Math.min(140, x)) / 140) * 190;
  const mapGraphT = (tt: number) => 55 + (tt / 12) * 370;
  const mapGraphX = (xx: number) => 115 - (Math.max(-130, Math.min(130, xx)) / 130) * 85;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-cyan-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          {/* 1D Road animation */}
          <svg viewBox="0 0 460 88" className="w-full h-auto">
            <rect x="20" y="34" width="420" height="32" rx="10" className="fill-slate-200 dark:fill-slate-800" />
            <line x1="25" y1="50" x2="435" y2="50" stroke="#94a3b8" strokeDasharray="8 6" strokeWidth="2" />
            {/* Origin mark */}
            <line x1="230" y1="30" x2="230" y2="70" stroke="#64748b" strokeWidth="2" />
            <text x="230" y="82" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-500">x = 0</text>
            {/* Car A */}
            <g transform={`translate(${mapRoad(xA)}, 42)`}>
              <rect x="-15" y="-10" width="30" height="16" rx="5" fill="#0284c7" />
              <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">A</text>
              <text x="0" y="-14" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0284c7">
                {xA.toFixed(0)}m
              </text>
            </g>
            {/* Car B */}
            <g transform={`translate(${mapRoad(xB)}, 56)`}>
              <rect x="-15" y="-8" width="30" height="16" rx="5" fill="#e11d48" />
              <text x="0" y="3" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">B</text>
              <text x="0" y="21" textAnchor="middle" fontSize="9" fontWeight="800" fill="#e11d48">
                {xB.toFixed(0)}m
              </text>
            </g>
          </svg>

          {/* Synchronized x-t graph */}
          <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[225px]">
            <line x1="55" y1="115" x2="430" y2="115" stroke="#64748b" strokeWidth="2" />
            <line x1="55" y1="200" x2="55" y2="20" stroke="#64748b" strokeWidth="2" />
            <text x="434" y="119" fontSize="10.5" fontWeight="900" className="fill-slate-600 dark:fill-slate-300">t(s)</text>
            <text x="28" y="24" fontSize="10.5" fontWeight="900" className="fill-slate-600 dark:fill-slate-300">x(m)</text>
            {[0, 3, 6, 9, 12].map((tt) => (
              <g key={tt}>
                <line x1={mapGraphT(tt)} y1="111" x2={mapGraphT(tt)} y2="119" stroke="#94a3b8" />
                <text x={mapGraphT(tt)} y="132" textAnchor="middle" fontSize="9" className="fill-slate-500">{tt}</text>
              </g>
            ))}
            {[-100, -50, 50, 100].map((xx) => (
              <g key={xx}>
                <line x1="51" y1={mapGraphX(xx)} x2="59" y2={mapGraphX(xx)} stroke="#94a3b8" />
                <text x="46" y={mapGraphX(xx) + 3} textAnchor="end" fontSize="9" className="fill-slate-500">{xx}</text>
              </g>
            ))}

            {/* Line A */}
            <line
              x1={mapGraphT(0)}
              y1={mapGraphX(x0A)}
              x2={mapGraphT(12)}
              y2={mapGraphX(x0A + vA * 12)}
              stroke="#0284c7"
              strokeWidth="3"
            />
            {/* Line B */}
            <line
              x1={mapGraphT(0)}
              y1={mapGraphX(x0B)}
              x2={mapGraphT(12)}
              y2={mapGraphX(x0B + vB * 12)}
              stroke="#e11d48"
              strokeWidth="3"
            />

            {/* Meeting point highlight */}
            {validMeet && tMeet !== null && xMeet !== null && (
              <g>
                <line x1={mapGraphT(tMeet)} y1="25" x2={mapGraphT(tMeet)} y2="195" stroke="#10b981" strokeDasharray="4 4" strokeWidth="1.5" />
                <circle cx={mapGraphT(tMeet)} cy={mapGraphX(xMeet)} r="7" fill="#10b981" stroke="#fff" strokeWidth="2" />
                <text x={mapGraphT(tMeet) + 8} y={mapGraphX(xMeet) - 8} fontSize="10.5" fontWeight="900" fill="#059669">
                  هم‌رسی ({tMeet.toFixed(1)}s, {xMeet.toFixed(0)}m)
                </text>
              </g>
            )}

            {/* Current time vertical scrubber */}
            <line x1={mapGraphT(t)} y1="22" x2={mapGraphT(t)} y2="198" stroke="#6366f1" strokeWidth="1.8" strokeDasharray="3 3" />
            <circle cx={mapGraphT(t)} cy={mapGraphX(xA)} r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />
            <circle cx={mapGraphT(t)} cy={mapGraphX(xB)} r="5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="x_A = v_A t + x_{0A}, \qquad x_B = v_B t + x_{0B}"
          substitutedTex={`x_A = (${vA})t + (${x0A}), \\quad x_B = (${vB})t + (${x0B}) \\;\\Rightarrow\\; ${
            tMeet !== null && tMeet >= 0
              ? `t_{\\text{هم‌رسی}} = ${tMeet.toFixed(2)}\\;\\text{s},\\; x = ${(x0A + vA * tMeet).toFixed(1)}\\;\\text{m}`
              : '\\text{به هم نمی‌رسند!}'
          }`}
          symbols={[
            { symbol: 'x_{0A}, x_{0B}', meaning: 'مکان اولیه متحرک‌های A و B در $t=0$', unit: 'm' },
            { symbol: 'v_A, v_B', meaning: 'سرعت ثابت (شیب خط در نمودار $x\\text{–}t$)', unit: 'm/s' },
            { symbol: 't_{\\text{هم‌رسی}}', meaning: 'لحظه تقاطع دو خط ($x_A = x_B$)', unit: 's' },
          ]}
          insight="هر زمان دو خط در نمودار x–t موازی باشند (vA = vB) فاصله بین دو خودرو همیشه ثابت می‌ماند و هرگز به هم نمی‌رسند!"
        />
      }
      controls={
        <>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (t >= 12) setT(0);
                setPlaying((p) => !p);
              }}
              className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold cursor-pointer"
            >
              {playing ? 'توقف حرکت' : 'پخش انیمیشن حرکت'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setT(0);
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              ریست t=0
            </button>
          </div>
          <SliderControl label="زمان لحظه‌ای" symbol="t" value={t} min={0} max={12} step={0.1} unit="s" accentClass="text-indigo-600" onChange={(v) => { setPlaying(false); setT(v); }} />
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <SliderControl label="مکان اولیه A" symbol="x_{0A}" value={x0A} min={-100} max={100} step={5} unit="m" accentClass="text-cyan-600" onChange={setX0A} />
            <SliderControl label="سرعت ثابت A" symbol="v_A" value={vA} min={-20} max={20} step={1} unit="m/s" accentClass="text-cyan-600" onChange={setVA} />
            <SliderControl label="مکان اولیه B" symbol="x_{0B}" value={x0B} min={-100} max={100} step={5} unit="m" accentClass="text-rose-500" onChange={setX0B} />
            <SliderControl label="سرعت ثابت B" symbol="v_B" value={vB} min={-20} max={20} step={1} unit="m/s" accentClass="text-rose-500" onChange={setVB} />
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard
            label="زمان هم‌رسی (t)"
            value={tMeet !== null && tMeet >= 0 ? tMeet.toFixed(2) : 'هرگز'}
            unit={tMeet !== null && tMeet >= 0 ? 's' : ''}
            color="emerald"
          />
          <MetricCard
            label="فاصله فعلی |xB − xA|"
            value={Math.abs(xB - xA).toFixed(1)}
            unit="m"
            sublabel={`در لحظه t = ${t.toFixed(1)} s`}
            color="indigo"
          />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-3: Constant Acceleration (Car + 3 Synced Graphs x-t, v-t, a-t)
   ========================================================= */
export const Lab1_3: React.FC = () => {
  const [x0, setX0] = useState(0);
  const [v0, setV0] = useState(-8);
  const [a, setA] = useState(2);
  const [t, setT] = useState(6);
  const [playing, setPlaying] = useState(false);

  const tMax = 10;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setT((prev) => {
        if (prev >= tMax) {
          setPlaying(false);
          return tMax;
        }
        return Number((prev + 0.1).toFixed(2));
      });
    }, 50);
    return () => window.clearInterval(id);
  }, [playing]);

  const v = v0 + a * t;
  const x = 0.5 * a * t * t + v0 * t + x0;
  const dx = x - x0;
  const vAv = (v0 + v) / 2;

  // Turning point tTurn where v=0
  const tTurn = Math.abs(a) > 1e-6 ? -v0 / a : null;
  const turnedInWindow = tTurn !== null && tTurn > 0 && tTurn < t;
  const xTurn = tTurn !== null ? 0.5 * a * tTurn * tTurn + v0 * tTurn + x0 : x0;
  const totalDist = turnedInWindow ? Math.abs(xTurn - x0) + Math.abs(x - xTurn) : Math.abs(dx);

  const motionType =
    Math.abs(a) < 1e-6
      ? 'سرعت ثابت (a = 0)'
      : Math.abs(v) < 0.05
      ? 'لحظه توقف و تغییر جهت (v = 0)!'
      : v * a > 0
      ? `تندشونده در جهت ${v > 0 ? '+x' : '−x'} (v·a > 0)`
      : `کُندشونده در جهت ${v > 0 ? '+x' : '−x'} (v·a < 0)`;

  // Graph scaling
  const mapT = (tt: number) => 42 + (tt / tMax) * 165;
  const xSamples = Array.from({ length: 51 }, (_, i) => {
    const tt = (i / 50) * tMax;
    return 0.5 * a * tt * tt + v0 * tt + x0;
  });
  const maxAbsX = Math.max(25, ...xSamples.map((val) => Math.abs(val)));
  const mapX = (xx: number) => 85 - (xx / maxAbsX) * 65;

  const vSamples = [v0, v0 + a * tMax];
  const maxAbsV = Math.max(12, ...vSamples.map((val) => Math.abs(val)));
  const mapV = (vv: number) => 85 - (vv / maxAbsV) * 65;

  const xPoly = xSamples
    .map((xx, i) => `${mapT((i / 50) * tMax).toFixed(1)},${mapX(xx).toFixed(1)}`)
    .join(' ');

  // Area polygon under v-t from 0 to t
  const vAreaPoints = (() => {
    if (turnedInWindow && tTurn !== null) {
      return {
        part1: `${mapT(0)},${mapV(0)} ${mapT(0)},${mapV(v0)} ${mapT(tTurn)},${mapV(0)}`,
        part2: `${mapT(tTurn)},${mapV(0)} ${mapT(t)},${mapV(v)} ${mapT(t)},${mapV(0)}`,
      };
    }
    return {
      part1: `${mapT(0)},${mapV(0)} ${mapT(0)},${mapV(v0)} ${mapT(t)},${mapV(v)} ${mapT(t)},${mapV(0)}`,
      part2: null,
    };
  })();

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-cyan-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          {/* Status badge + Preset buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                v * a > 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : v * a < 0
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
              }`}
            >
              {motionType}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => { setX0(0); setV0(16); setA(-4); setT(4); setPlaying(false); }}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold cursor-pointer hover:border-cyan-400"
              >
                ترمز تا توقف
              </button>
              <button
                type="button"
                onClick={() => { setX0(0); setV0(-8); setA(2); setT(8); setPlaying(false); }}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold cursor-pointer hover:border-cyan-400"
              >
                تغییر جهت حرکت
              </button>
              <button
                type="button"
                onClick={() => { setX0(10); setV0(-2); setA(-3); setT(5); setPlaying(false); }}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold cursor-pointer hover:border-cyan-400"
              >
                تندشونده منفی
              </button>
            </div>
          </div>

          {/* Side-by-side x-t and v-t charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* x-t parabola */}
            <svg viewBox="0 0 225 170" className="w-full h-auto rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
              <text x="115" y="15" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0284c7">
                نمودار مکان–زمان (سهمی x-t)
              </text>
              <line x1="42" y1="85" x2="212" y2="85" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="42" y1="155" x2="42" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="215" y="88" fontSize="9" className="fill-slate-500">t</text>
              <text x="26" y="25" fontSize="9" className="fill-slate-500">x</text>
              <polyline points={xPoly} fill="none" stroke="#0284c7" strokeWidth="2.8" />
              {turnedInWindow && tTurn !== null && (
                <circle cx={mapT(tTurn)} cy={mapX(xTurn)} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
              )}
              <line x1={mapT(t)} y1="22" x2={mapT(t)} y2="152" stroke="#6366f1" strokeDasharray="3 3" strokeWidth="1.2" />
              <circle cx={mapT(t)} cy={mapX(x)} r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.8" />
              <text x="115" y="164" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
                x({t.toFixed(1)}s) = {x.toFixed(1)} m
              </text>
            </svg>

            {/* v-t line with signed area = displacement */}
            <svg viewBox="0 0 225 170" className="w-full h-auto rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
              <text x="115" y="15" textAnchor="middle" fontSize="10" fontWeight="800" fill="#7c3aed">
                نمودار سرعت–زمان (مساحت = Δx)
              </text>
              <line x1="42" y1="85" x2="212" y2="85" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="42" y1="155" x2="42" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="215" y="88" fontSize="9" className="fill-slate-500">t</text>
              <text x="26" y="25" fontSize="9" className="fill-slate-500">v</text>

              {/* Shaded Area */}
              <polygon
                points={vAreaPoints.part1}
                fill={v0 >= 0 ? '#10b981' : '#f43f5e'}
                fillOpacity="0.28"
              />
              {vAreaPoints.part2 && (
                <polygon
                  points={vAreaPoints.part2}
                  fill={v >= 0 ? '#10b981' : '#f43f5e'}
                  fillOpacity="0.28"
                />
              )}

              <line
                x1={mapT(0)}
                y1={mapV(v0)}
                x2={mapT(tMax)}
                y2={mapV(v0 + a * tMax)}
                stroke="#7c3aed"
                strokeWidth="2.8"
              />
              <circle cx={mapT(t)} cy={mapV(v)} r="5" fill="#7c3aed" stroke="#fff" strokeWidth="1.8" />
              <text x="115" y="164" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
                v({t.toFixed(1)}s) = {v.toFixed(1)} m/s | شیب = {a} m/s²
              </text>
            </svg>
          </div>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\begin{aligned} v &= at + v_0, \qquad x = \tfrac{1}{2}at^2 + v_0 t + x_0 \\ v^2 - v_0^2 &= 2a\Delta x \end{aligned}"
          substitutedTex={`\\begin{aligned} v &= (${a})(${t.toFixed(1)}) + (${v0}) = ${v.toFixed(1)}\\;\\text{m/s} \\\\ \\Delta x &= \\tfrac{1}{2}(${a})(${t.toFixed(1)})^2 + (${v0})(${t.toFixed(1)}) = ${dx.toFixed(1)}\\;\\text{m} \\end{aligned}`}
          symbols={[
            { symbol: 'x_0, v_0', meaning: 'مکان اولیه و سرعت اولیه در لحظه $t=0$', unit: 'm, m/s' },
            { symbol: 'a', meaning: 'شتاب ثابت (شیب خط $v\\text{–}t$)', unit: 'm/s²' },
            { symbol: '\\Delta x', meaning: 'جابه‌جایی (= مساحت جبری زیر نمودار $v\\text{–}t$)', unit: 'm' },
            { symbol: 'v_{\\text{av}}', meaning: 'سرعت متوسط ($\\frac{v+v_0}{2}$)', unit: 'm/s' },
          ]}
          insight={
            turnedInWindow && tTurn !== null
              ? `متحرک در لحظه t = ${tTurn.toFixed(2)} s تغییر جهت داده است! مساحت قرمز (زیر محور t) منفی و مساحت سبز مثبت است؛ به همین دلیل مسافت (${totalDist.toFixed(1)} m) از اندازه جابه‌جایی (${Math.abs(dx).toFixed(1)} m) بیشتر شد!`
              : 'مقادیر منفی v₀ و a را با هم امتحان کنید تا ببینید چگونه با وجود منفی بودن شتاب، سرعت به محور t دور می‌شود و حرکت تندشونده است!'
          }
        />
      }
      controls={
        <>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (t >= tMax) setT(0);
                setPlaying((p) => !p);
              }}
              className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold cursor-pointer"
            >
              {playing ? 'توقف زمان' : 'پخش حرکت'}
            </button>
            <button
              type="button"
              onClick={() => { setPlaying(false); setT(0); }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              t = 0
            </button>
          </div>
          <SliderControl label="زمان" symbol="t" value={t} min={0} max={tMax} step={0.1} unit="s" accentClass="text-indigo-600" onChange={(val) => { setPlaying(false); setT(val); }} />
          <SliderControl label="شتاب ثابت" symbol="a" value={a} min={-6} max={6} step={0.5} unit="m/s²" accentClass="text-violet-600" onChange={setA} />
          <SliderControl label="سرعت اولیه" symbol="v_0" value={v0} min={-20} max={20} step={1} unit="m/s" accentClass="text-cyan-600" onChange={setV0} />
          <SliderControl label="مکان اولیه" symbol="x_0" value={x0} min={-20} max={20} step={2} unit="m" accentClass="text-emerald-600" onChange={setX0} />
        </>
      }
      metrics={
        <>
          <MetricCard label="جابه‌جایی (Δx)" value={dx.toFixed(1)} unit="m" sublabel={`مسافت کل l = ${totalDist.toFixed(1)} m`} color="cyan" />
          <MetricCard label="سرعت متوسط (v_av)" value={vAv.toFixed(1)} unit="m/s" sublabel={`سرعت لحظه‌ای v = ${v.toFixed(1)} m/s`} color="violet" />
        </>
      }
    />
  );
};
