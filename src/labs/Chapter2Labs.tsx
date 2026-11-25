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
   LAB 2-1: Newton's Three Laws (F=ma, 2D perp, Action-Reaction Skaters)
   ========================================================= */
export const Lab2_1: React.FC = () => {
  const [mode, setMode] = useState<'second' | 'third'>('second');

  // Mode 1: F_net = m a (with horizontal F_push, F_resist, and optional vertical Fy)
  const [m, setM] = useState(4);
  const [fPush, setFPush] = useState(20);
  const [fResist, setFResist] = useState(8);
  const [fPerp, setFPerp] = useState(0);

  // Mode 2: Two ice skaters pushing off (Example 2-3)
  const [m1, setM1] = useState(75);
  const [m2, setM2] = useState(50);
  const [fPair, setFPair] = useState(150);
  const [sep, setSep] = useState(0);
  const [pushing, setPushing] = useState(false);

  useEffect(() => {
    if (!pushing) return;
    const id = window.setInterval(() => {
      setSep((prev) => {
        if (prev >= 100) {
          setPushing(false);
          return 100;
        }
        return prev + 4;
      });
    }, 35);
    return () => window.clearInterval(id);
  }, [pushing]);

  const fx = fPush - fResist;
  const fNet = Math.hypot(fx, fPerp);
  const aMag = fNet / m;
  const ax = fx / m;
  const ay = fPerp / m;

  const a1 = -fPair / m1;
  const a2 = fPair / m2;
  const shift1 = (sep / 100) * Math.min(115, Math.abs(a1) * 32);
  const shift2 = (sep / 100) * Math.min(115, Math.abs(a2) * 32);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'second', label: 'قانون اول و دوم نیوتون (F=ma)' },
                { value: 'third', label: 'قانون سوم (دو اسکیت‌سوار)' },
              ]}
            />
          </div>

          {mode === 'second' ? (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Frictionless surface */}
              <rect x="20" y="165" width="420" height="14" rx="4" className="fill-cyan-100 dark:fill-slate-800 stroke-cyan-300 dark:stroke-slate-700" />
              <text x="230" y="196" textAnchor="middle" fontSize="10.5" fontWeight="700" className="fill-slate-500">
                سطح افقی بدون اصطکاک (یا نمای بالا برای نیروهای عمود بر هم)
              </text>

              {/* Center block */}
              <g transform="translate(230, 130)">
                <rect x="-36" y="-34" width="72" height="68" rx="12" fill="#059669" stroke="#065f46" strokeWidth="2.5" />
                <text x="0" y="5" textAnchor="middle" fontSize="15" fontWeight="900" fill="white">
                  {m} kg
                </text>

                {/* Push force (Right) */}
                {fPush > 0 && (
                  <g>
                    <line x1="36" y1="0" x2={36 + fPush * 3.8} y2="0" stroke="#0284c7" strokeWidth="4" />
                    <polygon points={`${44 + fPush * 3.8},0 ${34 + fPush * 3.8},-6 ${34 + fPush * 3.8},6`} fill="#0284c7" />
                    <text x={44 + fPush * 2} y="-10" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#0284c7">
                      F₁ = {fPush} N
                    </text>
                  </g>
                )}

                {/* Resist force (Left) */}
                {fResist > 0 && (
                  <g>
                    <line x1="-36" y1="0" x2={-36 - fResist * 3.8} y2="0" stroke="#e11d48" strokeWidth="4" />
                    <polygon points={`${-44 - fResist * 3.8},0 ${-34 - fResist * 3.8},-6 ${-34 - fResist * 3.8},6`} fill="#e11d48" />
                    <text x={-44 - fResist * 2} y="-10" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#e11d48">
                      F₂ = {fResist} N
                    </text>
                  </g>
                )}

                {/* Perpendicular force (Up) */}
                {fPerp > 0 && (
                  <g>
                    <line x1="0" y1="-34" x2="0" y2={-34 - fPerp * 3.2} stroke="#8b5cf6" strokeWidth="4" />
                    <polygon points={`0,${-42 - fPerp * 3.2} -6,${-32 - fPerp * 3.2} 6,${-32 - fPerp * 3.2}`} fill="#8b5cf6" />
                    <text x="48" y={-36 - fPerp * 1.6} fontSize="10.5" fontWeight="900" fill="#7c3aed">
                      Fy = {fPerp} N
                    </text>
                  </g>
                )}

                {/* Net Force & Acceleration Arrow */}
                {fNet > 0.1 && (
                  <g>
                    <line
                      x1="0"
                      y1="0"
                      x2={(fx / fNet) * Math.min(95, fNet * 3.2)}
                      y2={(-fPerp / fNet) * Math.min(85, fNet * 3.2)}
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeDasharray="6 3"
                    />
                    <circle
                      cx={(fx / fNet) * Math.min(95, fNet * 3.2)}
                      cy={(-fPerp / fNet) * Math.min(85, fNet * 3.2)}
                      r="5"
                      fill="#f59e0b"
                    />
                  </g>
                )}
              </g>

              <text x="230" y="24" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={fNet < 0.05 ? '#059669' : '#d97706'}>
                {fNet < 0.05
                  ? 'نیروها متوازن‌اند (F_net = 0) ← قانون اول نیوتون: شتاب صفر (سکون یا سرعت ثابت)!'
                  : `نیروی خالص F_net = ${fNet.toFixed(1)} N ← شتاب هم‌جهت با نیروی خالص: a = ${aMag.toFixed(2)} m/s²`}
              </text>
            </svg>
          ) : (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              <rect x="20" y="160" width="420" height="16" rx="6" className="fill-sky-100 dark:fill-slate-800 stroke-sky-300 dark:stroke-slate-700" />
              <line x1="230" y1="35" x2="230" y2="176" stroke="#94a3b8" strokeDasharray="4 4" />

              {/* Skater 1 (Left) */}
              <g transform={`translate(${185 - shift1}, 122)`}>
                <rect x="-28" y="-26" width="56" height="60" rx="12" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                <text x="0" y="-2" textAnchor="middle" fontSize="12" fontWeight="900" fill="white">نفر ۱</text>
                <text x="0" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#e0f2fe">{m1} kg</text>
                {/* Force F21 pointing Left */}
                <line x1="-28" y1="4" x2="-74" y2="4" stroke="#ef4444" strokeWidth="3.5" />
                <polygon points="-82,4 -71,-2 -71,10" fill="#ef4444" />
                <text x="-54" y="-6" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ef4444">F₂₁={fPair}N</text>
                <text x="0" y="-36" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0284c7">
                  a₁ = {a1.toFixed(2)} m/s²
                </text>
              </g>

              {/* Skater 2 (Right) */}
              <g transform={`translate(${275 + shift2}, 122)`}>
                <rect x="-28" y="-26" width="56" height="60" rx="12" fill="#10b981" stroke="#047857" strokeWidth="2" />
                <text x="0" y="-2" textAnchor="middle" fontSize="12" fontWeight="900" fill="white">نفر ۲</text>
                <text x="0" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#d1fae5">{m2} kg</text>
                {/* Force F12 pointing Right */}
                <line x1="28" y1="4" x2="74" y2="4" stroke="#ef4444" strokeWidth="3.5" />
                <polygon points="82,4 71,-2 71,10" fill="#ef4444" />
                <text x="54" y="-6" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ef4444">F₁₂={fPair}N</text>
                <text x="0" y="-36" textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">
                  a₂ = +{a2.toFixed(2)} m/s²
                </text>
              </g>

              <text x="230" y="24" textAnchor="middle" fontSize="11" fontWeight="900" className="fill-slate-700 dark:fill-slate-200">
                نیروهای کنش و واکنش دقیقاً هم‌اندازه‌اند ({fPair} N)، اما شخص سبک‌تر شتاب بیشتری می‌گیرد!
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        mode === 'second' ? (
          <LiveFormulaCard
            formulaTex="F_{\text{net}} = \sqrt{(F_1 - F_2)^2 + F_y^2}, \qquad a = \frac{F_{\text{net}}}{m}"
            substitutedTex={`F_{\\text{net}} = \\sqrt{(${fx})^2 + (${fPerp})^2} = ${fNet.toFixed(1)}\\;\\text{N} \\;\\Rightarrow\\; a = \\frac{${fNet.toFixed(1)}}{${m}} = ${aMag.toFixed(2)}\\;\\text{m/s}^2`}
            symbols={[
              { symbol: 'F_{\\text{net}}', meaning: 'برآیند نیروهای وارد بر جسم', unit: 'N' },
              { symbol: 'm', meaning: 'جرم جسم (معیار لختی)', unit: 'kg' },
              { symbol: 'a', meaning: 'بزرگی شتاب (هم‌جهت با $F_{\\text{net}}$)', unit: 'm/s²' },
            ]}
            insight="برای تست کردن قانون اول نیوتون، F₁ و F₂ را برابر و Fy را صفر کنید؛ برای تمرین مثال ۲-۲ کتاب، Fy را غیرصفر کنید!"
          />
        ) : (
          <LiveFormulaCard
            formulaTex="\vec{F}_{12} = -\vec{F}_{21}, \qquad \frac{|a_1|}{|a_2|} = \frac{m_2}{m_1}"
            substitutedTex={`|a_1| = \\frac{${fPair}}{${m1}} = ${Math.abs(a1).toFixed(2)}\\;\\text{m/s}^2, \\qquad |a_2| = \\frac{${fPair}}{${m2}} = ${a2.toFixed(2)}\\;\\text{m/s}^2`}
            symbols={[
              { symbol: '\\vec{F}_{12}, \\vec{F}_{21}', meaning: 'نیروهای کنش و واکنش (هم‌اندازه و خلاف جهت)', unit: 'N' },
              { symbol: 'm_1, m_2', meaning: 'جرم اسکیت‌سوار اول و دوم', unit: 'kg' },
              { symbol: 'a_1, a_2', meaning: 'شتاب هر اسکیت‌سوار در لحظه هل دادن', unit: 'm/s²' },
            ]}
            insight="چون نیروهای کنش و واکنش به دو جسم جداگانه وارد می‌شوند، یکدیگر را خنثی نمی‌کنند و باعث شتاب گرفتن هر دو نفر در دو جهت مخالف می‌شوند."
          />
        )
      }
      controls={
        mode === 'second' ? (
          <>
            <SliderControl label="جرم جسم" symbol="m" value={m} min={1} max={20} step={0.5} unit="kg" accentClass="text-emerald-600" onChange={setM} />
            <SliderControl label="نیروی راست (پیشران)" symbol="F_1" value={fPush} min={0} max={30} unit="N" accentClass="text-cyan-600" onChange={setFPush} />
            <SliderControl label="نیروی چپ (مقاومت)" symbol="F_2" value={fResist} min={0} max={30} unit="N" accentClass="text-rose-500" onChange={setFResist} />
            <SliderControl label="نیروی عمودی اضافه" symbol="F_y" value={fPerp} min={0} max={25} unit="N" accentClass="text-violet-600" onChange={setFPerp} />
          </>
        ) : (
          <>
            <SliderControl label="جرم نفر ۱" symbol="m_1" value={m1} min={30} max={120} step={5} unit="kg" accentClass="text-cyan-600" onChange={setM1} />
            <SliderControl label="جرم نفر ۲" symbol="m_2" value={m2} min={30} max={120} step={5} unit="kg" accentClass="text-emerald-600" onChange={setM2} />
            <SliderControl label="نیروی متقابل هل دادن" symbol="F" value={fPair} min={50} max={300} step={10} unit="N" accentClass="text-rose-500" onChange={setFPair} />
            <button
              type="button"
              onClick={() => { setSep(0); setPushing(true); }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
            >
              اجرای حرکت هل دادن روی یخ!
            </button>
          </>
        )
      }
      metrics={
        mode === 'second' ? (
          <>
            <MetricCard label="نیروی خالص (F_net)" value={fNet.toFixed(1)} unit="N" sublabel={`Fx=${fx} N, Fy=${fPerp} N`} color="emerald" />
            <MetricCard label="بزرگی شتاب (a)" value={aMag.toFixed(2)} unit="m/s²" sublabel={`ax=${ax.toFixed(1)}, ay=${ay.toFixed(1)}`} color="amber" />
          </>
        ) : (
          <>
            <MetricCard label="شتاب نفر ۱ (|a₁|)" value={Math.abs(a1).toFixed(2)} unit="m/s²" color="cyan" />
            <MetricCard label="شتاب نفر ۲ (|a₂|)" value={a2.toFixed(2)} unit="m/s²" sublabel={`نسبت a₂/a₁ = ${(m1 / m2).toFixed(2)}`} color="emerald" />
          </>
        )
      }
    />
  );
};

/* =========================================================
   LAB 2-2: Special Forces (Friction + Graph, Elevator, Hooke's Spring, Drag/Terminal Velocity)
   ========================================================= */
export const Lab2_2: React.FC = () => {
  const [subMode, setSubMode] = useState<'friction' | 'elevator' | 'spring' | 'drag'>('friction');

  // 1. Friction state
  const [massF, setMassF] = useState(10);
  const [muS, setMuS] = useState(0.5);
  const [muK, setMuK] = useState(0.3);
  const [fApplied, setFApplied] = useState(35);

  // 2. Elevator state
  const [massE, setMassE] = useState(60);
  const [elevA, setElevA] = useState(2); // -10 (freefall) to +6

  // 3. Spring state (Hooke's law)
  const [kSpring, setKSpring] = useState(200); // N/m
  const [l0Cm, setL0Cm] = useState(10);
  const [massS, setMassS] = useState(1.2); // kg

  // 4. Drag / Skydiver state
  const [massD, setMassD] = useState(60);
  const [chuteOpen, setChuteOpen] = useState(false);
  const [vFall, setVFall] = useState(12); // m/s

  const g = 10;

  // Friction calcs
  const fnF = massF * g;
  const fsMax = muS * fnF;
  const fkVal = muK * fnF;
  const isMoving = fApplied > fsMax;
  const actualFriction = isMoving ? fkVal : fApplied;
  const accelF = isMoving ? (fApplied - fkVal) / massF : 0;
  const totalSurfaceR = Math.hypot(fnF, actualFriction);

  // Elevator calcs
  const wE = massE * g;
  const fnE = Math.max(0, massE * (g + elevA));

  // Spring calcs
  const fe = massS * g;
  const dxM = fe / kSpring;
  const dxCm = dxM * 100;
  const finalLCm = l0Cm + dxCm;

  // Drag calcs: fD = c * v^2, closed chute -> vT = sqrt(mg/0.25), open chute -> vT = sqrt(mg/24)
  const cDrag = chuteOpen ? 24 : 0.25;
  const wD = massD * g;
  const fDrag = cDrag * vFall * vFall;
  const aDrag = (wD - fDrag) / massD; // positive downward
  const vTerminal = Math.sqrt(wD / cDrag);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={subMode}
              onChange={setSubMode}
              options={[
                { value: 'friction', label: 'اصطکاک و نمودار f-F' },
                { value: 'elevator', label: 'آسانسور و وزن ظاهری' },
                { value: 'spring', label: 'فنر (قانون هوک)' },
                { value: 'drag', label: 'مقاومت هوا و تندی حدی' },
              ]}
            />
          </div>

          {subMode === 'friction' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Block FBD */}
              <svg viewBox="0 0 225 185" className="w-full h-auto rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <rect x="10" y="145" width="205" height="18" rx="4" className="fill-slate-300 dark:fill-slate-700" />
                <g transform="translate(112, 115)">
                  <rect x="-26" y="-26" width="52" height="52" rx="8" fill={isMoving ? '#f59e0b' : '#059669'} stroke="#0f172a" strokeWidth="1.8" />
                  <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="900" fill="white">{massF}kg</text>
                  {/* W down */}
                  <line x1="0" y1="26" x2="0" y2="62" stroke="#64748b" strokeWidth="2.5" />
                  <polygon points="0,68 -4,59 4,59" fill="#64748b" />
                  <text x="14" y="54" fontSize="9.5" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">W={fnF}N</text>
                  {/* FN up */}
                  <line x1="0" y1="-26" x2="0" y2="-66" stroke="#0284c7" strokeWidth="2.5" />
                  <polygon points="0,-72 -4,-63 4,-63" fill="#0284c7" />
                  <text x="14" y="-54" fontSize="9.5" fontWeight="800" fill="#0284c7">FN={fnF}N</text>
                  {/* F applied right */}
                  {fApplied > 0 && (
                    <>
                      <line x1="26" y1="0" x2={26 + Math.min(68, fApplied * 0.65)} y2="0" stroke="#10b981" strokeWidth="3.5" />
                      <polygon points={`${33 + Math.min(68, fApplied * 0.65)},0 ${25 + Math.min(68, fApplied * 0.65)},-5 ${25 + Math.min(68, fApplied * 0.65)},5`} fill="#10b981" />
                      <text x="58" y="-10" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#059669">F={fApplied}N</text>
                    </>
                  )}
                  {/* Friction left */}
                  {actualFriction > 0 && (
                    <>
                      <line x1="-26" y1="18" x2={-26 - Math.min(68, actualFriction * 0.65)} y2="18" stroke="#ef4444" strokeWidth="3.5" />
                      <polygon points={`${-33 - Math.min(68, actualFriction * 0.65)},18 ${-25 - Math.min(68, actualFriction * 0.65)},13 ${-25 - Math.min(68, actualFriction * 0.65)},23`} fill="#ef4444" />
                      <text x="-58" y="8" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#dc2626">
                        {isMoving ? 'fk' : 'fs'}={actualFriction.toFixed(0)}N
                      </text>
                    </>
                  )}
                </g>
                <text x="112" y="20" textAnchor="middle" fontSize="10" fontWeight="900" fill={isMoving ? '#d97706' : '#059669'}>
                  {isMoving ? `در حال لغزش! (a = ${accelF.toFixed(2)} m/s²)` : fApplied === fsMax ? 'دقیقاً در آستانه حرکت!' : 'ساکن (fs = F)'}
                </text>
              </svg>

              {/* Live f vs F characteristic curve */}
              <svg viewBox="0 0 225 185" className="w-full h-auto rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <text x="112" y="16" textAnchor="middle" fontSize="9.5" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                  نمودار نیروی اصطکاک برحسب نیروی کشنده (f–F)
                </text>
                <line x1="34" y1="150" x2="210" y2="150" stroke="#64748b" strokeWidth="1.8" />
                <line x1="34" y1="150" x2="34" y2="28" stroke="#64748b" strokeWidth="1.8" />
                <text x="212" y="153" fontSize="9" className="fill-slate-500">F</text>
                <text x="26" y="34" fontSize="9" className="fill-slate-500">f</text>

                {(() => {
                  const maxF = Math.max(120, fsMax * 1.45);
                  const mx = (val: number) => 34 + (Math.min(maxF, val) / maxF) * 168;
                  const my = (val: number) => 150 - (Math.min(maxF, val) / maxF) * 112;
                  return (
                    <>
                      {/* Static ramp */}
                      <line x1={mx(0)} y1={my(0)} x2={mx(fsMax)} y2={my(fsMax)} stroke="#10b981" strokeWidth="3" />
                      {/* Drop to kinetic */}
                      <line x1={mx(fsMax)} y1={my(fsMax)} x2={mx(fsMax)} y2={my(fkVal)} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1.8" />
                      {/* Kinetic plateau */}
                      <line x1={mx(fsMax)} y1={my(fkVal)} x2={mx(maxF)} y2={my(fkVal)} stroke="#f59e0b" strokeWidth="3" />
                      {/* Current state dot */}
                      <circle cx={mx(fApplied)} cy={my(actualFriction)} r="5.5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                      <text x={mx(fsMax)} y={my(fsMax) - 7} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#059669">
                        fs,max={fsMax.toFixed(0)}
                      </text>
                      <text x={mx(maxF) - 22} y={my(fkVal) - 6} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#d97706">
                        fk={fkVal.toFixed(0)}
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>
          )}

          {subMode === 'elevator' && (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Elevator shaft & cable */}
              <rect x="130" y="32" width="200" height="170" rx="14" className="fill-slate-100 dark:fill-slate-800/80 stroke-slate-400" strokeWidth="3" />
              {elevA > -9.9 ? (
                <line x1="230" y1="0" x2="230" y2="32" stroke="#475569" strokeWidth="4" />
              ) : (
                <text x="230" y="20" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ef4444">
                  کابل پاره شد! (سقوط آزاد)
                </text>
              )}

              {/* Scale at floor */}
              <rect x="180" y="176" width="100" height="22" rx="6" fill="#0f172a" />
              <text x="230" y="191" textAnchor="middle" fontSize="12" fontWeight="900" fill="#34d399">
                {fnE.toFixed(0)} N
              </text>

              {/* Person */}
              <circle cx="230" cy="86" r="16" fill="#0284c7" />
              <rect x="214" y="105" width="32" height="50" rx="10" fill="#0284c7" />
              <line x1="222" y1="155" x2="222" y2="176" stroke="#0284c7" strokeWidth="6" />
              <line x1="238" y1="155" x2="238" y2="176" stroke="#0284c7" strokeWidth="6" />

              {/* Force vectors on person */}
              <line x1="190" y1="125" x2="190" y2={125 + Math.min(55, wE / 18)} stroke="#ef4444" strokeWidth="3.5" />
              <text x="155" y="150" fontSize="10.5" fontWeight="900" fill="#ef4444">W={wE}N</text>

              {fnE > 1 && (
                <>
                  <line x1="270" y1="150" x2="270" y2={150 - Math.min(75, fnE / 14)} stroke="#10b981" strokeWidth="3.5" />
                  <text x="282" y="125" fontSize="10.5" fontWeight="900" fill="#059669">FN={fnE.toFixed(0)}N</text>
                </>
              )}

              {/* Acceleration vector */}
              {Math.abs(elevA) > 0.1 && (
                <g transform="translate(365, 115)">
                  <line x1="0" y1={elevA > 0 ? 28 : -28} x2="0" y2={elevA > 0 ? -28 : 28} stroke="#f59e0b" strokeWidth="4.5" />
                  <polygon
                    points={elevA > 0 ? '0,-38 -7,-24 7,-24' : '0,38 -7,24 7,24'}
                    fill="#f59e0b"
                  />
                  <text x="0" y={elevA > 0 ? -44 : 52} textAnchor="middle" fontSize="11" fontWeight="900" fill="#d97706">
                    a = {elevA > 0 ? `+${elevA}` : elevA} m/s²
                  </text>
                </g>
              )}

              <text x="65" y="115" textAnchor="middle" fontSize="11" fontWeight="900" className="fill-slate-700 dark:fill-slate-200">
                {elevA === 0 ? 'سکون / سرعت ثابت' : elevA > 0 ? 'احساس سنگینی!' : elevA <= -10 ? 'بی‌وزنی کامل!' : 'احساس سبکی!'}
              </text>
            </svg>
          )}

          {subMode === 'spring' && (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Ceiling */}
              <rect x="60" y="12" width="140" height="10" rx="3" fill="#475569" />
              {/* Spring coils */}
              {(() => {
                const restPx = 55;
                const stretchPx = Math.min(95, dxCm * 5.5);
                const endY = 22 + restPx + stretchPx;
                const coils = 9;
                const pts: string[] = ['130,22'];
                for (let i = 1; i <= coils; i++) {
                  const y = 22 + ((endY - 22) * i) / (coils + 1);
                  const x = i % 2 === 0 ? 114 : 146;
                  pts.push(`${x},${y.toFixed(1)}`);
                }
                pts.push(`130,${endY.toFixed(1)}`);
                return (
                  <>
                    <line x1="175" y1={22 + restPx} x2="205" y2={22 + restPx} stroke="#94a3b8" strokeDasharray="3 3" />
                    <text x="210" y={25 + restPx} fontSize="9.5" className="fill-slate-500">L₀ = {l0Cm} cm</text>
                    <polyline points={pts.join(' ')} fill="none" stroke="#059669" strokeWidth="3" strokeLinejoin="round" />
                    <rect x="108" y={endY} width="44" height="34" rx="8" fill="#0284c7" />
                    <text x="130" y={endY + 21} textAnchor="middle" fontSize="11" fontWeight="900" fill="white">
                      {massS.toFixed(1)} kg
                    </text>
                    <text x="65" y={endY + 18} textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">
                      x = {dxCm.toFixed(1)} cm
                    </text>
                  </>
                );
              })()}

              {/* F_e vs x graph on right */}
              <g transform="translate(260, 28)">
                <rect x="0" y="0" width="180" height="165" rx="12" className="fill-white/90 dark:fill-slate-900/90 stroke-slate-200 dark:stroke-slate-700" />
                <text x="90" y="18" textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">
                  نمودار قانون هوک (شیب = k)
                </text>
                <line x1="28" y1="140" x2="165" y2="140" stroke="#64748b" strokeWidth="1.5" />
                <line x1="28" y1="140" x2="28" y2="32" stroke="#64748b" strokeWidth="1.5" />
                <text x="167" y="143" fontSize="9" className="fill-slate-500">x</text>
                <text x="18" y="38" fontSize="9" className="fill-slate-500">Fe</text>
                <line
                  x1="28"
                  y1="140"
                  x2="155"
                  y2={Math.max(36, 140 - (kSpring / 500) * 100)}
                  stroke="#059669"
                  strokeWidth="3"
                />
                <text x="95" y="156" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
                  L = {finalLCm.toFixed(1)} cm | Fe = {fe.toFixed(1)} N
                </text>
              </g>
            </svg>
          )}

          {subMode === 'drag' && (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Parachute if open */}
              {chuteOpen && (
                <g transform="translate(230, 58)">
                  <path d="M -52 10 A 52 38 0 0 1 52 10 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
                  <line x1="-45" y1="10" x2="-8" y2="55" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="45" y1="10" x2="8" y2="55" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="0" y1="10" x2="0" y2="55" stroke="#64748b" strokeWidth="1.5" />
                </g>
              )}
              {/* Skydiver body */}
              <circle cx="230" cy="118" r="14" fill="#0284c7" stroke="#fff" strokeWidth="2" />
              <text x="230" y="122" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="white">{massD}kg</text>

              {/* Weight arrow down */}
              <line x1="230" y1="132" x2="230" y2={132 + Math.min(68, wD / 14)} stroke="#ef4444" strokeWidth="4" />
              <polygon points={`230,${138 + Math.min(68, wD / 14)} 224,${128 + Math.min(68, wD / 14)} 236,${128 + Math.min(68, wD / 14)}`} fill="#ef4444" />
              <text x="275" y="165" fontSize="11" fontWeight="900" fill="#ef4444">W = {wD} N</text>

              {/* Drag arrow up */}
              {fDrag > 1 && (
                <>
                  <line x1="205" y1="118" x2="205" y2={Math.max(24, 118 - Math.min(82, fDrag / 14))} stroke="#10b981" strokeWidth="4" />
                  <polygon
                    points={`205,${Math.max(16, 112 - Math.min(82, fDrag / 14))} 199,${Math.max(26, 122 - Math.min(82, fDrag / 14))} 211,${Math.max(26, 122 - Math.min(82, fDrag / 14))}`}
                    fill="#10b981"
                  />
                  <text x="148" y="88" textAnchor="middle" fontSize="11" fontWeight="900" fill="#059669">
                    fD = {fDrag.toFixed(0)} N
                  </text>
                </>
              )}

              <text x="230" y="212" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                {Math.abs(aDrag) < 0.25
                  ? `تندی حدی برقرار شد! (fD ≈ W ← شتاب صفر و vT ≈ ${vTerminal.toFixed(1)} m/s)`
                  : aDrag > 0
                  ? 'وزن بیشتر از مقاومت هواست ← سقوط تندشونده رو به پایین!'
                  : 'مقاومت هوا بیشتر از وزن است (مثل لحظه باز شدن چتر!) ← شتاب رو به بالا (کُندشونده)!'}
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        subMode === 'friction' ? (
          <LiveFormulaCard
            formulaTex="f_{s,\max} = \mu_s F_N, \qquad f_k = \mu_k F_N, \qquad R = \sqrt{F_N^2 + f^2}"
            substitutedTex={`f_{s,\\max} = (${muS})(${fnF}) = ${fsMax.toFixed(1)}\\;\\text{N}, \\quad f_k = ${fkVal.toFixed(1)}\\;\\text{N} \\;\\Rightarrow\\; f = ${actualFriction.toFixed(1)}\\;\\text{N}`}
            symbols={[
              { symbol: '\\mu_s, \\mu_k', meaning: 'ضریب اصطکاک ایستایی و جنبشی ($\\mu_k \\le \\mu_s$)', unit: 'بدون یکا' },
              { symbol: 'F_N', meaning: 'نیروی عمودی تکیه‌گاه ($= mg$ روی سطح افقی)', unit: 'N' },
              { symbol: 'R', meaning: 'برآیند کل نیروی وارد از سطح به جسم', unit: 'N' },
            ]}
            insight="وقتی $F$ از $f_{s,\\max}$ عبور کند، نقطه قرمز ناگهان از قله اصطکاک ایستایی به خط افقی اصطکاک جنبشی ($f_k$) سقوط می‌کند!"
          />
        ) : subMode === 'elevator' ? (
          <LiveFormulaCard
            formulaTex="F_N - W = m a \quad \Longrightarrow \quad F_N = m(g + a)"
            substitutedTex={`F_N = ${massE}(10 + (${elevA})) = ${fnE.toFixed(0)}\\;\\text{N} \\qquad (W = ${wE}\\;\\text{N})`}
            symbols={[
              { symbol: 'F_N', meaning: 'نیروی عمودی کف آسانسور (= عددی که ترازو نشان می‌دهد)', unit: 'N' },
              { symbol: 'W = mg', meaning: 'وزن واقعی شخص (ثابت)', unit: 'N' },
              { symbol: 'a', meaning: 'شتاب آسانسور ($+$ رو به بالا، $-$ رو به پایین)', unit: 'm/s²' },
            ]}
            insight="شتاب را روی −10 m/s² (سقوط آزاد) بگذارید تا بی‌وزنی کامل (FN = 0) را ببینید!"
          />
        ) : subMode === 'spring' ? (
          <LiveFormulaCard
            formulaTex="F_e = k x = k(L - L_0) = mg"
            substitutedTex={`x = \\frac{mg}{k} = \\frac{${fe.toFixed(1)}}{${kSpring}} = ${dxM.toFixed(3)}\\;\\text{m} = ${dxCm.toFixed(1)}\\;\\text{cm} \\;\\Rightarrow\\; L = ${finalLCm.toFixed(1)}\\;\\text{cm}`}
            symbols={[
              { symbol: 'F_e', meaning: 'نیروی کشسانی فنر (همواره رو به نقطه تعادل)', unit: 'N' },
              { symbol: 'k', meaning: 'ثابت فنر (شیب نمودار $F_e\\text{–}x$)', unit: 'N/m' },
              { symbol: 'x', meaning: 'تغییر طول فنر نسبت به طول عادی $L_0$', unit: 'm' },
            ]}
            insight="ثابت فنر k را زیاد کنید تا ببینید فنر سفت‌تر می‌شود، شیب نمودار تندتر می‌شود و با همان وزنه کمتر کش می‌آید."
          />
        ) : (
          <LiveFormulaCard
            formulaTex="mg - f_D = ma \;\; \xrightarrow{a=0} \;\; f_D = mg \;\; (\text{تندی حدی } v_T)"
            substitutedTex={`a = \\frac{${wD} - ${fDrag.toFixed(0)}}{${massD}} = ${aDrag.toFixed(2)}\\;\\text{m/s}^2, \\qquad v_T \\approx ${vTerminal.toFixed(1)}\\;\\text{m/s}`}
            symbols={[
              { symbol: 'W = mg', meaning: 'نیروی وزن رو به پایین', unit: 'N' },
              { symbol: 'f_D', meaning: 'نیروی مقاومت هوا رو به بالا (متناسب با سطح مقطع و تندی)', unit: 'N' },
              { symbol: 'v_T', meaning: 'تندی حدی (وقتی $f_D = mg$ شود)', unit: 'm/s' },
            ]}
            insight="در تندی بالا (مثلاً 15 m/s) چتر را باز کنید: نیروی مقاومت هوا ناگهان از وزن بیشتر شده و شتاب رو به بالا (کُندشونده) ایجاد می‌شود (مثال ۲-۴ کتاب)!"
          />
        )
      }
      controls={
        subMode === 'friction' ? (
          <>
            <SliderControl label="جرم جعبه" symbol="m" value={massF} min={2} max={25} unit="kg" accentClass="text-emerald-600" onChange={setMassF} />
            <SliderControl
              label="ضریب اصطکاک ایستایی"
              symbol="\mu_s"
              value={muS}
              min={0.1}
              max={0.9}
              step={0.05}
              accentClass="text-cyan-600"
              onChange={(val) => {
                setMuS(val);
                if (muK > val) setMuK(val);
              }}
            />
            <SliderControl label="ضریب اصطکاک جنبشی" symbol="\mu_k" value={muK} min={0.05} max={muS} step={0.05} accentClass="text-amber-500" onChange={setMuK} />
            <SliderControl label="نیروی کشنده افقی" symbol="F" value={fApplied} min={0} max={180} step={2} unit="N" accentClass="text-rose-500" onChange={setFApplied} />
          </>
        ) : subMode === 'elevator' ? (
          <>
            <SliderControl label="جرم شخص" symbol="m" value={massE} min={30} max={100} step={5} unit="kg" accentClass="text-cyan-600" onChange={setMassE} />
            <SliderControl label="شتاب آسانسور (بالا +، پایین −)" symbol="a" value={elevA} min={-10} max={6} step={0.5} unit="m/s²" accentClass="text-emerald-600" onChange={setElevA} />
            <div className="grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => setElevA(2)} className="py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold cursor-pointer">شتاب بالا (+2)</button>
              <button type="button" onClick={() => setElevA(0)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">سرعت ثابت (0)</button>
              <button type="button" onClick={() => setElevA(-10)} className="py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] font-bold cursor-pointer">سقوط آزاد (-10)</button>
            </div>
          </>
        ) : subMode === 'spring' ? (
          <>
            <SliderControl label="ثابت فنر" symbol="k" value={kSpring} min={50} max={500} step={10} unit="N/m" accentClass="text-emerald-600" onChange={setKSpring} />
            <SliderControl label="طول عادی فنر" symbol="L_0" value={l0Cm} min={5} max={25} step={1} unit="cm" accentClass="text-slate-600" onChange={setL0Cm} />
            <SliderControl label="جرم وزنه آویزان" symbol="m" value={massS} min={0} max={4} step={0.2} unit="kg" accentClass="text-cyan-600" onChange={setMassS} />
          </>
        ) : (
          <>
            <SliderControl label="جرم چترباز" symbol="m" value={massD} min={40} max={100} step={5} unit="kg" accentClass="text-cyan-600" onChange={setMassD} />
            <SliderControl label="تندی لحظه‌ای سقوط" symbol="v" value={vFall} min={0} max={60} step={1} unit="m/s" accentClass="text-amber-500" onChange={setVFall} />
            <button
              type="button"
              onClick={() => setChuteOpen((o) => !o)}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold cursor-pointer text-white ${
                chuteOpen ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {chuteOpen ? 'بستن چتر نجات (سقوط آزاد سریع)' : 'باز کردن چتر نجات (افزایش شدید fD!)'}
            </button>
          </>
        )
      }
      metrics={
        subMode === 'friction' ? (
          <>
            <MetricCard label="نیروی اصطکاک فعلی" value={actualFriction.toFixed(1)} unit="N" sublabel={`کل نیروی سطح R = ${totalSurfaceR.toFixed(1)} N`} color="rose" />
            <MetricCard label="شتاب جسم (a)" value={accelF.toFixed(2)} unit="m/s²" sublabel={`fs,max = ${fsMax.toFixed(1)} N`} color="emerald" />
          </>
        ) : subMode === 'elevator' ? (
          <>
            <MetricCard label="عدد ترازو (FN)" value={fnE.toFixed(0)} unit="N" color="emerald" />
            <MetricCard label="وزن واقعی (mg)" value={wE.toFixed(0)} unit="N" sublabel={fnE > wE ? 'بیشتر از وزن' : fnE < wE ? 'کمتر از وزن' : 'برابر وزن'} color="indigo" />
          </>
        ) : subMode === 'spring' ? (
          <>
            <MetricCard label="تغییر طول (x)" value={dxCm.toFixed(2)} unit="cm" color="emerald" />
            <MetricCard label="طول نهایی فنر (L)" value={finalLCm.toFixed(2)} unit="cm" color="cyan" />
          </>
        ) : (
          <>
            <MetricCard label="شتاب فعلی (رو به پایین)" value={aDrag.toFixed(2)} unit="m/s²" color={aDrag < 0 ? 'amber' : 'cyan'} />
            <MetricCard label="تندی حدی (vT)" value={vTerminal.toFixed(1)} unit="m/s" color="emerald" />
          </>
        )
      }
    />
  );
};

/* =========================================================
   LAB 2-3: Momentum, Impulse & Force-Time Area (Collision Lab)
   ========================================================= */
export const Lab2_3: React.FC = () => {
  const [m, setM] = useState(0.5); // kg
  const [v1, setV1] = useState(16); // m/s toward wall (+x)
  const [v2, setV2] = useState(-12); // m/s rebound (-x) or 0 stop
  const [dtMs, setDtMs] = useState(50); // ms (collision time)

  const p1 = m * v1;
  const p2 = m * v2;
  const dp = p2 - p1;
  const dt = dtMs * 1e-3;
  const fAv = dp / dt;
  const k1 = (p1 * p1) / (2 * m);
  const k2 = (p2 * p2) / (2 * m);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Collision diagram */}
            <svg viewBox="0 0 225 180" className="w-full h-auto rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
              <text x="112" y="18" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                برخورد و تغییر تکانه (Δp = p₂ − p₁)
              </text>
              {/* Rigid wall */}
              <rect x="184" y="34" width="22" height="125" rx="4" fill="#475569" />
              {/* Before collision */}
              <circle cx="80" cy="68" r="16" fill="#0284c7" />
              <text x="80" y="72" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="white">قبل</text>
              <line x1="98" y1="68" x2="155" y2="68" stroke="#0284c7" strokeWidth="3.5" />
              <polygon points="163,68 153,63 153,73" fill="#0284c7" />
              <text x="128" y="58" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#0284c7">
                p₁ = +{p1.toFixed(1)}
              </text>

              {/* After collision */}
              <circle cx="115" cy="126" r="16" fill="#e11d48" />
              <text x="115" y="130" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="white">بعد</text>
              {Math.abs(v2) > 0.2 ? (
                <>
                  <line x1="97" y1="126" x2="42" y2="126" stroke="#e11d48" strokeWidth="3.5" />
                  <polygon points="34,126 44,121 44,131" fill="#e11d48" />
                  <text x="68" y="116" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#e11d48">
                    p₂ = {p2.toFixed(1)}
                  </text>
                </>
              ) : (
                <text x="58" y="130" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#e11d48">توقف (p₂=0)</text>
              )}

              <text x="100" y="168" textAnchor="middle" fontSize="10" fontWeight="900" fill="#d97706">
                |Δp| = {Math.abs(dp).toFixed(2)} kg·m/s
              </text>
            </svg>

            {/* Force-Time Curve (Figure 2-19) */}
            <svg viewBox="0 0 225 180" className="w-full h-auto rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
              <text x="112" y="18" textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">
                نمودار نیرو–زمان (مساحت = |Δp|)
              </text>
              <line x1="34" y1="145" x2="210" y2="145" stroke="#64748b" strokeWidth="1.5" />
              <line x1="34" y1="145" x2="34" y2="30" stroke="#64748b" strokeWidth="1.5" />
              <text x="212" y="148" fontSize="9" className="fill-slate-500">t</text>
              <text x="24" y="34" fontSize="9" className="fill-slate-500">F</text>

              {(() => {
                const wPx = Math.max(24, Math.min(150, (dtMs / 200) * 150));
                const hAvg = Math.max(18, Math.min(92, (Math.abs(fAv) / 1000) * 85));
                const xStart = 55;
                const xMid = xStart + wPx / 2;
                const xEnd = xStart + wPx;
                return (
                  <>
                    {/* Actual bell/triangle pulse with same area */}
                    <path
                      d={`M ${xStart} 145 Q ${xMid} ${Math.max(28, 145 - hAvg * 2)} ${xEnd} 145 Z`}
                      fill="#10b981"
                      fillOpacity="0.28"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />
                    {/* Equivalent F_av rectangle */}
                    <rect
                      x={xStart}
                      y={145 - hAvg}
                      width={wPx}
                      height={hAvg}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                    <text x={xMid} y={145 - hAvg - 6} textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#d97706">
                      Fav = {Math.abs(fAv).toFixed(0)} N
                    </text>
                    <text x={xMid} y="162" textAnchor="middle" fontSize="9" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
                      Δt = {dtMs} ms
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\begin{aligned} \vec{p} &= m\vec{v}, \qquad K = \frac{p^2}{2m} \\ F_{\text{av}} &= \frac{\Delta p}{\Delta t} = \frac{m(v_2 - v_1)}{\Delta t} \end{aligned}"
          substitutedTex={`\\begin{aligned} \\Delta p &= ${m}((${v2}) - (${v1})) = ${dp.toFixed(2)}\\;\\text{kg}\\cdot\\text{m/s} \\\\ F_{\\text{av}} &= \\frac{${dp.toFixed(2)}}{${dt.toFixed(3)}} = ${fAv.toFixed(0)}\\;\\text{N} \\end{aligned}`}
          symbols={[
            { symbol: '\\vec{p}', meaning: 'تکانه جسم (هم‌جهت با سرعت)', unit: 'kg·m/s' },
            { symbol: '\\Delta p', meaning: 'تغییر تکانه (= مساحت زیر نمودار $F\\text{–}t$)', unit: 'kg·m/s' },
            { symbol: 'F_{\\text{av}}', meaning: 'نیروی خالص متوسط برخورد', unit: 'N' },
            { symbol: '\\Delta t', meaning: 'مدت زمان تماس (کیسه هوا آن را زیاد می‌کند!)', unit: 's' },
          ]}
          insight="زمان برخورد Δt را (مثل اثر کیسه هوا) از 20 ms به 200 ms افزایش دهید: مساحت زیر نمودار (|Δp|) ثابت می‌ماند اما نیروی مخرب Fav ده برابر کمتر می‌شود!"
        />
      }
      controls={
        <>
          <SliderControl label="جرم جسم" symbol="m" value={m} min={0.1} max={5} step={0.1} unit="kg" accentClass="text-emerald-600" onChange={setM} />
          <SliderControl label="سرعت برخورد به دیوار (+)" symbol="v_1" value={v1} min={2} max={30} step={1} unit="m/s" accentClass="text-cyan-600" onChange={setV1} />
          <SliderControl label="سرعت پس از برخورد (منفی=برگشت)" symbol="v_2" value={v2} min={-25} max={0} step={1} unit="m/s" accentClass="text-rose-500" onChange={setV2} />
          <SliderControl label="مدت زمان برخورد (اثر کیسه هوا)" symbol="\Delta t" value={dtMs} min={10} max={200} step={5} unit="ms" accentClass="text-amber-500" onChange={setDtMs} />
        </>
      }
      metrics={
        <>
          <MetricCard label="نیروی متوسط |F_av|" value={Math.abs(fAv).toFixed(0)} unit="N" color="rose" />
          <MetricCard label="انرژی جنبشی قبل ← بعد" value={`${k1.toFixed(1)} → ${k2.toFixed(1)}`} unit="J" sublabel="K = p²/(2m)" color="emerald" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 2-4: Universal Gravitation & Altitude Satellite Lab
   ========================================================= */
export const Lab2_4: React.FC = () => {
  const [mode, setMode] = useState<'orbit' | 'pair'>('orbit');

  // Mode 1: Earth & Satellite at altitude h
  const Re = 6400; // km
  const g0 = 9.8; // m/s^2
  const [hKm, setHKm] = useState(2600); // km (Example 2-15!)
  const [mSat, setMSat] = useState(200); // kg

  // Mode 2: Two general masses
  const [m1, setM1] = useState(80);
  const [m2, setM2] = useState(120);
  const [rPair, setRPair] = useState(1.0);

  const G = 6.67e-11;
  const rTotal = Re + hKm;
  const ratio = Math.pow(Re / rTotal, 2);
  const gH = g0 * ratio;
  const w0 = mSat * g0;
  const wH = mSat * gH;

  const fPair = (G * m1 * m2) / (rPair * rPair);

  // Inverse-square graph points
  const curvePts = Array.from({ length: 41 }, (_, i) => {
    const rMult = 1 + (i / 40) * 5; // 1 Re to 6 Re
    const px = 275 + ((rMult - 1) / 5) * 150;
    const py = 175 - (1 / (rMult * rMult)) * 125;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');
  const currMult = Math.min(6, rTotal / Re);
  const currGx = 275 + ((currMult - 1) / 5) * 150;
  const currGy = 175 - (1 / (currMult * currMult)) * 125;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'orbit', label: 'ماهواره و گرانش در ارتفاع h' },
                { value: 'pair', label: 'گرانش بین دو جرم (قانون عمومی)' },
              ]}
            />
          </div>

          {mode === 'orbit' ? (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {/* Space background panel on left */}
              <rect x="12" y="14" width="228" height="186" rx="14" fill="#0f172a" />
              {/* Earth */}
              <circle cx="95" cy="107" r="34" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <path d="M 78 96 Q 92 86 105 98 Q 112 112 95 122 Q 78 115 78 96 Z" fill="#10b981" fillOpacity="0.85" />
              <text x="95" y="154" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#bae6fd">
                زمین (Re = 6400 km)
              </text>

              {/* Satellite at distance */}
              {(() => {
                const satR = 34 + Math.min(82, (hKm / 36000) * 82);
                return (
                  <g>
                    <circle cx="95" cy="107" r={satR} fill="none" stroke="#38bdf8" strokeOpacity="0.35" strokeDasharray="4 4" />
                    <line x1="95" y1="107" x2={95 + satR} y2="107" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
                    <rect x={95 + satR - 7} y="100" width="14" height="14" rx="3" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                    <line x1={95 + satR - 14} y1="107" x2={95 + satR - 7} y2="107" stroke="#38bdf8" strokeWidth="3" />
                    <line x1={95 + satR + 7} y1="107" x2={95 + satR + 14} y2="107" stroke="#38bdf8" strokeWidth="3" />
                    <text x={95 + satR} y="92" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fde68a">
                      h = {hKm} km
                    </text>
                  </g>
                );
              })()}

              {/* Right: F vs r graph (Example 2-15) */}
              <rect x="252" y="14" width="196" height="186" rx="14" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
              <text x="350" y="34" textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">
                نمودار کاهش گرانش (1/r²)
              </text>
              <line x1="275" y1="175" x2="435" y2="175" stroke="#64748b" strokeWidth="1.5" />
              <line x1="275" y1="175" x2="275" y2="45" stroke="#64748b" strokeWidth="1.5" />
              <text x="430" y="189" fontSize="9" className="fill-slate-500">r/Re</text>
              <text x="264" y="54" fontSize="9" className="fill-slate-500">g₀</text>
              <polyline points={curvePts} fill="none" stroke="#10b981" strokeWidth="3" />
              <circle cx={currGx} cy={currGy} r="5.5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <text x="350" y="193" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
                r = {(rTotal / Re).toFixed(2)} Re → g = {(ratio * 100).toFixed(1)}% g₀
              </text>
            </svg>
          ) : (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[220px]">
              {(() => {
                const halfSep = 45 + (rPair / 10) * 120;
                const x1 = 230 - halfSep;
                const x2 = 230 + halfSep;
                return (
                  <>
                    <line x1={x1} y1="108" x2={x2} y2="108" stroke="#94a3b8" strokeDasharray="5 4" strokeWidth="2" />
                    <text x="230" y="140" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                      فاصله r = {rPair.toFixed(1)} m
                    </text>
                    {/* Attractive force vectors */}
                    <line x1={x1 + 26} y1="108" x2={x1 + 64} y2="108" stroke="#ef4444" strokeWidth="3.5" />
                    <polygon points={`${x1 + 70},108 ${x1 + 60},103 ${x1 + 60},113`} fill="#ef4444" />
                    <line x1={x2 - 26} y1="108" x2={x2 - 64} y2="108" stroke="#ef4444" strokeWidth="3.5" />
                    <polygon points={`${x2 - 70},108 ${x2 - 60},103 ${x2 - 60},113`} fill="#ef4444" />
                    <text x="230" y="75" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ef4444">
                      جاذبه متقابل: F₁₂ = F₂₁ = {formatSciPlain(fPair, 2)} N
                    </text>

                    <circle cx={x1} cy="108" r={16 + m1 / 14} fill="#0284c7" stroke="#fff" strokeWidth="2" />
                    <text x={x1} y="112" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">{m1}kg</text>
                    <circle cx={x2} cy="108" r={16 + m2 / 14} fill="#059669" stroke="#fff" strokeWidth="2" />
                    <text x={x2} y="112" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">{m2}kg</text>
                  </>
                );
              })()}
            </svg>
          )}
        </div>
      }
      formula={
        mode === 'orbit' ? (
          <LiveFormulaCard
            formulaTex="g(h) = g_0 \left(\frac{R_e}{R_e + h}\right)^2, \qquad W_h = m g(h)"
            substitutedTex={`g(${hKm}\\;\\text{km}) = 9.8\\left(\\frac{6400}{${rTotal}}\\right)^2 = ${gH.toFixed(3)}\\;\\text{m/s}^2, \\quad W_h = ${wH.toFixed(1)}\\;\\text{N}`}
            symbols={[
              { symbol: 'R_e', meaning: 'شعاع زمین ($6400\\;\\text{km}$)', unit: 'km' },
              { symbol: 'h', meaning: 'ارتفاع از **سطح** زمین (پس $r = R_e + h$)', unit: 'km' },
              { symbol: 'g_0, g(h)', meaning: 'شتاب گرانش در سطح زمین و در ارتفاع $h$', unit: 'm/s²' },
              { symbol: 'W_h', meaning: 'وزن ماهواره در ارتفاع $h$', unit: 'N' },
            ]}
            insight="دکمه ارتفاع h = 6400 km (= Re) را بزنید و ببینید وزن دقیقاً یک‌چهارم (25%) می‌شود؛ در مدار زمین‌آهنگ (35600 km) گرانش به 0.226 m/s² افت می‌کند!"
          />
        ) : (
          <LiveFormulaCard
            formulaTex="F = G\frac{m_1 m_2}{r^2} \qquad (G = 6.67 \times 10^{-11}\;\text{N}\cdot\text{m}^2/\text{kg}^2)"
            substitutedTex={`F = (6.67\\times 10^{-11})\\frac{(${m1})(${m2})}{(${rPair.toFixed(1)})^2} = ${formatSci(fPair, 2)}\\;\\text{N}`}
            symbols={[
              { symbol: 'G', meaning: 'ثابت جهانی گرانش (آزمایش کاوندیش)', unit: 'N·m²/kg²' },
              { symbol: 'm_1, m_2', meaning: 'جرم دو جسم همگن', unit: 'kg' },
              { symbol: 'r', meaning: 'فاصله مرکز تا مرکز دو جرم', unit: 'm' },
            ]}
            insight="ببینید که نیروی گرانش بین دو جسم معمولی (مثال ۲-۱۴ کتاب) در حد ۱۰⁻⁷ نیوتون و کاملاً ناچیز است، اما برای جرم‌های نجومی بسیار عظیم می‌شود."
          />
        )
      }
      controls={
        mode === 'orbit' ? (
          <>
            <SliderControl label="ارتفاع از سطح زمین" symbol="h" value={hKm} min={0} max={36000} step={200} unit="km" accentClass="text-emerald-600" onChange={setHKm} />
            <SliderControl label="جرم ماهواره" symbol="m" value={mSat} min={50} max={1000} step={50} unit="kg" accentClass="text-cyan-600" onChange={setMSat} />
            <div className="grid grid-cols-2 gap-1.5">
              <button type="button" onClick={() => setHKm(600)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">هابل (600 km)</button>
              <button type="button" onClick={() => setHKm(2600)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">مثال ۲-۱۵ (2600 km)</button>
              <button type="button" onClick={() => setHKm(6400)} className="py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold cursor-pointer">h = Re (¼ وزن)</button>
              <button type="button" onClick={() => setHKm(35600)} className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">مخابراتی (35600 km)</button>
            </div>
          </>
        ) : (
          <>
            <SliderControl label="جرم اول" symbol="m_1" value={m1} min={10} max={200} step={10} unit="kg" accentClass="text-cyan-600" onChange={setM1} />
            <SliderControl label="جرم دوم" symbol="m_2" value={m2} min={10} max={200} step={10} unit="kg" accentClass="text-emerald-600" onChange={setM2} />
            <SliderControl label="فاصله مرکز تا مرکز" symbol="r" value={rPair} min={0.5} max={10} step={0.5} unit="m" accentClass="text-rose-500" onChange={setRPair} />
          </>
        )
      }
      metrics={
        mode === 'orbit' ? (
          <>
            <MetricCard label="شتاب گرانش g(h)" value={gH.toFixed(3)} unit="m/s²" sublabel={`در سطح زمین: 9.80 m/s²`} color="emerald" />
            <MetricCard label="وزن در ارتفاع h" value={wH.toFixed(1)} unit="N" sublabel={`وزن در سطح: ${w0.toFixed(0)} N`} color="cyan" />
          </>
        ) : (
          <>
            <MetricCard label="نیروی گرانش F" value={formatSciPlain(fPair, 2)} unit="N" color="rose" />
            <MetricCard label="قانون سوم" value="F₁₂ = F₂₁" sublabel="همواره جاذبه و هم‌اندازه" color="emerald" />
          </>
        )
      }
    />
  );
};
