import React, { useState } from 'react';
import { Member } from '../types';
import { MEMBER_PALETTE } from '../utils/calendarUtils';
import { X, Plus, Trash2, Edit2, Check, Users } from 'lucide-react';

interface MemberManagerModalProps {
  members: Member[];
  onClose: () => void;
  onSaveMembers: (members: Member[]) => void;
}

export const MemberManagerModal: React.FC<MemberManagerModalProps> = ({
  members,
  onClose,
  onSaveMembers,
}) => {
  const [memberList, setMemberList] = useState<Member[]>(members);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('值班');
  const [selectedColor, setSelectedColor] = useState(MEMBER_PALETTE[0].color);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMember: Member = {
      id: 'm-' + Date.now(),
      name: newName.trim(),
      shortName: newName.trim().slice(0, 2),
      color: selectedColor,
      role: newRole.trim() || '值班',
    };

    const updated = [...memberList, newMember];
    setMemberList(updated);
    onSaveMembers(updated);
    setNewName('');

    // Rotate next color
    const nextColorIndex = (memberList.length + 1) % MEMBER_PALETTE.length;
    setSelectedColor(MEMBER_PALETTE[nextColorIndex].color);
  };

  const handleDelete = (id: string) => {
    if (memberList.length <= 1) {
      alert('请至少保留一位排班人员');
      return;
    }
    const updated = memberList.filter((m) => m.id !== id);
    setMemberList(updated);
    onSaveMembers(updated);
  };

  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditColor(m.color);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = memberList.map((m) =>
      m.id === id ? { ...m, name: editName.trim(), color: editColor } : m
    );
    setMemberList(updated);
    onSaveMembers(updated);
    setEditingId(null);
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
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">常用排班人员管理</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">添加人员并分配专属识别颜色，便于日历上一目了然</p>
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
          {/* Add New Member Form */}
          <form onSubmit={handleAdd} className="bg-neutral-50/70 dark:bg-neutral-850 p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 space-y-2.5">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">添加新人员</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="人员姓名 (如：廖、何、张三)"
                className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-neutral-200/80 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
              />
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-40 text-white dark:text-neutral-900 text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1 shrink-0 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                添加
              </button>
            </div>

            {/* Color picker palette */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0">标签颜色:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {MEMBER_PALETTE.map((p) => (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => setSelectedColor(p.color)}
                    className={`w-5 h-5 rounded-full transition-transform ${
                      selectedColor === p.color ? 'scale-115 ring-2 ring-offset-1 ring-neutral-900 dark:ring-white' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </div>
            </div>
          </form>

          {/* Member List */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1.5">
              现有人员 ({memberList.length})
            </label>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {memberList.map((m) => {
                const isEditing = editingId === m.id;

                if (isEditing) {
                  return (
                    <div
                      key={m.id}
                      className="p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-md focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(m.id)}
                          className="p-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md text-xs shadow-xs"
                          title="保存"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-md text-xs"
                          title="取消"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {MEMBER_PALETTE.map((p) => (
                          <button
                            key={p.color}
                            type="button"
                            onClick={() => setEditColor(p.color)}
                            className={`w-4 h-4 rounded-full ${
                              editColor === p.color ? 'ring-2 ring-offset-1 ring-neutral-900 dark:ring-white scale-110' : ''
                            }`}
                            style={{ backgroundColor: p.color }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="font-semibold text-neutral-900 dark:text-white text-xs sm:text-sm">{m.name}</span>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-md text-white font-medium shadow-2xs"
                        style={{ backgroundColor: m.color }}
                      >
                        预览: {m.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(m)}
                        className="p-1 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
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
