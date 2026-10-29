import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  ShieldAlert, 
  Target, 
  Atom, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  Plus, 
  Sliders, 
  Wifi, 
  GitBranch, 
  Scale, 
  Compass, 
  GitFork,
  ArrowRight,
  Flame,
  Check,
  HelpCircle
} from 'lucide-react';
import { SOCRATIC_PERSONAS, RIGOR_INTENSITY_MODES } from '../constants/personas';

export default function CommandPalette({
  isOpen,
  onClose,
  onNewThought,
  onTacticalAction,
  onOpenSynthesis,
  onOpenThoughtTree,
  onOpenSettings,
  onOpenNetworkShare,
  onOpenFaq,
  onSelectPersona,
  onChangeRigor,
  currentRigor = 'strategic',
  currentPersonaId = 'classic'
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // All actionable commands
  const allActions = [
    // Superpower Tactics
    {
      id: 'tactic_flaw',
      group: 'Тактические маневры (Superpower)',
      title: 'Смертельный риск',
      subtitle: 'Атака уязвимости и поиск критической точки излома',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      action: () => onTacticalAction('fatal_flaw')
    },
    {
      id: 'tactic_steelman',
      group: 'Тактические маневры (Superpower)',
      title: 'Аргумент критика',
      subtitle: 'Усиленный контртезис умнейшего оппонента',
      icon: Target,
      iconColor: 'text-cyan-400',
      action: () => onTacticalAction('steel_man')
    },
    {
      id: 'tactic_first_principles',
      group: 'Тактические маневры (Superpower)',
      title: 'Первопричины',
      subtitle: 'Сведение к фундаментальным законам физики и экономики',
      icon: Atom,
      iconColor: 'text-amber-400',
      action: () => onTacticalAction('first_principles')
    },
    {
      id: 'tactic_inversion',
      group: 'Тактические маневры (Superpower)',
      title: 'Инверсия (От обратного)',
      subtitle: 'Моделирование гарантированного краха по Чарли Мангеру',
      icon: RefreshCw,
      iconColor: 'text-emerald-400',
      action: () => onTacticalAction('inversion')
    },

    // Rigor Intensity
    {
      id: 'rigor_calm',
      group: 'Жесткость спарринга',
      title: 'Конструктивный ментор',
      subtitle: 'Мягкая майевтика и бережное структурирование интуиции',
      icon: Compass,
      iconColor: 'text-zinc-400',
      current: currentRigor === 'calm',
      action: () => onChangeRigor('calm')
    },
    {
      id: 'rigor_strategic',
      group: 'Жесткость спарринга',
      title: 'Инженерный аудит',
      subtitle: 'Холодный расчет компромиссов, цены и последствий 2-го порядка',
      icon: GitFork,
      iconColor: 'text-cyan-400',
      current: currentRigor === 'strategic',
      action: () => onChangeRigor('strategic')
    },
    {
      id: 'rigor_brutal',
      group: 'Жесткость спарринга',
      title: 'Безжалостный Red Team',
      subtitle: 'Уровень допроса инвесткомитета Sequoia. Разрушение самообмана',
      icon: Flame,
      iconColor: 'text-rose-400',
      current: currentRigor === 'brutal',
      action: () => onChangeRigor('brutal')
    },

    // Navigation & System
    {
      id: 'act_new',
      group: 'Действия',
      title: 'Новый тезис',
      subtitle: 'Запустить новый цикл стратегического анализа',
      icon: Plus,
      iconColor: 'text-zinc-200',
      shortcut: 'N',
      action: onNewThought
    },
    {
      id: 'act_synthesis',
      group: 'Действия',
      title: 'Сформировать вердикт (Синтез)',
      subtitle: 'Сгенерировать исполнительный меморандум решений',
      icon: Sparkles,
      iconColor: 'text-amber-400',
      shortcut: 'S',
      action: onOpenSynthesis
    },
    {
      id: 'act_tree',
      group: 'Действия',
      title: 'Древо эволюции мысли',
      subtitle: 'Визуализировать цепочку деконструкции тезиса',
      icon: GitBranch,
      iconColor: 'text-cyan-400',
      shortcut: 'T',
      action: onOpenThoughtTree
    },
    {
      id: 'act_network',
      group: 'Система',
      title: 'Сетевой доступ (LAN Sync)',
      subtitle: 'Ссылка для подключения со второго Mac или смартфона',
      icon: Wifi,
      iconColor: 'text-zinc-400',
      action: onOpenNetworkShare
    },
    {
      id: 'act_settings',
      group: 'Система',
      title: 'Конфигурация интеллекта',
      subtitle: 'Управление API-ключами и проверка подключения Gemini',
      icon: Sliders,
      iconColor: 'text-zinc-400',
      action: onOpenSettings
    },
    {
      id: 'act_faq',
      group: 'Справка',
      title: 'Руководство и FAQ по методологии',
      subtitle: 'Что значит каждый режим жесткости, тактика и стиль диалектики',
      icon: HelpCircle,
      iconColor: 'text-emerald-400',
      action: onOpenFaq
    }
  ];

  const filtered = allActions.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.group.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4">
      <div 
        className="bg-[#090b10] border border-zinc-700/80 rounded-2xl max-w-xl w-full shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center space-x-3 bg-zinc-950/60">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Введите команду или поиск..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Actions List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-sans">
              Команда не найдена
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium font-sans truncate">
                          {item.title}
                        </span>
                        {item.current && (
                          <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                            <Check className="w-3 h-3" />
                            <span>Активен</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate font-sans">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 pl-2">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-[11px] font-mono text-zinc-500 px-3">
          <div className="flex items-center space-x-3">
            <span>↑↓ Навигация</span>
            <span>↵ Выбрать</span>
          </div>
          <span>Socrates Command ⌘K</span>
        </div>
      </div>
    </div>
  );
}
