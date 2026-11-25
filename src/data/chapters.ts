import { ChapterMeta, SubsectionData } from '../types/physics';
import { chapter1Subsections } from './chapter1';
import { chapter2Subsections } from './chapter2';
import { chapter3Subsections } from './chapter3';
import { chapter4Subsections } from './chapter4';

export const chaptersMeta: ChapterMeta[] = [
  {
    id: 1,
    numberFa: '۱',
    title: 'حرکت بر خط راست',
    subtitle: 'شناخت حرکت، نمودارهای مکان–زمان و سرعت–زمان، حرکت یکنواخت و شتاب ثابت',
    bookPages: 'صفحه ۱ تا ۲۶',
    konkoorShare: 'حدود ۳ تا ۴ تست کنکور',
    accent: 'cyan',
    description:
      'پایه سینماتیک کنکور تجربی: تفاوت مسافت و جابه‌جایی، تندی و سرعت متوسط و لحظه‌ای، شیب نمودار و سطح زیر نمودار، حرکت با سرعت ثابت (هم‌رسی) و معادلات حرکت با شتاب ثابت.',
  },
  {
    id: 2,
    numberFa: '۲',
    title: 'دینامیک',
    subtitle: 'قوانین نیوتون، نیروهای خاص (وزن، آسانسور، اصطکاک، فنر، طناب)، تکانه و گرانش',
    bookPages: 'صفحه ۲۷ تا ۵۲',
    konkoorShare: 'حدود ۳ تا ۴ تست کنکور',
    accent: 'emerald',
    description:
      'قلب مکانیک دوازدهم: تحلیل نیروهای افقی و قائم، آسانسور و وزن ظاهری، اصطکاک ایستایی و جنبشی، قانون هوک فنر، مقاومت شاره و تندی حدی، تغییر تکانه و قانون گرانش عمومی نیوتون.',
  },
  {
    id: 3,
    numberFa: '۳',
    title: 'نوسان و امواج',
    subtitle: 'حرکت هماهنگ ساده، آونگ، تشدید، موج عرضی و طولی، صوت و دسی‌بل، دوپلر، بازتاب و شکست',
    bookPages: 'صفحه ۵۳ تا ۹۴',
    konkoorShare: 'حدود ۴ تا ۵ تست کنکور',
    accent: 'violet',
    description:
      'پرتست‌ترین فصل فیزیک دوازدهم: نوسان جرم–فنر و آونگ ساده، انرژی در SHM، پدیده تشدید، موج مکانیکی و الکترومغناطیسی، تراز شدت صوت، اثر دوپلر، پژواک، شکست اسنل و بازتاب کلی.',
  },
  {
    id: 4,
    numberFa: '۴',
    title: 'آشنایی با فیزیک اتمی و هسته‌ای',
    subtitle: 'فوتوالکتریک و فوتون، طیف خطی و ریدبرگ، مدل بور، لیزر، ساختار هسته، پرتوزایی و نیمه‌عمر',
    bookPages: 'صفحه ۹۵ تا ۱۲۵',
    konkoorShare: 'حدود ۲ تا ۳ تست کنکور',
    accent: 'amber',
    description:
      'مباحث شیرین و نمره‌آور فیزیک جدید: کوانتومی شدن انرژی نور ($E=hf$)، رشته‌های طیفی هیدروژن، ترازهای انرژی و گذارهای اتم بور، سازوکار لیزر، پایداری هسته، واپاشی‌های آلفا/بتا/گاما و نیمه‌عمر.',
  },
];

export const allSubsections: SubsectionData[] = [
  ...chapter1Subsections,
  ...chapter2Subsections,
  ...chapter3Subsections,
  ...chapter4Subsections,
];
