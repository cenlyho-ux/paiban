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
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-neutral-900">常用排班人员管理</h3>
              <p className="text-xs text-neutral-500">添加人员并分配专属识别颜色，便于日历上一目了然</p>
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
          {/* Add New Member Form */}
          <form onSubmit={handleAdd} className="bg-[#FDFDFB] p-4 rounded-xl border border-[#E8E8E3] space-y-3">
            <h4 className="text-xs font-semibold text-neutral-800">添加新人员</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="人员姓名 (如：廖、何、张三)"
                className="flex-1 px-3 py-2 text-sm border border-[#E8E8E3] rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-4 py-2 bg-[#1C1C1A] hover:bg-black disabled:opacity-40 text-white text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>

            {/* Color picker palette */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-neutral-500 shrink-0">标签颜色:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {MEMBER_PALETTE.map((p) => (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => setSelectedColor(p.color)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === p.color ? 'scale-110 ring-2 ring-offset-1 ring-black' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </div>
            </div>
          </form>

          {/* Member List */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
              现有人员 ({memberList.length})
            </label>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {memberList.map((m) => {
                const isEditing = editingId === m.id;

                if (isEditing) {
                  return (
                    <div
                      key={m.id}
                      className="p-3 bg-[#F6F6F2] border border-[#E8E8E3] rounded-xl space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-sm bg-white border border-[#E8E8E3] rounded-lg focus:ring-1 focus:ring-black"
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(m.id)}
                          className="p-2 bg-[#1C1C1A] hover:bg-black text-white rounded-lg text-xs"
                          title="保存"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-[#E8E8E3] hover:bg-[#DEDEC8] text-neutral-700 rounded-lg text-xs"
                          title="取消"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {MEMBER_PALETTE.map((p) => (
                          <button
                            key={p.color}
                            type="button"
                            onClick={() => setEditColor(p.color)}
                            className={`w-5 h-5 rounded-full ${
                              editColor === p.color ? 'ring-2 ring-offset-1 ring-black scale-110' : ''
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
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8E8E3] bg-white hover:bg-[#F9F9F7] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="font-medium text-neutral-900 text-sm">{m.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded text-white font-medium shadow-2xs"
                        style={{ backgroundColor: m.color }}
                      >
                        预览: {m.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(m)}
                        className="p-1.5 text-neutral-400 hover:text-black hover:bg-[#E8E8E3] rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
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
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
