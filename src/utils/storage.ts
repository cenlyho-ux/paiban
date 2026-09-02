import { Member, ShiftEntry, RosterSettings } from '../types';
import { DEFAULT_MEMBERS, DEFAULT_SHIFTS_SAMPLE } from './calendarUtils';

const STORAGE_KEY_SHIFTS = 'roster_calendar_shifts_v1';
const STORAGE_KEY_MEMBERS = 'roster_calendar_members_v1';
const STORAGE_KEY_SETTINGS = 'roster_calendar_settings_v1';

export const DEFAULT_SETTINGS: RosterSettings = {
  startDayOfWeek: 1, // Monday first
  showLunar: true,
  showFestivals: true,
  showWeekendsHighlight: true,
  badgeStyle: 'filled',
  cellSize: 'compact',
  calendarWidth: 'compact',
  theme: 'light',
  title: '排班小日历',
};

export function loadShifts(): ShiftEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHIFTS);
    if (!raw) {
      saveShifts(DEFAULT_SHIFTS_SAMPLE);
      return DEFAULT_SHIFTS_SAMPLE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading shifts from storage:', e);
    return DEFAULT_SHIFTS_SAMPLE;
  }
}

export function saveShifts(shifts: ShiftEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHIFTS, JSON.stringify(shifts));
  } catch (e) {
    console.error('Error saving shifts to storage:', e);
  }
}

export function loadMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (!raw) {
      saveMembers(DEFAULT_MEMBERS);
      return DEFAULT_MEMBERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading members from storage:', e);
    return DEFAULT_MEMBERS;
  }
}

export function saveMembers(members: Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Error saving members to storage:', e);
  }
}

export function loadSettings(): RosterSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: RosterSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to storage:', e);
  }
}

export function exportRosterData(shifts: ShiftEntry[], members: Member[]) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    shifts,
    members,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `排班数据_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRosterCSV(year: number, month: number, shifts: ShiftEntry[]) {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const monthShifts = shifts.filter(s => s.dateStr.startsWith(monthStr));
  
  // Group by date
  const grouped: Record<string, string[]> = {};
  monthShifts.forEach(s => {
    if (!grouped[s.dateStr]) grouped[s.dateStr] = [];
    grouped[s.dateStr].push(s.memberName + (s.shiftLabel ? `(${s.shiftLabel})` : ''));
  });

  const rows = [['日期', '值班/排班人员', '备注']];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(year, month - 1, d).getDay()];
    const people = (grouped[dateStr] || []).join('、');
    rows.push([`${dateStr} (${dayOfWeek})`, people || '无', '']);
  }

  const csvContent = '\uFEFF' + rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `排班表_${year}年${month}月.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
