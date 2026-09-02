import React from 'react';
import { Member, ShiftEntry } from '../types';
import { UserCheck, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatsBarProps {
  year: number;
  month: number;
  members: Member[];
  shifts: ShiftEntry[];
  selectedFilterMember: string | null;
  onSelectFilterMember: (name: string | null) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  year,
  month,
  members,
  shifts,
  selectedFilterMember,
  onSelectFilterMember,
}) => {
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const currentMonthShifts = shifts.filter((s) => s.dateStr.startsWith(monthPrefix));
  const daysInMonth = new Date(year, month, 0).getDate();

  // Unique scheduled days
  const scheduledDaysCount = new Set(currentMonthShifts.map((s) => s.dateStr)).size;
  const unscheduledDaysCount = daysInMonth - scheduledDaysCount;

  // Counts per member
  const memberCounts: Record<string, number> = {};
  members.forEach((m) => {
    memberCounts[m.name] = 0;
  });

  currentMonthShifts.forEach((s) => {
    memberCounts[s.memberName] = (memberCounts[s.memberName] || 0) + 1;
  });

  return (
    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs mb-3 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Quick overview indicators */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
            <UserCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>排班人次:</span>
            <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white tabular-nums">{currentMonthShifts.length}</span>
          </div>

          <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
            <span>已排:</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{scheduledDaysCount}</span>
            <span>/</span>
            <span>{daysInMonth}天</span>
          </div>

          {unscheduledDaysCount > 0 ? (
            <span className="text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              余 {unscheduledDaysCount} 天
            </span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              全月排满
            </span>
          )}
        </div>

        {/* Right: Member pills with count & click to filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mr-0.5 flex items-center gap-1">
            <Filter className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
            <span>人员统计:</span>
          </span>

          {Object.entries(memberCounts).map(([name, count]) => {
            const memberObj = members.find((m) => m.name === name);
            const color = memberObj?.color || '#2563eb';
            const isSelected = selectedFilterMember === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelectFilterMember(isSelected ? null : name)}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-neutral-900 dark:ring-white text-white font-semibold shadow-xs'
                    : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700'
                }`}
                style={isSelected ? { backgroundColor: color } : {}}
                title={`点击筛选只看 ${name} 的排班`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
                <span
                  className={`px-1 rounded text-[10px] font-bold tabular-nums ${
                    isSelected ? 'bg-black/25 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {count}天
                </span>
              </button>
            );
          })}

          {selectedFilterMember && (
            <button
              type="button"
              onClick={() => onSelectFilterMember(null)}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white underline underline-offset-2 ml-1"
            >
              重置筛选
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
