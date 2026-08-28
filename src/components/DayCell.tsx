import React from 'react';
import { CalendarDayInfo, ShiftEntry } from '../types';
import { Plus, X, User } from 'lucide-react';

interface DayCellProps {
  day: CalendarDayInfo;
  activeBrushMember: { id?: string; name: string; color: string } | null;
  selectedFilterMember: string | null;
  showLunar: boolean;
  showWeekendsHighlight: boolean;
  onCellClick: (day: CalendarDayInfo) => void;
  onRemoveShift: (shiftId: string, e: React.MouseEvent) => void;
  onQuickAdd: (day: CalendarDayInfo, e: React.MouseEvent) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  activeBrushMember,
  selectedFilterMember,
  showLunar,
  showWeekendsHighlight,
  onCellClick,
  onRemoveShift,
  onQuickAdd,
}) => {
  const isWeekendDay = day.isWeekend;
  const hasFilter = Boolean(selectedFilterMember);
  const isFilteredIn = !hasFilter || day.shifts.some(s => s.memberName === selectedFilterMember);

  // Check if first day of solar month
  const isFirstOfMonth = day.day === 1;

  return (
    <div
      id={`day-cell-${day.dateStr}`}
      onClick={() => onCellClick(day)}
      className={`group relative min-h-[105px] sm:min-h-[120px] p-2 sm:p-2.5 border-b border-r border-[#E8E8E3] transition-colors cursor-pointer select-none flex flex-col justify-between ${
        day.isCurrentMonth ? 'bg-white' : 'bg-[#F9F9F7] text-neutral-400'
      } ${
        showWeekendsHighlight && isWeekendDay && day.isCurrentMonth ? 'bg-[#FAFAF6]' : ''
      } ${
        hasFilter && !isFilteredIn ? 'opacity-25' : 'opacity-100'
      } ${
        activeBrushMember
          ? 'hover:bg-[#F2F2EB]'
          : 'hover:bg-[#F8F8F4]'
      }`}
    >
      {/* Top row: Solar day number & Lunar / Solar term text */}
      <div className="flex items-start justify-between w-full">
        {/* Day Number / Month indicator */}
        <div className="flex items-baseline gap-1">
          {isFirstOfMonth && (
            <span className={`text-[11px] sm:text-xs font-serif font-semibold ${day.isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'}`}>
              {day.month}月
            </span>
          )}
          {day.isToday ? (
            <span
              id={`today-badge-${day.dateStr}`}
              className="inline-flex items-center justify-center w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#1C1C1A] text-white font-serif font-semibold text-xs sm:text-sm"
            >
              {day.day}
            </span>
          ) : (
            <span
              className={`font-serif text-sm sm:text-base transition-colors ${
                day.isCurrentMonth
                  ? isWeekendDay && showWeekendsHighlight
                    ? 'text-neutral-900 font-semibold'
                    : 'text-[#1C1C1A] group-hover:text-black font-normal'
                  : 'text-neutral-400'
              }`}
            >
              {day.day}
            </span>
          )}
        </div>

        {/* Lunar Date / Festival / Solar Term */}
        {showLunar && (
          <div className="text-right">
            <span
              className={`text-[10px] sm:text-[11px] leading-tight block ${
                day.festival
                  ? 'text-neutral-900 font-medium'
                  : day.solarTerm
                  ? 'text-neutral-700 font-medium'
                  : day.isCurrentMonth
                  ? 'text-neutral-400'
                  : 'text-neutral-300'
              }`}
              title={day.festival || day.solarTerm || day.lunarText}
            >
              {day.festival || day.solarTerm || day.lunarText}
            </span>
          </div>
        )}
      </div>

      {/* Shifts container: badges */}
      <div className="mt-1.5 flex flex-col gap-1 flex-1 justify-start">
        {day.shifts.map((shift: ShiftEntry) => {
          const shiftColor = shift.color || '#2563eb';
          const isHighlighted = selectedFilterMember === shift.memberName;

          return (
            <div
              key={shift.id}
              id={`shift-badge-${shift.id}`}
              className={`group/badge relative inline-flex items-center justify-between px-2 py-0.5 rounded text-xs font-medium text-white shadow-2xs transition-all ${
                isHighlighted ? 'ring-2 ring-offset-1 ring-[#1C1C1A] scale-[1.02]' : ''
              }`}
              style={{ backgroundColor: shiftColor }}
              title={`${shift.memberName}${shift.shiftLabel ? ` (${shift.shiftLabel})` : ''}${shift.note ? `: ${shift.note}` : ''}`}
            >
              <div className="flex items-center gap-1 truncate max-w-[85%]">
                <span className="truncate">{shift.memberName}</span>
                {shift.shiftLabel && (
                  <span className="text-[10px] opacity-80 px-1 py-0.2 bg-black/20 rounded">
                    {shift.shiftLabel}
                  </span>
                )}
              </div>

              {/* Remove icon on hover */}
              <button
                type="button"
                onClick={(e) => onRemoveShift(shift.id, e)}
                className="opacity-0 group-hover/badge:opacity-100 hover:bg-black/30 rounded p-0.5 transition-opacity ml-1"
                title="删除该排班"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          );
        })}

        {/* Hover Quick Add indicator when no brush mode and hovering */}
        {!activeBrushMember && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-1 flex justify-end">
            <button
              type="button"
              onClick={(e) => onQuickAdd(day, e)}
              className="inline-flex items-center gap-0.5 text-[11px] text-neutral-700 hover:text-black hover:bg-[#E8E8E3] rounded px-1.5 py-0.5 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>加人</span>
            </button>
          </div>
        )}
      </div>

      {/* Active brush indicator visual overlay when hovering */}
      {activeBrushMember && (
        <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <span
            className="px-2 py-0.5 text-xs text-white rounded font-medium shadow-xs"
            style={{ backgroundColor: activeBrushMember.color }}
          >
            + {activeBrushMember.name}
          </span>
        </div>
      )}
    </div>
  );
};
