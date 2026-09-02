import React from 'react';
import { CalendarDayInfo, Member, ShiftEntry } from '../types';
import { BarChart3, User, Calendar, ShieldCheck, Sun, Moon } from 'lucide-react';

interface StatsViewProps {
  days: CalendarDayInfo[];
  members: Member[];
  year: number;
  month: number;
  shifts: ShiftEntry[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  days,
  members,
  year,
  month,
  shifts,
}) => {
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthDays = days.filter((d) => d.isCurrentMonth);
  const totalDaysInMonth = monthDays.length;

  const monthShifts = shifts.filter((s) => s.dateStr.startsWith(monthPrefix));

  // Compute detailed stats per member
  const stats = members.map((member) => {
    const memberShifts = monthShifts.filter((s) => s.memberName === member.name);
    
    // Count weekend shifts
    const weekendShiftsCount = memberShifts.filter((s) => {
      const dayInfo = days.find((d) => d.dateStr === s.dateStr);
      return dayInfo?.isWeekend;
    }).length;

    // Count weekday shifts
    const weekdayShiftsCount = memberShifts.length - weekendShiftsCount;

    // Work percentage of total shifts in month
    const percentage = monthShifts.length > 0 ? ((memberShifts.length / monthShifts.length) * 100).toFixed(1) : '0';

    return {
      member,
      totalCount: memberShifts.length,
      weekendCount: weekendShiftsCount,
      weekdayCount: weekdayShiftsCount,
      percentage: Number(percentage),
      shifts: memberShifts,
    };
  });

  const scheduledDates = new Set(monthShifts.map((s) => s.dateStr));
  const unassignedDays = monthDays.filter((d) => !scheduledDates.has(d.dateStr));

  return (
    <div className="space-y-3.5">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1 font-medium">
            <span>本月总排班人次</span>
            <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
            {monthShifts.length} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">人次</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 tabular-nums">覆盖 {scheduledDates.size} / {totalDaysInMonth} 天</div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1 font-medium">
            <span>参与排班人员</span>
            <User className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
            {stats.filter((s) => s.totalCount > 0).length} / {members.length} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">人</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 tabular-nums">人均 {members.length > 0 ? (monthShifts.length / members.length).toFixed(1) : 0} 天</div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-1 font-medium">
            <span>未排班空缺天数</span>
            <Calendar className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
            {unassignedDays.length} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">天</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
            {unassignedDays.length === 0 ? '所有日期均已安排人员' : '需尽快补齐空缺人员'}
          </div>
        </div>
      </div>

      {/* Member breakdown chart & list */}
      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-colors">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3.5 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          <span>{year}年{month}月 各人员排班统计明细</span>
        </h3>

        <div className="space-y-2.5">
          {stats.map((item) => (
            <div key={item.member.id} className="p-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850 hover:bg-white dark:hover:bg-neutral-800 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shadow-2xs shrink-0"
                    style={{ backgroundColor: item.member.color }}
                  />
                  <span className="font-semibold text-neutral-900 dark:text-white text-xs sm:text-sm">{item.member.name}</span>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500">({item.member.role || '值班'})</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    工作日: <strong className="text-neutral-900 dark:text-neutral-200 tabular-nums">{item.weekdayCount}</strong> 天
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 px-1.5 py-0.5 rounded text-[11px]">
                    周末: <strong className="text-neutral-900 dark:text-white tabular-nums">{item.weekendCount}</strong> 天
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white tabular-nums">
                    总计: {item.totalCount} 天
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                    backgroundColor: item.member.color,
                  }}
                />
              </div>

              {/* Dates list pills */}
              {item.shifts.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500">排班日期:</span>
                  {item.shifts.map((s) => {
                    const dayNum = Number(s.dateStr.split('-')[2]);
                    return (
                      <span
                        key={s.id}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] text-neutral-700 dark:text-neutral-300 tabular-nums font-medium"
                      >
                        {dayNum}日
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
