import React, { useState } from 'react';
import { Member, ShiftEntry } from '../types';
import { formatDateStr } from '../utils/calendarUtils';
import { Sparkles, X, Check, ArrowRight, RefreshCw, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AutoScheduleModalProps {
  year: number;
  month: number;
  members: Member[];
  onClose: () => void;
  onApplySchedule: (newShifts: ShiftEntry[], overwriteMonth: boolean) => void;
}

export const AutoScheduleModal: React.FC<AutoScheduleModalProps> = ({
  year,
  month,
  members,
  onClose,
  onApplySchedule,
}) => {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    members.slice(0, 2).map((m) => m.id)
  );
  const [patternType, setPatternType] = useState<'alternate' | 'twoDays' | 'weekdaysOnly'>('alternate');
  const [shiftLabel, setShiftLabel] = useState('值班');
  const [overwrite, setOverwrite] = useState(true);
  const [skipWeekends, setSkipWeekends] = useState(false);

  const daysInMonth = new Date(year, month, 0).getDate();

  const toggleMemberSelection = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      if (selectedMemberIds.length <= 1) return;
      setSelectedMemberIds(selectedMemberIds.filter((mid) => mid !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const generateShifts = (): ShiftEntry[] => {
    const selectedMembers = selectedMemberIds
      .map((id) => members.find((m) => m.id === id))
      .filter((m): m is Member => !!m);

    if (selectedMembers.length === 0) return [];

    const generated: ShiftEntry[] = [];
    let memberIndex = 0;
    let daysForCurrentMember = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      if (skipWeekends && isWeekend) {
        continue;
      }

      const currentMember = selectedMembers[memberIndex % selectedMembers.length];
      const dateStr = formatDateStr(year, month, day);

      generated.push({
        id: `auto-${dateStr}-${currentMember.id}-${Date.now()}`,
        dateStr,
        memberId: currentMember.id,
        memberName: currentMember.name,
        color: currentMember.color,
        shiftLabel,
        createdAt: Date.now(),
      });

      if (patternType === 'alternate') {
        memberIndex++;
      } else if (patternType === 'twoDays') {
        daysForCurrentMember++;
        if (daysForCurrentMember >= 2) {
          daysForCurrentMember = 0;
          memberIndex++;
        }
      } else if (patternType === 'weekdaysOnly') {
        memberIndex++;
      }
    }

    return generated;
  };

  const handleApply = () => {
    const shifts = generateShifts();
    onApplySchedule(shifts, overwrite);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
    onClose();
  };

  const previewShifts = generateShifts();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-[#E8E8E3] animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F6F6F2] border-b border-[#E8E8E3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1C1C1A] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-neutral-900">
                {year}年{month}月 循环排班
              </h3>
              <p className="text-xs text-neutral-500">按指定规则一键自动填充全月排班计划</p>
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

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Step 1: Select Members */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-2">
              1. 选择参与排班的人员 (点击切换勾选，支持多选并按顺序轮流)
            </label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const isSelected = selectedMemberIds.includes(m.id);
                const order = selectedMemberIds.indexOf(m.id) + 1;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMemberSelection(m.id)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-black bg-[#F6F6F2] text-black font-semibold shadow-xs ring-1 ring-black'
                        : 'border-[#E8E8E3] bg-white text-neutral-600 hover:bg-[#F9F9F7]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: m.color }}
                    />
                    <span>{m.name}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#1C1C1A] text-white text-[10px] flex items-center justify-center font-bold font-sans">
                        {order}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Rule */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-2">
              2. 轮班规则
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPatternType('alternate')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  patternType === 'alternate'
                    ? 'border-black bg-[#F6F6F2] text-neutral-900 font-medium ring-1 ring-black'
                    : 'border-[#E8E8E3] hover:bg-[#F9F9F7] text-neutral-600'
                }`}
              >
                <div className="font-serif font-semibold mb-0.5 text-neutral-900">每人 1 天交替</div>
                <div className="text-[11px] text-neutral-400">A → B → A → B</div>
              </button>

              <button
                type="button"
                onClick={() => setPatternType('twoDays')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  patternType === 'twoDays'
                    ? 'border-black bg-[#F6F6F2] text-neutral-900 font-medium ring-1 ring-black'
                    : 'border-[#E8E8E3] hover:bg-[#F9F9F7] text-neutral-600'
                }`}
              >
                <div className="font-serif font-semibold mb-0.5 text-neutral-900">每人 2 天交替</div>
                <div className="text-[11px] text-neutral-400">A A → B B → A A</div>
              </button>

              <button
                type="button"
                onClick={() => setPatternType('weekdaysOnly')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  patternType === 'weekdaysOnly'
                    ? 'border-black bg-[#F6F6F2] text-neutral-900 font-medium ring-1 ring-black'
                    : 'border-[#E8E8E3] hover:bg-[#F9F9F7] text-neutral-600'
                }`}
              >
                <div className="font-serif font-semibold mb-0.5 text-neutral-900">工作日轮班</div>
                <div className="text-[11px] text-neutral-400">周一到周五依次排</div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-700">
              <input
                type="checkbox"
                checked={skipWeekends}
                onChange={(e) => setSkipWeekends(e.target.checked)}
                className="rounded accent-black"
              />
              <span>周末不排班（跳过周六日）</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-700">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="rounded accent-black"
              />
              <span>覆盖本月已有排班</span>
            </label>
          </div>

          {/* Preview preview count */}
          <div className="p-3 bg-[#FDFDFB] rounded-xl border border-[#E8E8E3] text-xs text-neutral-600 flex items-center justify-between">
            <span>
              预计生成：<strong className="text-neutral-900 font-serif font-semibold">{previewShifts.length}</strong> 天排班
            </span>
            <div className="flex items-center gap-1.5">
              {members
                .filter((m) => selectedMemberIds.includes(m.id))
                .map((m) => {
                  const count = previewShifts.filter((s) => s.memberName === m.name).length;
                  return (
                    <span
                      key={m.id}
                      className="px-2 py-0.5 rounded text-white text-[11px] font-medium shadow-2xs"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.name}: {count}天
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F6F6F2] border-t border-[#E8E8E3] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E8E8E3] text-neutral-700 hover:bg-[#EBEBE5] text-sm font-medium rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={previewShifts.length === 0}
            className="px-5 py-2 bg-[#1C1C1A] hover:bg-black disabled:opacity-40 text-white text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            一键应用排班
          </button>
        </div>
      </div>
    </div>
  );
};
