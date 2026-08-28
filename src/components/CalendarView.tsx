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
    <div className="bg-white rounded-xl border border-[#E8E8E3] overflow-hidden">
      {/* Weekday header bar */}
      <div className="grid grid-cols-7 border-b border-[#E8E8E3] bg-[#F6F6F2] text-center font-medium text-xs text-neutral-600">
        {weekDays.map((wd, idx) => {
          const isWeekend =
            startDayOfWeek === 1
              ? idx === 5 || idx === 6
              : idx === 0 || idx === 6;

          return (
            <div
              key={wd}
              className={`py-2.5 border-r border-[#E8E8E3] last:border-r-0 tracking-wider ${
                isWeekend && showWeekendsHighlight ? 'text-neutral-900 bg-[#EFEFEA]' : ''
              }`}
            >
              {wd}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-l border-t border-[#E8E8E3]">
        {days.map((day) => (
          <DayCell
            key={day.dateStr}
            day={day}
            activeBrushMember={activeBrushMember}
            selectedFilterMember={selectedFilterMember}
            showLunar={showLunar}
            showWeekendsHighlight={showWeekendsHighlight}
            onCellClick={onCellClick}
            onRemoveShift={onRemoveShift}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </div>
  );
};
