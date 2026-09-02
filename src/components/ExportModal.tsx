import React from 'react';
import { Member, ShiftEntry } from '../types';
import { exportRosterCSV, exportRosterData } from '../utils/storage';
import { Download, FileSpreadsheet, FileJson, Printer, X, Check } from 'lucide-react';

interface ExportModalProps {
  year: number;
  month: number;
  shifts: ShiftEntry[];
  members: Member[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  year,
  month,
  shifts,
  members,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportRosterCSV(year, month, shifts);
  };

  const handleExportJSON = () => {
    exportRosterData(shifts, members);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-200/80 dark:border-neutral-800 animate-in zoom-in-95 transition-colors">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <Download className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">导出与分享排班表</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">支持导出 Excel/CSV、系统备份或打印预览</p>
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
        <div className="p-5 space-y-2.5">
          {/* CSV Export Option */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850 hover:border-neutral-900 dark:hover:border-neutral-600 hover:bg-white dark:hover:bg-neutral-800 transition-all text-left group shadow-2xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-neutral-200/70 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-600 rounded-lg group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">
                  导出为 Excel / CSV 格式
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  包含 {year}年{month}月 完整日期与排班人员名单
                </div>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />
          </button>

          {/* Print/PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850 hover:border-neutral-900 dark:hover:border-neutral-600 hover:bg-white dark:hover:bg-neutral-800 transition-all text-left group shadow-2xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-neutral-200/70 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-600 rounded-lg group-hover:scale-105 transition-transform">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">
                  打印或保存为 PDF
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  使用浏览器标准打印功能输出清晰排版日历
                </div>
              </div>
            </div>
            <Printer className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />
          </button>

          {/* Full JSON backup */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850 hover:border-neutral-900 dark:hover:border-neutral-600 hover:bg-white dark:hover:bg-neutral-800 transition-all text-left group shadow-2xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-neutral-200/70 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-600 rounded-lg group-hover:scale-105 transition-transform">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">
                  备份完整数据 (JSON)
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  包含所有历史排班记录与自定义人员设置
                </div>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100/80 dark:bg-neutral-800/80 border-t border-neutral-200/80 dark:border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
