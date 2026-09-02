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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 animate-in zoom-in-95 transition-colors">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {year}年{month}月 循环排班
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">按指定规则一键自动填充全月排班计划</p>
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

        {/* Form Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Select Members */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              1. 选择参与排班的人员 (点击切换勾选，支持多选并按顺序轮流)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {members.map((m) => {
                const isSelected = selectedMemberIds.includes(m.id);
                const order = selectedMemberIds.indexOf(m.id) + 1;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMemberSelection(m.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold shadow-xs'
                        : 'border-neutral-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: m.color }}
                    />
                    <span>{m.name}</span>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[10px] flex items-center justify-center font-bold">
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
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              2. 轮班规则
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPatternType('alternate')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  patternType === 'alternate'
                    ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium ring-1 ring-neutral-900 dark:ring-white'
                    : 'border-neutral-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="font-bold mb-0.5 text-neutral-900 dark:text-white">每人 1 天交替</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500">A → B → A → B</div>
              </button>

              <button
                type="button"
                onClick={() => setPatternType('twoDays')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  patternType === 'twoDays'
                    ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium ring-1 ring-neutral-900 dark:ring-white'
                    : 'border-neutral-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="font-bold mb-0.5 text-neutral-900 dark:text-white">每人 2 天交替</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500">A A → B B → A A</div>
              </button>

              <button
                type="button"
                onClick={() => setPatternType('weekdaysOnly')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  patternType === 'weekdaysOnly'
                    ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium ring-1 ring-neutral-900 dark:ring-white'
                    : 'border-neutral-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="font-bold mb-0.5 text-neutral-900 dark:text-white">工作日轮班</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500">周一至五依次轮排</div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 pt-0.5 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={skipWeekends}
                onChange={(e) => setSkipWeekends(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-white"
              />
              <span>周末不排班（跳过周六日）</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-white"
              />
              <span>覆盖本月已有排班</span>
            </label>
          </div>

          {/* Preview count */}
          <div className="p-2.5 bg-neutral-50/70 dark:bg-neutral-850 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
            <span>
              预计生成：<strong className="text-neutral-900 dark:text-white font-bold tabular-nums">{previewShifts.length}</strong> 天排班
            </span>
            <div className="flex items-center gap-1.5">
              {members
                .filter((m) => selectedMemberIds.includes(m.id))
                .map((m) => {
                  const count = previewShifts.filter((s) => s.memberName === m.name).length;
                  return (
                    <span
                      key={m.id}
                      className="px-2 py-0.5 rounded-md text-white text-[10px] font-medium shadow-2xs tabular-nums"
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
        <div className="px-5 py-3 bg-neutral-100/80 dark:bg-neutral-800/80 border-t border-neutral-200/80 dark:border-neutral-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-2xs"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={previewShifts.length === 0}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-40 text-white dark:text-neutral-900 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            一键应用排班
          </button>
        </div>
      </div>
    </div>
  );
};
