import { PracticeQuestion } from '../types/physics';

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function makeMcqOptions(correct: number, unit: string, multipliers: number[] = [0.5, 2, 4]) {
  const vals = [correct];
  for (const m of multipliers) {
    const v = Number((correct * m).toPrecision(3));
    if (!vals.some((x) => Math.abs(x - v) < 1e-9)) vals.push(v);
  }
  while (vals.length < 4) {
    vals.push(Number((correct * (vals.length + 1.5)).toPrecision(3)));
  }
  const shuffled = vals
    .map((v, i) => ({ v, isCorrect: i === 0, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort);
  const correctIndex = shuffled.findIndex((x) => x.isCorrect);
  return {
    options: shuffled.map((x) => ({
      label: '',
      tex: `${x.v}\\;\\text{${unit}}`,
    })),
    correctIndex,
  };
}

export function generateDynamicProblem(subsectionId: string): PracticeQuestion | null {
  const stamp = Date.now();

  switch (subsectionId) {
    case '1-1': {
      const x1 = pick([-10, -6, 0, 4]);
      const d1 = pick([12, 16, 20, 24]);
      const d2 = pick([6, 8, 10, 14]);
      const x2 = x1 + d1;
      const x3 = x2 - d2;
      const dt = pick([4, 5, 8, 10]);
      const dist = d1 + d2;
      const sAv = Number((dist / dt).toPrecision(3));
      const vAv = Number(((x3 - x1) / dt).toPrecision(3));
      return {
        id: `dyn-1-1-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی (تندی متوسط در حرکت رفت‌وبرگشتی)',
        prompt: `متحرکی روی محور $x$ ابتدا از مکان $x_1 = ${x1}\\;\\text{m}$ به مکان $x_2 = ${x2}\\;\\text{m}$ می‌رود و سپس تغییر جهت داده به مکان $x_3 = ${x3}\\;\\text{m}$ می‌رسد. اگر کل این حرکت $${dt}\\;\\text{s}$ طول بکشد، **تندی متوسط** متحرک چند $\\text{m/s}$ است؟`,
        numericAnswer: sAv,
        tolerance: 0.03,
        unit: 'm/s',
        hint: 'تندی متوسط برابر مسافت کل تقسیم بر زمان است ($l = |x_2-x_1| + |x_3-x_2|$).',
        solutionSteps: [
          { text: 'مسافت کل پیموده‌شده:', tex: `l = |${x2} - (${x1})| + |${x3} - ${x2}| = ${d1} + ${d2} = ${dist}\\;\\text{m}` },
          { text: 'محاسبه تندی متوسط (و مقایسه با سرعت متوسط):', tex: `s_{\\text{av}} = \\frac{${dist}}{${dt}} = ${sAv}\\;\\text{m/s} \\qquad (v_{\\text{av}} = ${vAv}\\;\\text{m/s})` },
        ],
      };
    }

    case '1-2': {
      const tMeet = pick([5, 8, 10, 12, 15, 20]);
      const vA = pick([8, 10, 12, 15]);
      const vB = -pick([4, 5, 8, 10]);
      const x0A = pick([-40, -20, 0, 20]);
      const xMeet = x0A + vA * tMeet;
      const x0B = xMeet - vB * tMeet;
      return {
        id: `dyn-1-2-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی هم‌رسی دو متحرک',
        prompt: `دو خودرو روی محور $x$ با معادله‌های $x_A = ${vA}t ${x0A >= 0 ? `+ ${x0A}` : x0A}$ و $x_B = ${vB}t + ${x0B}$ (در SI) هم‌زمان حرکت می‌کنند. این دو خودرو در چه لحظه‌ای (برحسب ثانیه) به یکدیگر می‌رسند؟`,
        numericAnswer: tMeet,
        tolerance: 0.02,
        unit: 's',
        hint: 'شرط هم‌رسی برابر قرار دادن مکان دو خودرو ($x_A = x_B$) است.',
        solutionSteps: [
          { text: 'برابر قرار دادن معادلات مکان–زمان:', tex: `${vA}t ${x0A >= 0 ? `+ ${x0A}` : x0A} = ${vB}t + ${x0B} \\Rightarrow ${vA - vB}t = ${x0B - x0A} \\Rightarrow t = ${tMeet}\\;\\text{s}` },
        ],
      };
    }

    case '1-3': {
      const v0 = pick([10, 12, 16, 20, 24, 30]);
      const a = pick([2, 4, 5, 6]);
      const dx = Number(((v0 * v0) / (2 * a)).toPrecision(3));
      const { options, correctIndex } = makeMcqOptions(dx, 'm', [0.5, 2, 0.25]);
      return {
        id: `dyn-1-3-${stamp}`,
        type: 'mcq',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی حرکت با شتاب ثابت (ترمز)',
        prompt: `خودرویی با تندی $${v0}\\;\\text{m/s}$ در حال حرکت است. راننده ترمز می‌کند و خودرو با شتاب ثابت $${a}\\;\\text{m/s}^2$ کُند شده و متوقف می‌شود. مسافت ترمز خودرو تا توقف کامل چند متر است؟`,
        options,
        correctIndex,
        hint: 'از معادله مستقل از زمان $v^2 - v_0^2 = 2a\\Delta x$ با $v=0$ و $a < 0$ استفاده کنید.',
        solutionSteps: [
          { text: 'جایگذاری در رابطه مستقل از زمان:', tex: `0 - (${v0})^2 = 2(-${a})\\Delta x \\Rightarrow \\Delta x = \\frac{${v0 * v0}}{${2 * a}} = ${dx}\\;\\text{m}` },
        ],
      };
    }

    case '2-1': {
      const triples = [
        [3, 4, 5],
        [6, 8, 10],
        [9, 12, 15],
        [5, 12, 13],
      ];
      const [fx, fy, fnet] = pick(triples);
      const m = pick([2, 2.5, 4, 5]);
      const acc = Number((fnet / m).toPrecision(3));
      return {
        id: `dyn-2-1-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی قانون دوم نیوتون (دوبعدی عمود)',
        prompt: `بر جسمی به جرم $${m}\\;\\text{kg}$ دو نیروی عمود بر هم به اندازه‌های $F_x = ${fx}\\;\\text{N}$ و $F_y = ${fy}\\;\\text{N}$ وارد می‌شود. بزرگی شتاب این جسم چند $\\text{m/s}^2$ است؟`,
        numericAnswer: acc,
        tolerance: 0.02,
        unit: 'm/s²',
        hint: 'ابتدا برآیند دو نیروی عمود بر هم را با فیثاغورس بیابید و سپس بر جرم تقسیم کنید.',
        solutionSteps: [
          { text: 'محاسبه نیروی خالص:', tex: `F_{\\text{net}} = \\sqrt{${fx}^2 + ${fy}^2} = ${fnet}\\;\\text{N}` },
          { text: 'محاسبه بزرگی شتاب:', tex: `a = \\frac{F_{\\text{net}}}{m} = \\frac{${fnet}}{${m}} = ${acc}\\;\\text{m/s}^2` },
        ],
      };
    }

    case '2-2': {
      const m = pick([4, 5, 8, 10, 12]);
      const muS = pick([0.4, 0.5, 0.6]);
      const muK = Number((muS - 0.15).toFixed(2));
      const fsMax = m * 10 * muS;
      const fk = m * 10 * muK;
      const pushAbove = pick([true, false]);
      if (pushAbove) {
        const extra = pick([10, 15, 20, 30]);
        const F = Math.round(fsMax + extra);
        const acc = Number(((F - fk) / m).toPrecision(3));
        return {
          id: `dyn-2-2-${stamp}`,
          type: 'numeric',
          difficulty: 'کنکوری',
          source: 'تمرین تصادفی اصطکاک جنبشی و شتاب',
          prompt: `جسمی به جرم $${m}\\;\\text{kg}$ روی سطح افقی با ضرایب اصطکاک $\\mu_s = ${muS}$ و $\\mu_k = ${muK}$ ساکن است ($g = 10\\;\\text{N/kg}$). اگر به آن نیروی افقی $F = ${F}\\;\\text{N}$ وارد کنیم، شتاب حرکت جسم چند $\\text{m/s}^2$ می‌شود؟`,
          numericAnswer: acc,
          tolerance: 0.03,
          unit: 'm/s²',
          hint: 'چون $F > f_{s,\\max}$ جسم حرکت می‌کند و از $a = (F - \\mu_k mg)/m$ شتاب به دست می‌آید.',
          solutionSteps: [
            { text: 'بررسی شروع حرکت:', tex: `f_{s,\\max} = ${muS} \\times ${m * 10} = ${fsMax}\\;\\text{N} < F (${F}\\;\\text{N}) \\Rightarrow \\text{جسم می‌لغزد}` },
            { text: 'محاسبه شتاب با اصطکاک جنبشی:', tex: `f_k = ${muK} \\times ${m * 10} = ${fk}\\;\\text{N} \\Rightarrow a = \\frac{${F} - ${fk}}{${m}} = ${acc}\\;\\text{m/s}^2` },
          ],
        };
      } else {
        const mE = pick([50, 60, 70, 80]);
        const aE = pick([2, 2.5, 3, 4]);
        const up = pick([true, false]);
        const fn = up ? mE * (10 + aE) : mE * (10 - aE);
        return {
          id: `dyn-2-2-${stamp}`,
          type: 'numeric',
          difficulty: 'کنکوری',
          source: 'تمرین تصادفی آسانسور (وزن ظاهری)',
          prompt: `شخصی به جرم $${mE}\\;\\text{kg}$ روی ترازوی فنری درون آسانسور ایستاده است ($g = 10\\;\\text{N/kg}$). اگر شتاب آسانسور برابر $${aE}\\;\\text{m/s}^2$ و رو به **${up ? 'بالا' : 'پایین'}** باشد، ترازو چند نیوتون را نشان می‌دهد؟`,
          numericAnswer: fn,
          tolerance: 0.02,
          unit: 'N',
          hint: `برای شتاب رو به ${up ? 'بالا $F_N = m(g+a)$' : 'پایین $F_N = m(g-a)$'} است.`,
          solutionSteps: [
            { text: 'محاسبه نیروی عمودی کف آسانسور:', tex: `F_N = ${mE}(10 ${up ? '+' : '-'} ${aE}) = ${fn}\\;\\text{N}` },
          ],
        };
      }
    }

    case '2-3': {
      const m = pick([0.2, 0.4, 0.5, 0.8, 1.0]);
      const v1 = pick([10, 12, 15, 20]);
      const v2 = pick([5, 8, 10, 15]);
      const dt = pick([0.05, 0.1, 0.2]);
      const dp = Number((m * (v1 + v2)).toPrecision(3));
      const fAv = Number((dp / dt).toPrecision(3));
      return {
        id: `dyn-2-3-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی تکانه و نیروی متوسط برخورد',
        prompt: `توپی به جرم $${m}\\;\\text{kg}$ با تندی $${v1}\\;\\text{m/s}$ به طور افقی به دیوار برخورد کرده و پس از $${dt}\\;\\text{s}$ با تندی $${v2}\\;\\text{m/s}$ در جهت مخالف بازمی‌گردد. بزرگی نیروی متوسط وارد بر توپ چند نیوتون است؟`,
        numericAnswer: fAv,
        tolerance: 0.03,
        unit: 'N',
        hint: 'چون جهت سرعت معکوس شده، $|\\Delta p| = m(v_1 + v_2)$ و سپس $F_{\\text{av}} = |\\Delta p|/\\Delta t$.',
        solutionSteps: [
          { text: 'اندازه تغییر تکانه:', tex: `|\\Delta p| = ${m}(${v1} + ${v2}) = ${dp}\\;\\text{kg}\\cdot\\text{m/s}` },
          { text: 'نیروی متوسط:', tex: `F_{\\text{av}} = \\frac{${dp}}{${dt}} = ${fAv}\\;\\text{N}` },
        ],
      };
    }

    case '2-4': {
      const kMult = pick([2, 3, 4, 5]);
      const hMult = kMult - 1;
      const w0 = pick([180, 360, 450, 500, 900]);
      const wH = Number((w0 / (kMult * kMult)).toPrecision(3));
      return {
        id: `dyn-2-4-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی گرانش در ارتفاع',
        prompt: `وزن ماهواره‌ای روی سطح زمین برابر $${w0}\\;\\text{N}$ است. اگر این ماهواره در ارتفاع $h = ${hMult} R_e$ از **سطح زمین** قرار گیرد ($R_e$ شعاع زمین)، وزن آن چند نیوتون می‌شود؟`,
        numericAnswer: wH,
        tolerance: 0.03,
        unit: 'N',
        hint: 'فاصله از مرکز زمین $r = R_e + h$ است! پس وزن تقسیم بر $(1 + h/R_e)^2$ می‌شود.',
        solutionSteps: [
          { text: 'فاصله از مرکز زمین:', tex: `r = R_e + ${hMult}R_e = ${kMult}R_e` },
          { text: 'وزن در ارتفاع $h$:', tex: `W_h = W_0\\left(\\frac{R_e}{${kMult}R_e}\\right)^2 = \\frac{${w0}}{${kMult * kMult}} = ${wH}\\;\\text{N}` },
        ],
      };
    }

    case '3-1': {
      const N = pick([30, 45, 60, 75, 90, 120, 150]);
      const t = pick([10, 15, 20, 30, 60]);
      const f = Number((N / t).toPrecision(3));
      return {
        id: `dyn-3-1-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی نوسان دوره‌ای',
        prompt: `نوسانگری در مدت زمان $${t}\\;\\text{s}$ تعداد $${N}$ چرخه (نوسان کامل) انجام می‌دهد. بسامد این نوسانگر چند هرتز ($\\text{Hz}$) است؟`,
        numericAnswer: f,
        tolerance: 0.02,
        unit: 'Hz',
        hint: 'بسامد برابر تعداد نوسان تقسیم بر مدت زمان است: $f = N/t$.',
        solutionSteps: [
          { text: 'محاسبه بسامد:', tex: `f = \\frac{N}{t} = \\frac{${N}}{${t}} = ${f}\\;\\text{Hz}` },
        ],
      };
    }

    case '3-2': {
      const ratios = [
        { k: 100, m: 1, w: 10 },
        { k: 160, m: 0.4, w: 20 },
        { k: 90, m: 0.1, w: 30 },
        { k: 250, m: 1, w: 15.81 },
        { k: 400, m: 1, w: 20 },
      ];
      const item = pick(ratios);
      const T = Number(((2 * 3) / item.w).toPrecision(3));
      return {
        id: `dyn-3-2-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی سامانه جرم–فنر',
        prompt: `وزنه‌ای به جرم $${item.m}\\;\\text{kg}$ به فنری با ثابت $k = ${item.k}\\;\\text{N/m}$ متصل است و حرکت هماهنگ ساده انجام می‌دهد. با فرض $\\pi = 3$، دوره تناوب این نوسانگر چند ثانیه است؟`,
        numericAnswer: T,
        tolerance: 0.04,
        unit: 's',
        hint: 'از رابطه $T = 2\\pi\\sqrt{m/k}$ استفاده کنید.',
        solutionSteps: [
          { text: 'محاسبه بسامد زاویه‌ای و دوره تناوب:', tex: `\\omega = \\sqrt{\\frac{${item.k}}{${item.m}}} = ${item.w}\\;\\text{rad/s} \\Rightarrow T = \\frac{2\\pi}{\\omega} = \\frac{6}{${item.w}} = ${T}\\;\\text{s}` },
        ],
      };
    }

    case '3-3': {
      const A = pick([4, 5, 8, 10, 12]); // cm
      const f = pick([2, 2.5, 4, 5, 10]); // Hz
      const vMax = Number((2 * 3 * f * (A / 100)).toPrecision(3));
      return {
        id: `dyn-3-3-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی تندی بیشینه در SHM',
        prompt: `نوسانگر هماهنگ ساده‌ای با دامنه $${A}\\;\\text{cm}$ و بسامد $${f}\\;\\text{Hz}$ نوسان می‌کند. با فرض $\\pi = 3$، بیشینه تندی نوسانگر هنگام عبور از نقطه تعادل چند $\\text{m/s}$ است؟`,
        numericAnswer: vMax,
        tolerance: 0.03,
        unit: 'm/s',
        hint: 'ابتدا دامنه را به متر تبدیل کنید و از $v_{\\max} = A\\omega = 2\\pi f A$ حساب کنید.',
        solutionSteps: [
          { text: 'محاسبه تندی بیشینه:', tex: `v_{\\max} = 2\\pi f A = 2(3)(${f})(${A / 100}) = ${vMax}\\;\\text{m/s}` },
        ],
      };
    }

    case '3-6': {
      const kPow = pick([10, 100, 1000, 10000]);
      const dBAdd = Math.round(10 * Math.log10(kPow));
      const b1 = pick([30, 40, 50, 60, 70]);
      const b2 = b1 + dBAdd;
      return {
        id: `dyn-3-6-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی تراز شدت صوت (دسی‌بل)',
        prompt: `تراز شدت صوت در یک نقطه برابر $${b1}\\;\\text{dB}$ است. اگر شدت صوت در این نقطه $${kPow}$ برابر شود، تراز شدت صوت جدید چند دسی‌بل ($\\text{dB}$) خواهد شد؟`,
        numericAnswer: b2,
        tolerance: 0.02,
        unit: 'dB',
        hint: 'از رابطه $\\beta_2 - \\beta_1 = 10\\log(I_2/I_1)$ استفاده کنید.',
        solutionSteps: [
          { text: 'افزایش تراز شدت صوت:', tex: `\\Delta \\beta = 10\\log(${kPow}) = ${dBAdd}\\;\\text{dB}` },
          { text: 'تراز نهایی:', tex: `\\beta_2 = ${b1} + ${dBAdd} = ${b2}\\;\\text{dB}` },
        ],
      };
    }

    case '3-7': {
      const v = pick([320, 340, 350]);
      const t = pick([0.5, 1.0, 1.5, 2.0, 2.5]);
      const L = Number(((v * t) / 2).toPrecision(4));
      return {
        id: `dyn-3-7-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی پژواک صوت',
        prompt: `شخصی روبه‌روی یک صخره بلند فریاد می‌زند و پژواک صدای خود را پس از $${t}\\;\\text{s}$ می‌شنود. اگر تندی صوت در هوا $${v}\\;\\text{m/s}$ باشد، فاصله شخص تا صخره چند متر است؟`,
        numericAnswer: L,
        tolerance: 0.02,
        unit: 'm',
        hint: 'صوت مسیر رفت‌وبرگشت $2L$ را در مدت $t$ طی کرده است، پس $L = vt/2$.',
        solutionSteps: [
          { text: 'محاسبه فاصله تا صخره:', tex: `L = \\frac{v t}{2} = \\frac{${v} \\times ${t}}{2} = ${L}\\;\\text{m}` },
        ],
      };
    }

    case '3-8': {
      const lam0 = pick([450, 540, 600, 660, 720]);
      const n = pick([1.2, 1.5, 1.8, 2.0]);
      const lam2 = Number((lam0 / n).toPrecision(3));
      const { options, correctIndex } = makeMcqOptions(lam2, 'nm', [n, n * n, 0.5]);
      return {
        id: `dyn-3-8-${stamp}`,
        type: 'mcq',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی شکست نور (طول‌موج در محیط)',
        prompt: `پرتو نوری با طول‌موج $${lam0}\\;\\text{nm}$ از هوا ($n_1 = 1$) وارد محیط شفافی با ضریب شکست $n_2 = ${n}$ می‌شود. طول‌موج این نور درون محیط دوم چند نانومتر است؟`,
        options,
        correctIndex,
        hint: 'بسامد ثابت می‌ماند و $\\lambda_2 = \\lambda_1 / n_2$.',
        solutionSteps: [
          { text: 'طول‌موج در محیط دوم:', tex: `\\lambda_2 = \\frac{\\lambda_1}{n_2} = \\frac{${lam0}}{${n}} = ${lam2}\\;\\text{nm}` },
        ],
      };
    }

    case '4-1': {
      const lam = pick([200, 248, 310, 400, 500, 620]);
      const eEv = Number((1240 / lam).toPrecision(3));
      return {
        id: `dyn-4-1-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی انرژی فوتون',
        prompt: `انرژی هر فوتون از نوری با طول‌موج $\\lambda = ${lam}\\;\\text{nm}$ چند الکترون‌ولت ($\\text{eV}$) است؟ ($hc = 1240\\;\\text{eV}\\cdot\\text{nm}$)`,
        numericAnswer: eEv,
        tolerance: 0.03,
        unit: 'eV',
        hint: 'از فرمول سریع $E = \\frac{1240}{\\lambda(\\text{nm})}$ استفاده کنید.',
        solutionSteps: [
          { text: 'انرژی فوتون برحسب الکترون‌ولت:', tex: `E = \\frac{hc}{\\lambda} = \\frac{1240}{${lam}} = ${eEv}\\;\\text{eV}` },
        ],
      };
    }

    case '4-2': {
      const np = pick([1, 2, 3, 4]);
      const seriesNames: Record<number, string> = { 1: 'لیمان', 2: 'بالمر', 3: 'پاشن', 4: 'براکت' };
      const lamMin = Math.round((np * np) / 0.011);
      return {
        id: `dyn-4-2-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی معادله ریدبرگ (حد رشته)',
        prompt: `کوتاه‌ترین طول‌موج در رشته **${seriesNames[np]}** ($n' = ${np}$) اتم هیدروژن با فرض $R = 0.011\\;\\text{nm}^{-1}$ تقریباً چند نانومتر ($\\text{nm}$) است؟ (به نزدیک‌ترین عدد صحیح گرد کنید)`,
        numericAnswer: lamMin,
        tolerance: 0.03,
        unit: 'nm',
        hint: 'کوتاه‌ترین طول‌موج متناظر با $n = \\infty$ است، پس $\\lambda_{\\min} = \\frac{n\'^2}{R}$.',
        solutionSteps: [
          { text: 'جایگذاری $n = \\infty$ در معادله ریدبرگ:', tex: `\\frac{1}{\\lambda_{\\min}} = \\frac{R}{${np}^2} \\Rightarrow \\lambda_{\\min} = \\frac{${np * np}}{0.011} \\approx ${lamMin}\\;\\text{nm}` },
        ],
      };
    }

    case '4-3': {
      const nTop = pick([3, 4, 5, 6]);
      const lines = (nTop * (nTop - 1)) / 2;
      const eLevel = Number((-13.6 / (nTop * nTop)).toFixed(2));
      return {
        id: `dyn-4-3-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی گذارهای مدل بور',
        prompt: `الکترون‌های مجموعه‌ای از اتم‌های هیدروژن در تراز $n = ${nTop}$ (با انرژی $${eLevel}\\;\\text{eV}$) قرار دارند. هنگام بازگشت به حالت پایه با در نظر گرفتن تمام گذارهای ممکن، حداکثر چند خط طیفی (فوتون با انرژی متمایز) می‌تواند گسیل شود؟`,
        numericAnswer: lines,
        tolerance: 0.01,
        unit: 'خط',
        hint: 'از رابطه شمار گذارهای ممکن $N = \\frac{n(n-1)}{2}$ استفاده کنید.',
        solutionSteps: [
          { text: 'تعداد کل فوتون‌های متمایز:', tex: `N = \\frac{n(n-1)}{2} = \\frac{${nTop}(${nTop - 1})}{2} = ${lines}` },
        ],
      };
    }

    case '4-5': {
      const samples = [
        { sym: 'Al', Z: 13, A: 27 },
        { sym: 'Fe', Z: 26, A: 56 },
        { sym: 'Ag', Z: 47, A: 108 },
        { sym: 'Au', Z: 79, A: 197 },
        { sym: 'U', Z: 92, A: 235 },
      ];
      const el = pick(samples);
      const N = el.A - el.Z;
      const nuclideTex = `{}^{${el.A}}_{${el.Z}}\\text{${el.sym}}`;
      return {
        id: `dyn-4-5-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی ساختار هسته',
        prompt: `در هسته اتم $${nuclideTex}$ چند نوترون ($N$) وجود دارد؟`,
        numericAnswer: N,
        tolerance: 0.01,
        unit: 'نوترون',
        hint: 'تعداد نوترون‌ها برابر تفاضل عدد جرمی و عدد اتمی است: $N = A - Z$.',
        solutionSteps: [
          { text: 'محاسبه عدد نوترونی:', tex: `N = A - Z = ${el.A} - ${el.Z} = ${N}` },
        ],
      };
    }

    case '4-6': {
      const tHalf = pick([4, 6, 8, 10, 12, 15]);
      const n = pick([2, 3, 4, 5]);
      const tTotal = tHalf * n;
      const n0 = pick([64, 128, 160, 256, 320]);
      const rem = Number((n0 / Math.pow(2, n)).toPrecision(3));
      const askDecayed = pick([true, false]);
      const ans = askDecayed ? Number((n0 - rem).toPrecision(3)) : rem;
      return {
        id: `dyn-4-6-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: `تمرین تصادفی نیمه‌عمر (${askDecayed ? 'مقدار واپاشیده' : 'مقدار باقی‌مانده'})`,
        prompt: `نمونه‌ای شامل $${n0}\\;\\text{g}$ ماده پرتوزا با نیمه‌عمر $T_{1/2} = ${tHalf}\\;\\text{روز}$ در اختیار داریم. پس از گذشت $${tTotal}\\;\\text{روز}$ چند گرم از هسته‌های مادر اولیه **${askDecayed ? 'واپاشی کرده' : 'باقی مانده'}** است؟`,
        numericAnswer: ans,
        tolerance: 0.02,
        unit: 'g',
        hint: `ابتدا $n = t/T_{1/2} = ${n}$ را بیابید. باقی‌مانده $N = N_0(1/2)^n$ و واپاشیده $N_0 - N$ است!`,
        solutionSteps: [
          { text: 'تعداد نیمه‌عمرهای سپری‌شده:', tex: `n = \\frac{${tTotal}}{${tHalf}} = ${n}` },
          { text: 'مقدار باقی‌مانده:', tex: `N = ${n0}\\left(\\frac{1}{2}\\right)^{${n}} = ${rem}\\;\\text{g}` },
          ...(askDecayed
            ? [{ text: 'مقدار واپاشیده (تله کنکور!):', tex: `N_{\\text{واپاشیده}} = ${n0} - ${rem} = ${ans}\\;\\text{g}` }]
            : []),
        ],
      };
    }

    default:
      return null;
  }
}
