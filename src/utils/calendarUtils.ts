import { Solar, Lunar } from 'lunar-javascript';
import { CalendarDayInfo, ShiftEntry } from '../types';

export const MEMBER_PALETTE = [
  { color: '#2563eb', bg: 'bg-blue-600', text: 'text-white', lightBg: 'bg-blue-50 text-blue-700 border-blue-200' }, // Blue
  { color: '#059669', bg: 'bg-emerald-600', text: 'text-white', lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }, // Emerald
  { color: '#7c3aed', bg: 'bg-violet-600', text: 'text-white', lightBg: 'bg-violet-50 text-violet-700 border-violet-200' }, // Violet
  { color: '#d97706', bg: 'bg-amber-600', text: 'text-white', lightBg: 'bg-amber-50 text-amber-700 border-amber-200' }, // Amber
  { color: '#e11d48', bg: 'bg-rose-600', text: 'text-white', lightBg: 'bg-rose-50 text-rose-700 border-rose-200' }, // Rose
  { color: '#0891b2', bg: 'bg-cyan-600', text: 'text-white', lightBg: 'bg-cyan-50 text-cyan-700 border-cyan-200' }, // Cyan
  { color: '#4f46e5', bg: 'bg-indigo-600', text: 'text-white', lightBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }, // Indigo
  { color: '#ea580c', bg: 'bg-orange-600', text: 'text-white', lightBg: 'bg-orange-50 text-orange-700 border-orange-200' }, // Orange
  { color: '#0d9488', bg: 'bg-teal-600', text: 'text-white', lightBg: 'bg-teal-50 text-teal-700 border-teal-200' }, // Teal
  { color: '#475569', bg: 'bg-slate-600', text: 'text-white', lightBg: 'bg-slate-50 text-slate-700 border-slate-200' }, // Slate
];

export function formatDateStr(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseDateStr(dateStr: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d };
}

export function getLunarInfo(year: number, month: number, day: number) {
  try {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    
    const dayInChinese = lunar.getDayInChinese(); // e.g. "初一", "十二", "廿五"
    const monthInChinese = lunar.getMonthInChinese() + '月'; // e.g. "八月"
    const jieQi = lunar.getJieQi(); // e.g. "白露"
    const lunarFestivals = lunar.getFestivals() || [];
    const solarFestivals = solar.getFestivals() || [];
    
    const primaryFestival = lunarFestivals[0] || solarFestivals[0] || '';
    
    // If it's the 1st day of lunar month, show Month name like "八月"
    let displayText = dayInChinese;
    if (dayInChinese === '初一') {
      displayText = monthInChinese;
    }
    if (jieQi) {
      displayText = jieQi;
    }
    if (primaryFestival) {
      displayText = primaryFestival;
    }

    return {
      lunarText: displayText,
      rawLunarDay: dayInChinese,
      lunarMonth: monthInChinese,
      solarTerm: jieQi || undefined,
      festival: primaryFestival || undefined,
    };
  } catch (err) {
    console.error('Failed to get lunar info', err);
    return {
      lunarText: '',
      rawLunarDay: '',
      lunarMonth: '',
    };
  }
}

/**
 * Generate 35 or 42 calendar grid cells for a given year & month (1-indexed month: 1..12).
 * startDayOfWeek: 0 (Sunday first) or 1 (Monday first).
 */
export function generateMonthCalendar(
  year: number,
  month: number,
  startDayOfWeek: 0 | 1 = 1,
  shiftMap: Record<string, ShiftEntry[]> = {}
): CalendarDayInfo[] {
  const today = new Date();
  const todayStr = formatDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // First day of target month
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon...

  // Calculate days before the first day to fill the first row
  let prevDaysCount = 0;
  if (startDayOfWeek === 1) {
    // Monday first: Sun (0) needs 6 prev days, Mon (1) needs 0, Tue (2) needs 1...
    prevDaysCount = (firstDayWeekday + 6) % 7;
  } else {
    // Sunday first: Sun (0) needs 0, Mon (1) needs 1...
    prevDaysCount = firstDayWeekday;
  }

  // Days in current month
  const daysInCurrentMonth = new Date(year, month, 0).getDate();

  // Days in previous month
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const cells: CalendarDayInfo[] = [];

  // 1. Previous month days
  for (let i = prevDaysCount - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 2, prevDay);
    const pYear = prevDate.getFullYear();
    const pMonth = prevDate.getMonth() + 1;
    const pDay = prevDate.getDate();
    const dateStr = formatDateStr(pYear, pMonth, pDay);
    const dayOfWeek = prevDate.getDay();
    const lunar = getLunarInfo(pYear, pMonth, pDay);

    cells.push({
      date: prevDate,
      dateStr,
      year: pYear,
      month: pMonth,
      day: pDay,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      dayOfWeek,
      lunarText: lunar.lunarText,
      lunarMonthText: lunar.lunarMonth,
      solarTerm: lunar.solarTerm,
      festival: lunar.festival,
      shifts: shiftMap[dateStr] || [],
    });
  }

  // 2. Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const currentDate = new Date(year, month - 1, day);
    const dateStr = formatDateStr(year, month, day);
    const dayOfWeek = currentDate.getDay();
    const lunar = getLunarInfo(year, month, day);

    cells.push({
      date: currentDate,
      dateStr,
      year,
      month,
      day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      dayOfWeek,
      lunarText: lunar.lunarText,
      lunarMonthText: lunar.lunarMonth,
      solarTerm: lunar.solarTerm,
      festival: lunar.festival,
      shifts: shiftMap[dateStr] || [],
    });
  }

  // 3. Next month days to complete 5 or 6 full weeks (35 or 42 cells)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  const totalNeeded = cells.length + remainingCells < 35 ? 35 : cells.length + remainingCells;
  const nextDaysCount = totalNeeded - cells.length;

  for (let day = 1; day <= nextDaysCount; day++) {
    const nextDate = new Date(year, month, day);
    const nYear = nextDate.getFullYear();
    const nMonth = nextDate.getMonth() + 1;
    const nDay = nextDate.getDate();
    const dateStr = formatDateStr(nYear, nMonth, nDay);
    const dayOfWeek = nextDate.getDay();
    const lunar = getLunarInfo(nYear, nMonth, nDay);

    cells.push({
      date: nextDate,
      dateStr,
      year: nYear,
      month: nMonth,
      day: nDay,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      dayOfWeek,
      lunarText: lunar.lunarText,
      lunarMonthText: lunar.lunarMonth,
      solarTerm: lunar.solarTerm,
      festival: lunar.festival,
      shifts: shiftMap[dateStr] || [],
    });
  }

  return cells;
}

export const DEFAULT_MEMBERS = [
  { id: 'm-liao', name: '廖', shortName: '廖', color: '#2563eb', role: '白班/值班' },
  { id: 'm-he', name: '何', shortName: '何', color: '#059669', role: '值班' },
  { id: 'm-zhang', name: '张', shortName: '张', color: '#7c3aed', role: '值班' },
  { id: 'm-wang', name: '王', shortName: '王', color: '#ea580c', role: '值班' },
];

export const DEFAULT_SHIFTS_SAMPLE: ShiftEntry[] = [
  // Generating sample similar to the user screenshot:
  { id: 's-1', dateStr: '2026-09-03', memberName: '廖', color: '#2563eb', createdAt: Date.now() },
  { id: 's-2', dateStr: '2026-09-06', memberName: '何', color: '#059669', createdAt: Date.now() },
  { id: 's-3', dateStr: '2026-09-07', memberName: '何', color: '#059669', createdAt: Date.now() },
  { id: 's-4', dateStr: '2026-09-08', memberName: '廖', color: '#2563eb', createdAt: Date.now() },
  { id: 's-5', dateStr: '2026-09-13', memberName: '何', color: '#059669', createdAt: Date.now() },
  { id: 's-6', dateStr: '2026-09-14', memberName: '廖', color: '#2563eb', createdAt: Date.now() },
  { id: 's-7', dateStr: '2026-09-16', memberName: '廖', color: '#2563eb', createdAt: Date.now() },
  { id: 's-8', dateStr: '2026-09-20', memberName: '何', color: '#059669', createdAt: Date.now() },
  { id: 's-9', dateStr: '2026-09-21', memberName: '何', color: '#059669', createdAt: Date.now() },
  { id: 's-10', dateStr: '2026-09-23', memberName: '廖', color: '#2563eb', createdAt: Date.now() },
  { id: 's-11', dateStr: '2026-09-27', memberName: '何', color: '#059669', createdAt: Date.now() },
];
