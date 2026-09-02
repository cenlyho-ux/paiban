import React from 'react';
import { Member, ViewMode } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Table,
  BarChart3,
  Users,
  Sparkles,
  Download,
  Settings,
  Paintbrush,
  Sun,
  Moon,
  Check,
} from 'lucide-react';

interface HeaderProps {
  currentYear: number;
  currentMonth: number; // 1-12
  viewMode: ViewMode;
  members: Member[];
  activeBrushMember: { id?: string; name: string; color: string } | null;
  calendarWidth?: 'compact' | 'standard' | 'full';
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectYearMonth: (year: number, month: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleBrushMember: (member: Member | null) => void;
  onOpenMemberManager: () => void;
  onOpenAutoSchedule: () => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentYear,
  currentMonth,
  viewMode,
  members,
  activeBrushMember,
  calendarWidth = 'compact',
  isDarkMode = false,
  onToggleTheme,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectYearMonth,
  onViewModeChange,
  onToggleBrushMember,
  onOpenMemberManager,
  onOpenAutoSchedule,
  onOpenSettings,
  onOpenExport,
}) => {
  const widthClass = {
    compact: 'max-w-4xl',
    standard: 'max-w-5xl',
    full: 'max-w-6xl',
  }[calendarWidth];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-200">
      <div className={`${widthClass} mx-auto px-3 sm:px-5 py-2.5 transition-all duration-200`}>
        {/* Row 1: App Title & Month Controls & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Brand & Month Navigation */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs transition-colors">
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base tracking-tight hidden sm:inline">
                排班小日历
              </span>
            </div>

            <div className="h-3.5 w-px bg-neutral-300 dark:bg-neutral-700 hidden sm:block mx-0.5" />

            {/* Month switch buttons */}
            <div className="flex items-center bg-neutral-100/90 dark:bg-neutral-800/90 p-0.5 rounded-lg border border-neutral-200/70 dark:border-neutral-700/60 shadow-2xs">
              <button
                type="button"
                onClick={onPrevMonth}
                className="p-1 rounded-md hover:bg-white dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="上个月"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="px-2 py-0.5 font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1 select-none tabular-nums">
                <span>{currentYear}年</span>
                <span>{currentMonth}月</span>
              </div>

              <button
                type="button"
                onClick={onNextMonth}
                className="p-1 rounded-md hover:bg-white dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="下个月"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onToday}
              className="px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-700/60 rounded-lg shadow-2xs transition-all active:scale-95"
            >
              今
            </button>
          </div>

          {/* Center: View Switcher */}
          <div className="flex items-center bg-neutral-100/90 dark:bg-neutral-800/90 p-0.5 rounded-lg border border-neutral-200/70 dark:border-neutral-700/60 shadow-2xs">
            <button
              type="button"
              onClick={() => onViewModeChange('calendar')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3 h-3" />
              <span>日历</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3 h-3" />
              <span>清单</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('stats')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'stats'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>统计</span>
            </button>
          </div>

          {/* Right: Quick Tools & Dark Mode */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenAutoSchedule}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-700/60 rounded-lg shadow-2xs transition-all active:scale-95"
              title="按规则循环排班"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="hidden sm:inline">轮排</span>
            </button>

            <button
              type="button"
              onClick={onOpenMemberManager}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-700/60 rounded-lg shadow-2xs transition-all active:scale-95"
            >
              <Users className="w-3 h-3 text-blue-500" />
              <span className="hidden sm:inline">人员</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-700/60 rounded-lg shadow-2xs transition-all active:scale-95"
              title="导出排班表 / 打印"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-amber-500 dark:hover:text-amber-300 bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-700/60 rounded-lg shadow-2xs transition-all active:scale-95"
                title={isDarkMode ? '切换到亮色模式' : '切换到深色模式'}
              >
                {isDarkMode ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-700/60 rounded-lg shadow-2xs transition-all active:scale-95"
              title="设置"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Fast Quick Brush (快捷点选刷漆模式) */}
        <div className="mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1 text-[11px]">
              <Paintbrush className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
              <span>快速点刷:</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {members.map((m) => {
                const isActive = activeBrushMember?.name === m.name;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onToggleBrushMember(isActive ? null : m)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                      isActive
                        ? 'ring-2 ring-offset-1 ring-neutral-900 dark:ring-white text-white shadow-xs'
                        : 'bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/70 dark:border-neutral-700/60'
                    }`}
                    style={isActive ? { backgroundColor: m.color } : {}}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <span>{m.name}</span>
                    {isActive && <Check className="w-2.5 h-2.5 text-white ml-0.5" />}
                  </button>
                );
              })}

              {activeBrushMember && (
                <button
                  type="button"
                  onClick={() => onToggleBrushMember(null)}
                  className="px-1.5 py-0.5 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-neutral-200 dark:bg-neutral-700 rounded text-[10px] transition-colors"
                >
                  退出
                </button>
              )}
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 hidden md:block">
            {activeBrushMember ? (
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                正在点选「{activeBrushMember.name}」，点击日期即可填入/移除
              </span>
            ) : (
              <span>点击日期可详编；点选上方人员可连续排班</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

