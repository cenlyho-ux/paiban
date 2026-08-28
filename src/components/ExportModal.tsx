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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#E8E8E3] animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F6F6F2] border-b border-[#E8E8E3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1C1C1A] text-white flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-neutral-900">导出与分享排班表</h3>
              <p className="text-xs text-neutral-500">支持导出 Excel/CSV、系统备份或打印预览</p>
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
        <div className="p-6 space-y-3">
          {/* CSV Export Option */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-[#E8E8E3] hover:border-black hover:bg-[#F9F9F7] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F6F6F2] text-neutral-800 border border-[#E8E8E3] rounded-xl group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-neutral-900 text-sm">
                  导出为 Excel / CSV 格式
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  包含 {year}年{month}月 完整日期与排班人员名单
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-black" />
          </button>

          {/* Print/PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-[#E8E8E3] hover:border-black hover:bg-[#F9F9F7] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F6F6F2] text-neutral-800 border border-[#E8E8E3] rounded-xl group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-neutral-900 text-sm">
                  打印或保存为 PDF
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  使用浏览器标准打印功能输出清晰排版日历
                </div>
              </div>
            </div>
            <Printer className="w-4 h-4 text-neutral-400 group-hover:text-black" />
          </button>

          {/* Full JSON backup */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-[#E8E8E3] hover:border-black hover:bg-[#F9F9F7] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F6F6F2] text-neutral-800 border border-[#E8E8E3] rounded-xl group-hover:scale-105 transition-transform">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-neutral-900 text-sm">
                  备份完整数据 (JSON)
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  包含所有历史排班记录与自定义人员设置
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-black" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F6F6F2] border-t border-[#E8E8E3] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1C1C1A] hover:bg-black text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
