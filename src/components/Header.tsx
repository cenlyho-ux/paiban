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
  RotateCcw,
  Check,
} from 'lucide-react';

interface HeaderProps {
  currentYear: number;
  currentMonth: number; // 1-12
  viewMode: ViewMode;
  members: Member[];
  activeBrushMember: { id?: string; name: string; color: string } | null;
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
  return (
    <header className="bg-white border-b border-[#E8E8E3] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        {/* Row 1: App Title & Month Controls & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand & Month Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1C1C1A] flex items-center justify-center text-white">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className="font-serif font-semibold text-[#1C1C1A] text-lg tracking-tight hidden sm:inline">
                排班小日历
              </span>
            </div>

            <div className="h-4 w-px bg-[#E8E8E3] hidden sm:block mx-1" />

            {/* Month switch buttons */}
            <div className="flex items-center bg-[#F6F6F2] p-1 rounded-lg border border-[#E8E8E3]">
              <button
                type="button"
                onClick={onPrevMonth}
                className="p-1 rounded-md hover:bg-white text-neutral-700 transition-colors"
                title="上个月"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-0.5 font-serif font-semibold text-[#1C1C1A] text-sm sm:text-base flex items-center gap-1 select-none">
                <span>{currentYear}年</span>
                <span className="text-[#1C1C1A] underline decoration-[#1C1C1A]/20 underline-offset-4">{currentMonth}月</span>
              </div>

              <button
                type="button"
                onClick={onNextMonth}
                className="p-1 rounded-md hover:bg-white text-neutral-700 transition-colors"
                title="下个月"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onToday}
              className="px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F6F6F2] border border-[#E8E8E3] rounded-lg transition-colors"
            >
              今天
            </button>
          </div>

          {/* Center: View Switcher */}
          <div className="flex items-center bg-[#F6F6F2] p-0.5 rounded-lg border border-[#E8E8E3]">
            <button
              type="button"
              onClick={() => onViewModeChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#1C1C1A] font-semibold border border-[#E8E8E3] shadow-xs'
                  : 'text-neutral-600 hover:text-[#1C1C1A]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>日历视图</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#1C1C1A] font-semibold border border-[#E8E8E3] shadow-xs'
                  : 'text-neutral-600 hover:text-[#1C1C1A]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>表格清单</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('stats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'stats'
                  ? 'bg-white text-[#1C1C1A] font-semibold border border-[#E8E8E3] shadow-xs'
                  : 'text-neutral-600 hover:text-[#1C1C1A]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>统计明细</span>
            </button>
          </div>

          {/* Right: Quick Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAutoSchedule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-[#F6F6F2] hover:bg-[#EBEBE5] border border-[#E8E8E3] rounded-lg transition-colors"
              title="按规则循环排班"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span className="hidden sm:inline">循环排班</span>
              <span className="sm:hidden">轮排</span>
            </button>

            <button
              type="button"
              onClick={onOpenMemberManager}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-white hover:bg-[#F6F6F2] border border-[#E8E8E3] rounded-lg transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">人员管理</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="p-1.5 text-neutral-700 hover:text-black hover:bg-[#F6F6F2] border border-[#E8E8E3] rounded-lg transition-colors"
              title="导出排班表 / 打印"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 text-neutral-700 hover:text-black hover:bg-[#F6F6F2] border border-[#E8E8E3] rounded-lg transition-colors"
              title="设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Fast Quick Brush (快捷点选刷漆模式) */}
        <div className="mt-3 pt-2.5 border-t border-[#E8E8E3] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-neutral-600 flex items-center gap-1">
              <Paintbrush className="w-3.5 h-3.5 text-neutral-800" />
              <span>快捷点刷:</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {members.map((m) => {
                const isActive = activeBrushMember?.name === m.name;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onToggleBrushMember(isActive ? null : m)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'ring-1 ring-[#1C1C1A] text-white shadow-xs font-semibold'
                        : 'bg-[#F6F6F2] hover:bg-[#EBEBE5] text-neutral-800 border border-[#E8E8E3]'
                    }`}
                    style={isActive ? { backgroundColor: m.color } : {}}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    <span>{m.name}</span>
                    {isActive && <Check className="w-3 h-3 text-white ml-0.5" />}
                  </button>
                );
              })}

              {activeBrushMember && (
                <button
                  type="button"
                  onClick={() => onToggleBrushMember(null)}
                  className="px-2 py-0.5 text-neutral-600 hover:text-black bg-[#EBEBE5] rounded-md text-[11px]"
                >
                  退出点刷
                </button>
              )}
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 font-serif italic">
            {activeBrushMember ? (
              <span className="text-[#1C1C1A] font-sans not-italic font-medium">
                正在点选「{activeBrushMember.name}」，点击任意日期即可添加或移除
              </span>
            ) : (
              <span>点击日历任一天即可编辑；亦可点选上方人员连点排班</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
