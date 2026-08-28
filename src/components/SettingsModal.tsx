import React, { useRef } from 'react';
import { RosterSettings, ShiftEntry, Member } from '../types';
import { Settings, X, Upload, RotateCcw, ShieldAlert, Check, Calendar } from 'lucide-react';
import { DEFAULT_MEMBERS, DEFAULT_SHIFTS_SAMPLE } from '../utils/calendarUtils';

interface SettingsModalProps {
  settings: RosterSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: RosterSettings) => void;
  onRestoreData: (shifts: ShiftEntry[], members: Member[]) => void;
  onResetSampleData: () => void;
  onClearAllShifts: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onClose,
  onUpdateSettings,
  onRestoreData,
  onResetSampleData,
  onClearAllShifts,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.shifts && json.members) {
          onRestoreData(json.shifts, json.members);
          alert('数据恢复成功！');
          onClose();
        } else {
          alert('数据格式不正确，缺少 shifts 或 members 字段');
        }
      } catch (err) {
        alert('解析备份文件失败，请确认文件为有效 JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E8E8E3] animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F6F6F2] border-b border-[#E8E8E3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1C1C1A] text-white flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-neutral-900">日历偏好设置</h3>
              <p className="text-xs text-neutral-500">自定义排班视图、农历显示及数据备份</p>
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Calendar display preferences */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
              视图显示选项
            </label>

            {/* Start of week */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E8E8E3] bg-[#FDFDFB]">
              <div>
                <div className="text-sm font-medium text-neutral-900">每周起始日</div>
                <div className="text-xs text-neutral-500">习惯以周一还是周日作为日历第一列</div>
              </div>
              <div className="flex bg-[#EBEBE5] p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, startDayOfWeek: 1 })}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    settings.startDayOfWeek === 1
                      ? 'bg-white text-[#1C1C1A] shadow-xs font-semibold'
                      : 'text-neutral-600'
                  }`}
                >
                  周一
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, startDayOfWeek: 0 })}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    settings.startDayOfWeek === 0
                      ? 'bg-white text-[#1C1C1A] shadow-xs font-semibold'
                      : 'text-neutral-600'
                  }`}
                >
                  周日
                </button>
              </div>
            </div>

            {/* Lunar dates toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E8E8E3] bg-[#FDFDFB]">
              <div>
                <div className="text-sm font-medium text-neutral-900">显示农历与节气</div>
                <div className="text-xs text-neutral-500">在日期右上角显示农历初几、中秋、白露等</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showLunar}
                onChange={(e) => onUpdateSettings({ ...settings, showLunar: e.target.checked })}
                className="w-4 h-4 rounded accent-black cursor-pointer"
              />
            </div>

            {/* Weekend highlight */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E8E8E3] bg-[#FDFDFB]">
              <div>
                <div className="text-sm font-medium text-neutral-900">周末背景浅色高亮</div>
                <div className="text-xs text-neutral-500">为周六和周日提供柔和浅色背景以区分工作日</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showWeekendsHighlight}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, showWeekendsHighlight: e.target.checked })
                }
                className="w-4 h-4 rounded accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="border-t border-[#E8E8E3] pt-4 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
              数据管理与恢复
            </label>

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-2.5 bg-[#F6F6F2] hover:bg-[#EBEBE5] border border-[#E8E8E3] text-neutral-700 text-xs font-medium rounded-xl transition-colors"
              >
                <Upload className="w-4 h-4 text-neutral-500" />
                <span>从 JSON 备份文件恢复数据</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('确定要载入示例排班数据吗？将重置当前排班。')) {
                    onResetSampleData();
                    onClose();
                  }
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-[#F6F6F2] hover:bg-[#EBEBE5] border border-[#E8E8E3] text-neutral-700 text-xs font-medium rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-neutral-500" />
                <span>重置为初始示例数据 (含廖、何排班)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('确定要清空所有日期的排班记录吗？此操作无法撤销。')) {
                    onClearAllShifts();
                    onClose();
                  }
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-700 text-xs font-medium rounded-xl transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>清空所有排班记录</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F6F6F2] border-t border-[#E8E8E3] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1C1C1A] hover:bg-black text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
          >
            保存并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
