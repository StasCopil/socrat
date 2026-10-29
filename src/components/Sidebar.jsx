import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Search, 
  X, 
  Layers,
  Sparkles,
  Clock
} from 'lucide-react';
import { PRESET_THOUGHTS } from '../constants/presets';

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewThought,
  onSelectPreset,
  isOpen,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'presets'

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.initialThought.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Drawer Container */}
      <aside
        className="fixed top-0 bottom-0 left-0 w-80 bg-[#08090d] border-r border-zinc-800/80 z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
      >
        {/* Top actions */}
        <div className="p-4 border-b border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 font-mono">
              Архив размышлений
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
              title="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewThought();
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-sans text-xs font-semibold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Новый тезис</span>
          </button>

          {/* Navigation tabs */}
          <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-1.5 rounded-md font-sans text-xs font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Архив ({sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`py-1.5 rounded-md font-sans text-xs font-medium transition-colors ${
                activeTab === 'presets'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Шаблоны
            </button>
          </div>

          {/* Search box (for history tab) */}
          {activeTab === 'history' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по тезисам..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-sans"
              />
            </div>
          )}
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {activeTab === 'history' ? (
            filteredSessions.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-xs font-sans space-y-1">
                <Clock className="w-6 h-6 mx-auto text-zinc-600 mb-2" />
                <p>Нет сохраненных сессий</p>
                <p className="text-[11px] text-zinc-600">Начните анализ любого тезиса</p>
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSession(s.id);
                      onClose();
                    }}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-zinc-850/90 border-zinc-700 text-zinc-100'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="truncate font-sans font-medium text-xs text-zinc-200">
                        {s.title || s.initialThought}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                        <span>Этап {s.depthLevel || 1}/5</span>
                        <span>•</span>
                        <span>{new Date(s.updatedAt || s.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Удалить эту сессию размышлений?')) {
                          onDeleteSession(s.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 rounded-md hover:bg-zinc-800 transition-all"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )
          ) : (
            /* Presets list */
            <div className="space-y-2 py-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 block font-semibold">
                Готовые гипотезы для стресс-теста
              </span>
              {PRESET_THOUGHTS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                      {preset.category}
                    </span>
                    <Sparkles className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed group-hover:text-zinc-100">
                    «{preset.text}»
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
