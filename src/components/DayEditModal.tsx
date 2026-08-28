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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="day-edit-modal"
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E8E8E3] animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F6F6F2] border-b border-[#E8E8E3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C1C1A] text-white flex flex-col items-center justify-center font-serif font-semibold shadow-xs">
              <span className="text-[10px] leading-tight font-sans font-normal opacity-80">{day.month}月</span>
              <span className="text-sm leading-none">{day.day}</span>
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-neutral-900 flex items-center gap-2">
                <span>{day.year}年{day.month}月{day.day}日</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#E8E8E3] text-neutral-800 font-sans font-medium">
                  {dayOfWeekName}
                </span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                农历 {day.lunarMonthText}{day.lunarText}
                {day.solarTerm ? ` · ${day.solarTerm}` : ''}
                {day.festival ? ` · ${day.festival}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1.5 rounded-lg hover:bg-[#E8E8E3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Current Shifts on this day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                当日排班人员 ({day.shifts.length})
              </label>
              {day.shifts.length > 0 && (
                <button
                  type="button"
                  onClick={() => onClearDayShifts(day.dateStr)}
                  className="text-xs text-neutral-500 hover:text-rose-600 font-medium hover:underline flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  清空此日排班
                </button>
              )}
            </div>

            {day.shifts.length === 0 ? (
              <div className="py-4 text-center border border-dashed border-[#E8E8E3] rounded-xl text-neutral-400 text-xs font-serif">
                暂无排班，请在下方点击人员或输入姓名添加
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {day.shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8E8E3] bg-[#FDFDFB] hover:bg-[#F6F6F2] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: shift.color || '#2563eb' }}
                      />
                      <span className="font-medium text-neutral-900 text-sm">
                        {shift.memberName}
                      </span>
                      {shift.shiftLabel && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#E8E8E3] text-neutral-800 font-medium">
                          {shift.shiftLabel}
                        </span>
                      )}
                      {shift.note && (
                        <span className="text-xs text-neutral-500 italic truncate max-w-[140px]">
                          {shift.note}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveShift(shift.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                      title="移除人员"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[#E8E8E3] pt-4 space-y-4">
            {/* Shift label / Shift type selection */}
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
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
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-[#1C1C1A] text-white shadow-xs'
                          : 'bg-[#F6F6F2] text-neutral-700 hover:bg-[#EBEBE5] border border-[#E8E8E3]'
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
              <label className="text-xs font-semibold text-neutral-700 flex items-center justify-between mb-1.5">
                <span>常用人员 (点击一键排入)</span>
                <span className="text-[11px] text-neutral-400 font-normal">点击即可添加</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => {
                  const alreadyAssigned = day.shifts.some(s => s.memberName === m.name);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleQuickAddMember(m)}
                      className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E3] text-xs font-medium bg-white hover:bg-[#F6F6F2] transition-all hover:shadow-xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="text-neutral-900 font-medium">{m.name}</span>
                      {alreadyAssigned && (
                        <span className="text-[10px] text-neutral-600 bg-[#E8E8E3] rounded-full px-1">已在班</span>
                      )}
                      <Plus className="w-3 h-3 text-neutral-400 group-hover:text-black" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Name / Note input Form */}
            <form onSubmit={handleCustomAdd} className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                输入新名字或特殊人员
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="输入名字，如：张三、李四..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E8E3] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-black bg-[#FDFDFB]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputName.trim()}
                  className="px-4 py-2 bg-[#1C1C1A] hover:bg-black disabled:opacity-40 text-white text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>

              {/* Note input */}
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="可选备注：如 需带钥匙、晚到半小时等"
                className="w-full px-3 py-1.5 text-xs border border-[#E8E8E3] rounded-lg text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-black bg-[#FDFDFB]"
              />
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F6F6F2] border-t border-[#E8E8E3] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1C1C1A] hover:bg-black text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
