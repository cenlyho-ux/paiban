import React from 'react';
import { CalendarDayInfo, ShiftEntry } from '../types';
import { Plus, X, User } from 'lucide-react';

interface DayCellProps {
  day: CalendarDayInfo;
  activeBrushMember: { id?: string; name: string; color: string } | null;
  selectedFilterMember: string | null;
  showLunar: boolean;
  showWeekendsHighlight: boolean;
  cellSize?: 'compact' | 'standard' | 'spacious';
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
  cellSize = 'compact',
  onCellClick,
  onRemoveShift,
  onQuickAdd,
}) => {
  const isWeekendDay = day.isWeekend;
  const hasFilter = Boolean(selectedFilterMember);
  const isFilteredIn = !hasFilter || day.shifts.some(s => s.memberName === selectedFilterMember);

  // Check if first day of solar month
  const isFirstOfMonth = day.day === 1;

  // Cell sizing styles based on density
  const sizeClasses = {
    compact: 'min-h-[46px] sm:min-h-[52px] p-1 sm:p-1.5',
    standard: 'min-h-[58px] sm:min-h-[64px] p-1.5 sm:p-2',
    spacious: 'min-h-[72px] sm:min-h-[80px] p-2 sm:p-2.5',
  }[cellSize];

  return (
    <div
      id={`day-cell-${day.dateStr}`}
      onClick={() => onCellClick(day)}
      className={`group relative ${sizeClasses} border-b border-r border-neutral-200/80 dark:border-neutral-800 transition-colors cursor-pointer select-none flex flex-col justify-between ${
        day.isCurrentMonth
          ? 'bg-white dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200'
          : 'bg-neutral-100/50 dark:bg-neutral-950/50 text-neutral-400 dark:text-neutral-600'
      } ${
        showWeekendsHighlight && isWeekendDay && day.isCurrentMonth
          ? 'bg-neutral-50/80 dark:bg-neutral-800/30'
          : ''
      } ${
        hasFilter && !isFilteredIn ? 'opacity-25' : 'opacity-100'
      } ${
        activeBrushMember
          ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
      }`}
    >
      {/* Top row: Solar day number & Lunar / Solar term text */}
      <div className="flex items-start justify-between w-full">
        {/* Day Number / Month indicator */}
        <div className="flex items-baseline gap-0.5 sm:gap-1">
          {isFirstOfMonth && (
            <span className={`text-[10px] sm:text-[11px] font-bold ${day.isCurrentMonth ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-600'}`}>
              {day.month}月
            </span>
          )}
          {day.isToday ? (
            <span
              id={`today-badge-${day.dateStr}`}
              className="inline-flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-[10px] sm:text-[11px] shadow-xs"
            >
              {day.day}
            </span>
          ) : (
            <span
              className={`text-xs sm:text-sm tabular-nums transition-colors ${
                day.isCurrentMonth
                  ? isWeekendDay && showWeekendsHighlight
                    ? 'text-neutral-900 dark:text-white font-bold'
                    : 'text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white font-semibold'
                  : 'text-neutral-400 dark:text-neutral-600'
              }`}
            >
              {day.day}
            </span>
          )}
        </div>

        {/* Lunar Date / Festival / Solar Term */}
        {showLunar && (
          <div className="text-right pl-1">
            <span
              className={`text-[9px] sm:text-[10px] leading-tight block truncate max-w-[58px] sm:max-w-[72px] ${
                day.festival
                  ? 'text-neutral-900 dark:text-amber-400 font-semibold'
                  : day.solarTerm
                  ? 'text-neutral-700 dark:text-emerald-400 font-medium'
                  : day.isCurrentMonth
                  ? 'text-neutral-400 dark:text-neutral-500'
                  : 'text-neutral-300 dark:text-neutral-700'
              }`}
              title={day.festival || day.solarTerm || day.lunarText}
            >
              {day.festival || day.solarTerm || day.lunarText}
            </span>
          </div>
        )}
      </div>

      {/* Shifts container: badges */}
      <div className="mt-1 flex flex-col gap-0.5 sm:gap-1 flex-1 justify-start">
        {day.shifts.map((shift: ShiftEntry) => {
          const shiftColor = shift.color || '#2563eb';
          const isHighlighted = selectedFilterMember === shift.memberName;

          return (
            <div
              key={shift.id}
              id={`shift-badge-${shift.id}`}
              className={`group/badge relative inline-flex items-center justify-between px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium text-white shadow-2xs transition-all leading-tight ${
                isHighlighted ? 'ring-2 ring-offset-1 ring-neutral-900 dark:ring-white scale-[1.02]' : ''
              }`}
              style={{ backgroundColor: shiftColor }}
              title={`${shift.memberName}${shift.shiftLabel ? ` (${shift.shiftLabel})` : ''}${shift.note ? `: ${shift.note}` : ''}`}
            >
              <div className="flex items-center gap-1 truncate max-w-[85%]">
                <span className="truncate font-medium">{shift.memberName}</span>
                {shift.shiftLabel && (
                  <span className="text-[9px] opacity-90 px-0.5 py-0 bg-black/25 rounded">
                    {shift.shiftLabel}
                  </span>
                )}
              </div>

              {/* Remove icon on hover */}
              <button
                type="button"
                onClick={(e) => onRemoveShift(shift.id, e)}
                className="opacity-0 group-hover/badge:opacity-100 hover:bg-black/30 rounded p-0.5 transition-opacity ml-0.5"
                title="删除该排班"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          );
        })}

        {/* Hover Quick Add indicator when no brush mode and hovering */}
        {!activeBrushMember && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-0.5 flex justify-end">
            <button
              type="button"
              onClick={(e) => onQuickAdd(day, e)}
              className="inline-flex items-center gap-0.5 text-[10px] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded px-1 py-0.5 transition-all shadow-2xs"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>加人</span>
            </button>
          </div>
        )}
      </div>

      {/* Active brush indicator visual overlay when hovering */}
      {activeBrushMember && (
        <div className="absolute inset-0 bg-neutral-900/5 dark:bg-white/5 pointer-events-none opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <span
            className="px-1.5 py-0.5 text-[10px] sm:text-xs text-white rounded font-medium shadow-xs"
            style={{ backgroundColor: activeBrushMember.color }}
          >
            + {activeBrushMember.name}
          </span>
        </div>
      )}
    </div>
  );
};
