import React from 'react';
import { 
  Settings2, 
  Plus, 
  Menu, 
  Layers,
  Search,
  Volume2,
  VolumeX,
  HelpCircle
} from 'lucide-react';
import { DEPTH_LEVELS, RIGOR_INTENSITY_MODES } from '../constants/personas';

export default function Header({
  activeSession,
  onNewThought,
  onOpenSettings,
  onOpenFaq,
  onToggleSidebar,
  sidebarOpen,
  onToggleBlueprint,
  blueprintOpen,
  onOpenCommandPalette,
  onChangeRigor,
  currentRigor = 'strategic',
  soundEnabled,
  onToggleSound
}) {
  const currentDepth = activeSession?.depthLevel || 1;
  const depthInfo = DEPTH_LEVELS.find(d => d.level === currentDepth) || DEPTH_LEVELS[0];
  const hasSynthesis = !!activeSession?.synthesis;

  return (
    <header className="h-14 border-b border-zinc-800/60 bg-[#07080b]/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-5 flex items-center justify-between">
      {/* Left: Sidebar toggle, Logo & Session Name */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors"
          title={sidebarOpen ? 'Скрыть панель' : 'Показать архив сессий'}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 cursor-pointer group" onClick={onNewThought}>
          {/* Minimalist Geometric Monolith Logo */}
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shadow group-hover:border-zinc-600 transition-all">
            <svg className="w-4 h-4 text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <span className="font-semibold text-xs tracking-wider text-zinc-200 uppercase font-sans">
            Сократ
          </span>
        </div>

        {/* Current Session Title Breadcrumb */}
        {activeSession && (
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-zinc-800/80 text-xs text-zinc-400 min-w-0">
            <span className="truncate max-w-[220px] font-sans text-zinc-300">
              {activeSession.initialThought}
            </span>
          </div>
        )}
      </div>

      {/* Center: Stage Indicator */}
      {activeSession && (
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-zinc-300">
            {hasSynthesis ? 'Вердикт готов' : `Этап ${currentDepth}/5: ${depthInfo.short}`}
          </span>
        </div>
      )}

      {/* Right Actions: Clean, Minimal, Status */}
      <div className="flex items-center space-x-2">
        {/* Rigor Selector Toggle (Compact) */}
        {activeSession && onChangeRigor && (
          <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]">
            {RIGOR_INTENSITY_MODES.map((mode) => {
              const active = (activeSession.rigorMode || currentRigor) === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onChangeRigor(mode.id)}
                  className={`px-2 py-1 rounded-md font-sans transition-all ${
                    active
                      ? mode.id === 'brutal'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50 font-medium'
                        : 'bg-zinc-800 text-zinc-100 shadow-sm font-medium'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={mode.description}
                >
                  {mode.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}

        {/* Blueprint (Холст решения) Drawer Button */}
        {activeSession && (
          <button
            onClick={onToggleBlueprint}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all border ${
              blueprintOpen
                ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
            title="Открыть холст архитектуры решения"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Холст</span>
            {hasSynthesis && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        )}

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
          title="Командная строка (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <span className="hidden sm:inline">⌘K</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg transition-colors border ${
            soundEnabled 
              ? 'text-zinc-300 bg-zinc-900 border-zinc-800' 
              : 'text-zinc-600 border-transparent hover:text-zinc-400'
          }`}
          title={soundEnabled ? 'Звук включен' : 'Звук отключен'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* New Session Button */}
        <button
          onClick={onNewThought}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
          title="Новый тезис"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Help / FAQ Button */}
        <button
          onClick={onOpenFaq}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
          title="Справка и FAQ по методологии и режимам"
        >
          <HelpCircle className="w-4 h-4 text-zinc-300" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
          title="Настройки"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
