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
    <div className="space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8E8E3]">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1 font-medium">
            <span>本月总排班人次</span>
            <ShieldCheck className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-neutral-900">{monthShifts.length} <span className="font-sans text-sm font-normal text-neutral-500">人次</span></div>
          <div className="text-xs text-neutral-500 mt-2">覆盖 {scheduledDates.size} / {totalDaysInMonth} 天</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E8E3]">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1 font-medium">
            <span>参与排班人员</span>
            <User className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-neutral-900">
            {stats.filter((s) => s.totalCount > 0).length} / {members.length} <span className="font-sans text-sm font-normal text-neutral-500">人</span>
          </div>
          <div className="text-xs text-neutral-500 mt-2">平均每人 {members.length > 0 ? (monthShifts.length / members.length).toFixed(1) : 0} 天</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E8E3]">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1 font-medium">
            <span>未排班空缺天数</span>
            <Calendar className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-neutral-900">
            {unassignedDays.length} <span className="font-sans text-sm font-normal text-neutral-500">天</span>
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            {unassignedDays.length === 0 ? '所有日期均已安排人员' : '需尽快补齐空缺人员'}
          </div>
        </div>
      </div>

      {/* Member breakdown chart & list */}
      <div className="bg-white p-6 rounded-xl border border-[#E8E8E3]">
        <h3 className="text-base font-serif font-semibold text-neutral-900 mb-5 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-neutral-700" />
          <span>{year}年{month}月 各人员排班统计详情</span>
        </h3>

        <div className="space-y-4">
          {stats.map((item) => (
            <div key={item.member.id} className="p-4 rounded-xl border border-[#E8E8E3] bg-[#FDFDFB] hover:bg-white transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-2xs"
                    style={{ backgroundColor: item.member.color }}
                  />
                  <span className="font-medium text-neutral-900 text-sm">{item.member.name}</span>
                  <span className="text-xs text-neutral-400">({item.member.role || '值班'})</span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-neutral-600">
                    工作日: <strong className="text-neutral-900">{item.weekdayCount}</strong> 天
                  </span>
                  <span className="text-neutral-700 bg-[#F6F6F2] border border-[#E8E8E3] px-2 py-0.5 rounded">
                    周末: <strong className="text-neutral-900">{item.weekendCount}</strong> 天
                  </span>
                  <span className="font-serif font-bold text-sm text-[#1C1C1A]">
                    总计: {item.totalCount} 天
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#EBEBE5] rounded-full overflow-hidden">
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
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-neutral-400">排班日期:</span>
                  {item.shifts.map((s) => {
                    const dayNum = Number(s.dateStr.split('-')[2]);
                    return (
                      <span
                        key={s.id}
                        className="px-1.5 py-0.5 rounded bg-white border border-[#E8E8E3] text-[11px] text-neutral-700 font-serif"
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
