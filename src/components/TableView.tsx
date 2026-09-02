import React, { useState } from 'react';
import { CalendarDayInfo, Member, ShiftEntry } from '../types';
import { formatDateStr } from '../utils/calendarUtils';
import { Plus, Trash2, Edit2, Calendar, User, Search, Filter } from 'lucide-react';

interface TableViewProps {
  days: CalendarDayInfo[];
  members: Member[];
  year: number;
  month: number;
  onOpenDayEdit: (day: CalendarDayInfo) => void;
  onAddShift: (dateStr: string, memberName: string, color?: string, shiftLabel?: string) => void;
  onRemoveShift: (shiftId: string) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  days,
  members,
  year,
  month,
  onOpenDayEdit,
  onAddShift,
  onRemoveShift,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShiftState, setFilterShiftState] = useState<'all' | 'assigned' | 'unassigned'>('all');

  // Filter only days of current month for the table
  const currentMonthDays = days.filter((d) => d.isCurrentMonth);

  const filteredDays = currentMonthDays.filter((day) => {
    // Shift state filter
    if (filterShiftState === 'assigned' && day.shifts.length === 0) return false;
    if (filterShiftState === 'unassigned' && day.shifts.length > 0) return false;

    // Search query
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const hasMemberMatch = day.shifts.some((s) => s.memberName.toLowerCase().includes(term));
      const hasDateMatch = day.dateStr.includes(term) || `${day.day}日`.includes(term);
      const hasLunarMatch = day.lunarText.includes(term) || (day.festival && day.festival.includes(term));
      if (!hasMemberMatch && !hasDateMatch && !hasLunarMatch) return false;
    }

    return true;
  });

  const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors">
      {/* Top Filter Bar */}
      <div className="p-3.5 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-800/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-900 dark:text-white text-sm">
            {year}年{month}月 排班清单 (共 {currentMonthDays.length} 天)
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center bg-white dark:bg-neutral-900 p-0.5 rounded-lg border border-neutral-200/80 dark:border-neutral-700 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setFilterShiftState('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                filterShiftState === 'all' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setFilterShiftState('assigned')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                filterShiftState === 'assigned' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              已排人员
            </button>
            <button
              type="button"
              onClick={() => setFilterShiftState('unassigned')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                filterShiftState === 'unassigned' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              未排人员
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索人员、日期或节日..."
              className="pl-8 pr-3 py-1 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200/80 dark:border-neutral-700 rounded-lg w-44 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white shadow-2xs placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 font-semibold border-b border-neutral-200/80 dark:border-neutral-800">
            <tr>
              <th className="py-2.5 px-4 w-32 font-semibold">公历日期</th>
              <th className="py-2.5 px-3 w-20 font-semibold">星期</th>
              <th className="py-2.5 px-3 w-28 font-semibold">农历/节气</th>
              <th className="py-2.5 px-4 font-semibold">排班人员 (值班/负责人)</th>
              <th className="py-2.5 px-4 text-right w-24 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800">
            {filteredDays.map((day) => {
              const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6;

              return (
                <tr
                  key={day.dateStr}
                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors ${
                    day.isToday ? 'bg-neutral-100/60 dark:bg-neutral-800/40' : isWeekend ? 'bg-neutral-50/50 dark:bg-neutral-900/40' : ''
                  }`}
                >
                  {/* Date */}
                  <td className="py-2.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    <div className="flex items-center gap-2">
                      {day.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white" />
                      )}
                      <span>
                        {day.month}月{day.day}日
                      </span>
                    </div>
                  </td>

                  {/* Weekday */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        isWeekend ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200' : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {weekDayNames[day.dayOfWeek]}
                    </span>
                  </td>

                  {/* Lunar */}
                  <td className="py-2.5 px-3 text-neutral-500 dark:text-neutral-400 text-xs">
                    {day.festival ? (
                      <span className="font-semibold text-neutral-900 dark:text-amber-400">{day.festival}</span>
                    ) : day.solarTerm ? (
                      <span className="font-medium text-neutral-800 dark:text-emerald-400">{day.solarTerm}</span>
                    ) : (
                      <span>{day.lunarText}</span>
                    )}
                  </td>

                  {/* Shift Badges */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {day.shifts.length === 0 ? (
                        <span className="text-neutral-400 dark:text-neutral-600 text-xs italic">暂未安排</span>
                      ) : (
                        day.shifts.map((shift) => (
                          <span
                            key={shift.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-white shadow-2xs"
                            style={{ backgroundColor: shift.color || '#2563eb' }}
                          >
                            <span>{shift.memberName}</span>
                            {shift.shiftLabel && (
                              <span className="opacity-90 text-[10px]">({shift.shiftLabel})</span>
                            )}
                            <button
                              type="button"
                              onClick={() => onRemoveShift(shift.id)}
                              className="hover:bg-black/30 rounded p-0.5 transition-colors"
                              title="移除"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenDayEdit(day)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-md transition-all shadow-2xs active:scale-95"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>编辑</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
