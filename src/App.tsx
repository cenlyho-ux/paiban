/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  CalendarDayInfo,
  Member,
  RosterSettings,
  ShiftEntry,
  ViewMode,
} from './types';
import {
  generateMonthCalendar,
  formatDateStr,
  DEFAULT_MEMBERS,
  DEFAULT_SHIFTS_SAMPLE,
} from './utils/calendarUtils';
import {
  loadMembers,
  loadSettings,
  loadShifts,
  saveMembers,
  saveSettings,
  saveShifts,
} from './utils/storage';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { CalendarView } from './components/CalendarView';
import { TableView } from './components/TableView';
import { StatsView } from './components/StatsView';
import { DayEditModal } from './components/DayEditModal';
import { MemberManagerModal } from './components/MemberManagerModal';
import { AutoScheduleModal } from './components/AutoScheduleModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  // Set default initial view to 2026-09 to match sample & screenshot
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9);

  const [shifts, setShifts] = useState<ShiftEntry[]>(() => loadShifts());
  const [members, setMembers] = useState<Member[]>(() => loadMembers());
  const [settings, setSettings] = useState<RosterSettings>(() => loadSettings());

  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [activeBrushMember, setActiveBrushMember] = useState<{ id?: string; name: string; color: string } | null>(null);
  const [selectedFilterMember, setSelectedFilterMember] = useState<string | null>(null);

  // Modals state
  const [editingDay, setEditingDay] = useState<CalendarDayInfo | null>(null);
  const [isMemberManagerOpen, setIsMemberManagerOpen] = useState<boolean>(false);
  const [isAutoScheduleOpen, setIsAutoScheduleOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Group shifts by date string for fast O(1) lookup
  const shiftMap = useMemo(() => {
    const map: Record<string, ShiftEntry[]> = {};
    shifts.forEach((s) => {
      if (!map[s.dateStr]) {
        map[s.dateStr] = [];
      }
      map[s.dateStr].push(s);
    });
    return map;
  }, [shifts]);

  // Compute month calendar days
  const calendarDays = useMemo(() => {
    return generateMonthCalendar(
      currentYear,
      currentMonth,
      settings.startDayOfWeek,
      shiftMap
    );
  }, [currentYear, currentMonth, settings.startDayOfWeek, shiftMap]);

  // If editingDay is open, keep its shifts synchronized with shiftMap
  const currentEditingDay = useMemo(() => {
    if (!editingDay) return null;
    return (
      calendarDays.find((d) => d.dateStr === editingDay.dateStr) || {
        ...editingDay,
        shifts: shiftMap[editingDay.dateStr] || [],
      }
    );
  }, [editingDay, calendarDays, shiftMap]);

  // Persist shifts
  const updateShifts = (newShifts: ShiftEntry[]) => {
    setShifts(newShifts);
    saveShifts(newShifts);
  };

  // Persist members
  const updateMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    saveMembers(newMembers);
  };

  // Persist settings
  const updateSettings = (newSettings: RosterSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Add a shift
  const handleAddShift = (
    dateStr: string,
    memberName: string,
    color?: string,
    shiftLabel?: string,
    note?: string
  ) => {
    const memberObj = members.find((m) => m.name === memberName);
    const assignedColor = color || memberObj?.color || '#2563eb';

    const newShift: ShiftEntry = {
      id: `shift-${dateStr}-${memberName}-${Date.now()}`,
      dateStr,
      memberId: memberObj?.id,
      memberName,
      color: assignedColor,
      shiftLabel: shiftLabel || '值班',
      note,
      createdAt: Date.now(),
    };

    updateShifts([...shifts, newShift]);
  };

  // Remove a shift
  const handleRemoveShift = (shiftId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateShifts(shifts.filter((s) => s.id !== shiftId));
  };

  // Clear all shifts for a specific day
  const handleClearDayShifts = (dateStr: string) => {
    updateShifts(shifts.filter((s) => s.dateStr !== dateStr));
  };

  // Cell click handler: either paints active brush person or opens the modal
  const handleCellClick = (day: CalendarDayInfo) => {
    if (activeBrushMember) {
      // Check if this person is already assigned on this day
      const existingShift = day.shifts.find(
        (s) => s.memberName === activeBrushMember.name
      );

      if (existingShift) {
        // Toggle remove
        handleRemoveShift(existingShift.id);
      } else {
        // Add
        handleAddShift(
          day.dateStr,
          activeBrushMember.name,
          activeBrushMember.color,
          '值班'
        );
      }
    } else {
      setEditingDay(day);
    }
  };

  // Quick add from cell hover button
  const handleQuickAdd = (day: CalendarDayInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDay(day);
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  // Batch auto schedule handler
  const handleApplyAutoSchedule = (
    newShifts: ShiftEntry[],
    overwriteMonth: boolean
  ) => {
    const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    let baseShifts = shifts;

    if (overwriteMonth) {
      baseShifts = shifts.filter((s) => !s.dateStr.startsWith(monthPrefix));
    }

    updateShifts([...baseShifts, ...newShifts]);
  };

  // Reset demo data
  const handleResetSampleData = () => {
    setShifts(DEFAULT_SHIFTS_SAMPLE);
    saveShifts(DEFAULT_SHIFTS_SAMPLE);
    setMembers(DEFAULT_MEMBERS);
    saveMembers(DEFAULT_MEMBERS);
  };

  // Clear all shifts
  const handleClearAllShifts = () => {
    setShifts([]);
    saveShifts([]);
  };

  // Restore backup
  const handleRestoreData = (
    restoredShifts: ShiftEntry[],
    restoredMembers: Member[]
  ) => {
    updateShifts(restoredShifts);
    updateMembers(restoredMembers);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1C1C1A] flex flex-col font-sans selection:bg-neutral-200">
      {/* Navigation & Header */}
      <Header
        currentYear={currentYear}
        currentMonth={currentMonth}
        viewMode={viewMode}
        members={members}
        activeBrushMember={activeBrushMember}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onSelectYearMonth={(y, m) => {
          setCurrentYear(y);
          setCurrentMonth(m);
        }}
        onViewModeChange={setViewMode}
        onToggleBrushMember={(m) => setActiveBrushMember(m)}
        onOpenMemberManager={() => setIsMemberManagerOpen(true)}
        onOpenAutoSchedule={() => setIsAutoScheduleOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* At-a-glance stats bar */}
        <StatsBar
          year={currentYear}
          month={currentMonth}
          members={members}
          shifts={shifts}
          selectedFilterMember={selectedFilterMember}
          onSelectFilterMember={setSelectedFilterMember}
        />

        {/* View Content */}
        {viewMode === 'calendar' && (
          <CalendarView
            days={calendarDays}
            startDayOfWeek={settings.startDayOfWeek}
            activeBrushMember={activeBrushMember}
            selectedFilterMember={selectedFilterMember}
            showLunar={settings.showLunar}
            showWeekendsHighlight={settings.showWeekendsHighlight}
            onCellClick={handleCellClick}
            onRemoveShift={handleRemoveShift}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {viewMode === 'table' && (
          <TableView
            days={calendarDays}
            members={members}
            year={currentYear}
            month={currentMonth}
            onOpenDayEdit={(day) => setEditingDay(day)}
            onAddShift={handleAddShift}
            onRemoveShift={(id) => handleRemoveShift(id)}
          />
        )}

        {viewMode === 'stats' && (
          <StatsView
            days={calendarDays}
            members={members}
            year={currentYear}
            month={currentMonth}
            shifts={shifts}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-6 text-center text-xs text-neutral-400 border-t border-[#E8E8E3] mt-auto">
        <p className="tracking-wide">排班小日历 · 点击日期即时排班 · 支持农历节气与循环轮排</p>
      </footer>

      {/* Modals */}
      {currentEditingDay && (
        <DayEditModal
          day={currentEditingDay}
          members={members}
          onClose={() => setEditingDay(null)}
          onAddShift={handleAddShift}
          onRemoveShift={(id) => handleRemoveShift(id)}
          onClearDayShifts={handleClearDayShifts}
        />
      )}

      {isMemberManagerOpen && (
        <MemberManagerModal
          members={members}
          onClose={() => setIsMemberManagerOpen(false)}
          onSaveMembers={updateMembers}
        />
      )}

      {isAutoScheduleOpen && (
        <AutoScheduleModal
          year={currentYear}
          month={currentMonth}
          members={members}
          onClose={() => setIsAutoScheduleOpen(false)}
          onApplySchedule={handleApplyAutoSchedule}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={updateSettings}
          onRestoreData={handleRestoreData}
          onResetSampleData={handleResetSampleData}
          onClearAllShifts={handleClearAllShifts}
        />
      )}

      {isExportOpen && (
        <ExportModal
          year={currentYear}
          month={currentMonth}
          shifts={shifts}
          members={members}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
