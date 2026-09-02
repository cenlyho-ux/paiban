import React, { useRef } from 'react';
import { RosterSettings, ShiftEntry, Member } from '../types';
import { Settings, X, Upload, RotateCcw, ShieldAlert, Check, Calendar, Sun, Moon, Laptop } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-neutral-200/80 dark:border-neutral-800 animate-in zoom-in-95 transition-colors">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">日历偏好设置</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">深色模式、排班视图、农历显示及数据备份</p>
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

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Theme selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              外观主题
            </label>

            <div className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850">
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">界面色彩主题</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">选择明亮模式、沉浸深色模式或跟随系统</div>
              </div>
              <div className="flex bg-neutral-200/60 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    (settings.theme || 'light') === 'light'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>亮色</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.theme === 'dark'
                      ? 'bg-neutral-700 text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Moon className="w-3 h-3 text-blue-400" />
                  <span>深色</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: 'system' })}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.theme === 'system'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Laptop className="w-3 h-3" />
                  <span>系统</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar display preferences */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              视图显示选项
            </label>

            {/* Start of week */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850">
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">每周起始日</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">习惯以周一还是周日作为日历第一列</div>
              </div>
              <div className="flex bg-neutral-200/60 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, startDayOfWeek: 1 })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.startDayOfWeek === 1
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  周一
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, startDayOfWeek: 0 })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.startDayOfWeek === 0
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  周日
                </button>
              </div>
            </div>

            {/* Lunar dates toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850">
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">显示农历与节气</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">在日期右上角显示农历初几、节气与传统节日</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showLunar}
                onChange={(e) => onUpdateSettings({ ...settings, showLunar: e.target.checked })}
                className="w-4 h-4 rounded accent-neutral-900 cursor-pointer"
              />
            </div>

            {/* Calendar Container Width */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850">
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">日历版心宽度</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">紧凑台历更适合聚焦阅读，宽屏展开更适合大屏显示</div>
              </div>
              <div className="flex bg-neutral-200/60 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, calendarWidth: 'compact' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    (settings.calendarWidth || 'compact') === 'compact'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  紧凑台历
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, calendarWidth: 'standard' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.calendarWidth === 'standard'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  标准
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, calendarWidth: 'full' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.calendarWidth === 'full'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  宽屏
                </button>
              </div>
            </div>

            {/* Cell Size / Density */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850">
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">日历格子高度 (密度)</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">调整每个日期单元格的高度与紧凑程度</div>
              </div>
              <div className="flex bg-neutral-200/60 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, cellSize: 'compact' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    (settings.cellSize || 'compact') === 'compact'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  紧凑
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, cellSize: 'standard' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.cellSize === 'standard'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  适中
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, cellSize: 'spacious' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    settings.cellSize === 'spacious'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  宽松
                </button>
              </div>
            </div>

            {/* Weekend highlight */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850">
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">周末背景柔和高亮</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">为周六和周日提供柔和背景以区分工作日</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showWeekendsHighlight}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, showWeekendsHighlight: e.target.checked })
                }
                className="w-4 h-4 rounded accent-neutral-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="border-t border-neutral-200/70 dark:border-neutral-800 pt-3.5 space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
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
                className="flex items-center justify-center gap-1.5 p-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg transition-all active:scale-95 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-neutral-500" />
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
                className="flex items-center justify-center gap-1.5 p-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg transition-all active:scale-95 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
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
                className="flex items-center justify-center gap-1.5 p-2 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/50 border border-rose-200/60 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium rounded-lg transition-all active:scale-95 shadow-2xs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>清空所有排班记录</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
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
