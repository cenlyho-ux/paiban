export interface Member {
  id: string;
  name: string;
  shortName?: string;
  color: string; // e.g. '#2563eb' (blue-600)
  textColor?: string;
  bgLight?: string;
  role?: string;
}

export type ShiftType = 'all' | 'morning' | 'afternoon' | 'night' | 'duty' | 'custom';

export interface ShiftEntry {
  id: string;
  dateStr: string; // 'YYYY-MM-DD'
  memberId?: string;
  memberName: string;
  shiftType?: ShiftType;
  shiftLabel?: string;
  color?: string;
  note?: string;
  createdAt: number;
}

export interface DayShiftSummary {
  dateStr: string;
  shifts: ShiftEntry[];
}

export interface CalendarDayInfo {
  date: Date;
  dateStr: string;
  year: number;
  month: number; // 1-12
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  dayOfWeek: number; // 0=Sunday, 1=Monday...
  lunarText: string; // e.g. "十二", "初一", "廿三"
  lunarMonthText?: string; // e.g. "八月", "九月"
  solarTerm?: string; // e.g. "白露", "秋分"
  festival?: string; // e.g. "中秋节", "国庆节"
  shifts: ShiftEntry[];
}

export interface RosterSettings {
  startDayOfWeek: 0 | 1; // 1 = Monday, 0 = Sunday
  showLunar: boolean;
  showFestivals: boolean;
  showWeekendsHighlight: boolean;
  badgeStyle: 'filled' | 'outline' | 'compact';
  cellSize: 'compact' | 'standard' | 'spacious';
  calendarWidth: 'compact' | 'standard' | 'full';
  theme?: 'light' | 'dark' | 'system';
  title: string;
}

export type ViewMode = 'calendar' | 'table' | 'stats';
