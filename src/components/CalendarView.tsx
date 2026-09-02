import React from 'react';
import { CalendarDayInfo, ShiftEntry } from '../types';
import { DayCell } from './DayCell';

interface CalendarViewProps {
  days: CalendarDayInfo[];
  startDayOfWeek: 0 | 1;
  activeBrushMember: { id?: string; name: string; color: string } | null;
  selectedFilterMember: string | null;
  showLunar: boolean;
  showWeekendsHighlight: boolean;
  cellSize?: 'compact' | 'standard' | 'spacious';
  onCellClick: (day: CalendarDayInfo) => void;
  onRemoveShift: (shiftId: string, e: React.MouseEvent) => void;
  onQuickAdd: (day: CalendarDayInfo, e: React.MouseEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  days,
  startDayOfWeek,
  activeBrushMember,
  selectedFilterMember,
  showLunar,
  showWeekendsHighlight,
  cellSize = 'compact',
  onCellClick,
  onRemoveShift,
  onQuickAdd,
}) => {
  // Weekday headers
  const weekDays =
    startDayOfWeek === 1
      ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors">
      {/* Weekday header bar */}
      <div className="grid grid-cols-7 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-800/80 text-center font-semibold text-xs text-neutral-600 dark:text-neutral-400">
        {weekDays.map((wd, idx) => {
          const isWeekend =
            startDayOfWeek === 1
              ? idx === 5 || idx === 6
              : idx === 0 || idx === 6;

          return (
            <div
              key={wd}
              className={`py-1.5 border-r border-neutral-200/80 dark:border-neutral-800 last:border-r-0 tracking-wider text-[11px] sm:text-xs ${
                isWeekend && showWeekendsHighlight
                  ? 'text-neutral-900 dark:text-neutral-200 bg-neutral-200/50 dark:bg-neutral-700/40 font-bold'
                  : ''
              }`}
            >
              {wd}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-l border-t border-neutral-200/80 dark:border-neutral-800">
        {days.map((day) => (
          <DayCell
            key={day.dateStr}
            day={day}
            activeBrushMember={activeBrushMember}
            selectedFilterMember={selectedFilterMember}
            showLunar={showLunar}
            showWeekendsHighlight={showWeekendsHighlight}
            cellSize={cellSize}
            onCellClick={onCellClick}
            onRemoveShift={onRemoveShift}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </div>
  );
};
