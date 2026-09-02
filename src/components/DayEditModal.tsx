import React, { useState } from 'react';
import { CalendarDayInfo, Member, ShiftEntry, ShiftType } from '../types';
import { X, Plus, Trash2, Calendar, User, Clock, Check, Sparkles } from 'lucide-react';

interface DayEditModalProps {
  day: CalendarDayInfo | null;
  members: Member[];
  onClose: () => void;
  onAddShift: (dateStr: string, memberName: string, color?: string, shiftLabel?: string, note?: string) => void;
  onRemoveShift: (shiftId: string) => void;
  onClearDayShifts: (dateStr: string) => void;
}

const SHIFT_TYPE_PRESETS: { label: string; type: ShiftType }[] = [
  { label: '全天', type: 'all' },
  { label: '早班', type: 'morning' },
  { label: '中班', type: 'afternoon' },
  { label: '晚班', type: 'night' },
  { label: '值班', type: 'duty' },
];

export const DayEditModal: React.FC<DayEditModalProps> = ({
  day,
  members,
  onClose,
  onAddShift,
  onRemoveShift,
  onClearDayShifts,
}) => {
  if (!day) return null;

  const [inputName, setInputName] = useState('');
  const [selectedShiftLabel, setSelectedShiftLabel] = useState<string>('值班');
  const [note, setNote] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(members[0]?.color || '#2563eb');

  const handleQuickAddMember = (member: Member) => {
    onAddShift(day.dateStr, member.name, member.color, selectedShiftLabel, note);
    setNote('');
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    // Check if name matches an existing member to reuse color
    const matchedMember = members.find(m => m.name.trim() === inputName.trim());
    const color = matchedMember ? matchedMember.color : selectedColor;

    onAddShift(day.dateStr, inputName.trim(), color, selectedShiftLabel, note);
    setInputName('');
    setNote('');
  };

  const dayOfWeekName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day.dayOfWeek];

  return (
    <div
      id="day-edit-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="day-edit-modal"
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-neutral-200/80 dark:border-neutral-800 animate-in zoom-in-95 duration-150 transition-colors"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex flex-col items-center justify-center font-bold shadow-xs">
              <span className="text-[9px] leading-tight font-normal opacity-80">{day.month}月</span>
              <span className="text-sm leading-none tabular-nums">{day.day}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>{day.year}年{day.month}月{day.day}日</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-200/80 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold">
                  {dayOfWeekName}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                农历 {day.lunarMonthText}{day.lunarText}
                {day.solarTerm ? ` · ${day.solarTerm}` : ''}
                {day.festival ? ` · ${day.festival}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-black dark:hover:text-white p-1.5 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Current Shifts on this day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                当日排班人员 ({day.shifts.length})
              </label>
              {day.shifts.length > 0 && (
                <button
                  type="button"
                  onClick={() => onClearDayShifts(day.dateStr)}
                  className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  清空此日排班
                </button>
              )}
            </div>

            {day.shifts.length === 0 ? (
              <div className="py-3 text-center border border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-400 dark:text-neutral-500 text-xs">
                暂无排班，请在下方点击人员或输入姓名添加
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {day.shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: shift.color || '#2563eb' }}
                      />
                      <span className="font-semibold text-neutral-900 dark:text-white text-xs sm:text-sm">
                        {shift.memberName}
                      </span>
                      {shift.shiftLabel && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium">
                          {shift.shiftLabel}
                        </span>
                      )}
                      {shift.note && (
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 italic truncate max-w-[140px]">
                          {shift.note}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveShift(shift.id)}
                      className="text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="移除人员"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200/70 dark:border-neutral-800 pt-3.5 space-y-3.5">
            {/* Shift label / Shift type selection */}
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                班次类型
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SHIFT_TYPE_PRESETS.map((preset) => {
                  const isSelected = selectedShiftLabel === preset.label;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSelectedShiftLabel(preset.label)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs font-bold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/80 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick 1-click Member Buttons */}
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-between mb-1.5">
                <span>常用人员 (点击一键排入)</span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">点击即可添加</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => {
                  const alreadyAssigned = day.shifts.some(s => s.memberName === m.name);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleQuickAddMember(m)}
                      className="group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-700 text-xs font-medium bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all shadow-2xs active:scale-95 text-neutral-900 dark:text-white"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="font-semibold">{m.name}</span>
                      {alreadyAssigned && (
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 rounded px-1">已在班</span>
                      )}
                      <Plus className="w-3 h-3 text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Name / Note input Form */}
            <form onSubmit={handleCustomAdd} className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                输入新名字或特殊人员
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="输入名字，如：张三、李四..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-neutral-200/80 dark:border-neutral-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputName.trim()}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-40 text-white dark:text-neutral-900 text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1 shrink-0 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加
                </button>
              </div>

              {/* Note input */}
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="可选备注：如 需带钥匙、晚到半小时等"
                className="w-full px-3 py-1.5 text-xs border border-neutral-200/80 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white bg-white dark:bg-neutral-800"
              />
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-neutral-100/80 dark:bg-neutral-800/80 border-t border-neutral-200/80 dark:border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
