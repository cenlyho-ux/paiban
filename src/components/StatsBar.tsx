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
    <div className="bg-white rounded-xl p-3.5 border border-[#E8E8E3] mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quick overview indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-neutral-800">
            <UserCheck className="w-4 h-4 text-neutral-700" />
            <span>本月总排班人次:</span>
            <span className="font-serif font-bold text-base text-[#1C1C1A]">{currentMonthShifts.length}</span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-500">
            <span>已排天数:</span>
            <span className="font-serif font-semibold text-neutral-800">{scheduledDaysCount}</span>
            <span>/</span>
            <span>共{daysInMonth}天</span>
          </div>

          {unscheduledDaysCount > 0 ? (
            <span className="text-neutral-700 bg-[#F6F6F2] border border-[#E8E8E3] px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-neutral-500" />
              未排 {unscheduledDaysCount} 天
            </span>
          ) : (
            <span className="text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              本月已排满
            </span>
          )}
        </div>

        {/* Right: Member pills with count & click to filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-neutral-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            人员天数:
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'ring-1 ring-[#1C1C1A] text-white font-semibold shadow-xs'
                    : 'bg-[#F6F6F2] hover:bg-[#EBEBE5] text-neutral-800 border border-[#E8E8E3]'
                }`}
                style={isSelected ? { backgroundColor: color } : {}}
                title={`点击筛选只看 ${name} 的排班`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-[#E8E8E3] text-neutral-800'
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
              className="text-xs text-neutral-600 hover:text-black underline underline-offset-2 ml-1"
            >
              清除筛选
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
