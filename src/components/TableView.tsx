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
    <div className="bg-white rounded-xl border border-[#E8E8E3] overflow-hidden">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-[#E8E8E3] bg-[#F6F6F2] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-neutral-900 text-sm">
            {year}年{month}月 排班清单 (共 {currentMonthDays.length} 天)
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center bg-[#EBEBE5] p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setFilterShiftState('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterShiftState === 'all' ? 'bg-white text-[#1C1C1A] shadow-xs' : 'text-neutral-600'
              }`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setFilterShiftState('assigned')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterShiftState === 'assigned' ? 'bg-white text-[#1C1C1A] shadow-xs' : 'text-neutral-600'
              }`}
            >
              已排人员
            </button>
            <button
              type="button"
              onClick={() => setFilterShiftState('unassigned')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterShiftState === 'unassigned' ? 'bg-white text-[#1C1C1A] shadow-xs' : 'text-neutral-600'
              }`}
            >
              未排人员
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索人员、日期或节日..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E8E8E3] rounded-lg w-48 focus:outline-hidden focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F6F6F2] text-neutral-600 font-medium border-b border-[#E8E8E3]">
            <tr>
              <th className="py-3 px-4 w-32">公历日期</th>
              <th className="py-3 px-3 w-20">星期</th>
              <th className="py-3 px-3 w-28">农历/节气</th>
              <th className="py-3 px-4">排班人员 (值班/负责人)</th>
              <th className="py-3 px-4 text-right w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8E3]">
            {filteredDays.map((day) => {
              const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6;

              return (
                <tr
                  key={day.dateStr}
                  className={`hover:bg-[#F9F9F7] transition-colors ${
                    day.isToday ? 'bg-[#F2F2EB]/60' : isWeekend ? 'bg-[#FAFAF6]' : ''
                  }`}
                >
                  {/* Date */}
                  <td className="py-3 px-4 font-serif font-medium text-neutral-900">
                    <div className="flex items-center gap-2">
                      {day.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1A]" />
                      )}
                      <span>
                        {day.month}月{day.day}日
                      </span>
                    </div>
                  </td>

                  {/* Weekday */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isWeekend ? 'bg-[#E8E8E3] text-neutral-900 font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      {weekDayNames[day.dayOfWeek]}
                    </span>
                  </td>

                  {/* Lunar */}
                  <td className="py-3 px-3 text-neutral-500 text-xs">
                    {day.festival ? (
                      <span className="font-medium text-neutral-900">{day.festival}</span>
                    ) : day.solarTerm ? (
                      <span className="font-medium text-neutral-800">{day.solarTerm}</span>
                    ) : (
                      <span>{day.lunarText}</span>
                    )}
                  </td>

                  {/* Shift Badges */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {day.shifts.length === 0 ? (
                        <span className="text-neutral-400 text-xs italic font-serif">暂未安排</span>
                      ) : (
                        day.shifts.map((shift) => (
                          <span
                            key={shift.id}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium text-white shadow-2xs"
                            style={{ backgroundColor: shift.color || '#2563eb' }}
                          >
                            <span>{shift.memberName}</span>
                            {shift.shiftLabel && (
                              <span className="opacity-80 text-[10px]">({shift.shiftLabel})</span>
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
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenDayEdit(day)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-800 hover:text-black hover:bg-[#E8E8E3] border border-[#E8E8E3] rounded-lg transition-colors"
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
