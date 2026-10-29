import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Compass, 
  Target, 
  ShieldAlert, 
  Atom, 
  RefreshCw, 
  Layers, 
  Radio, 
  CheckCircle2, 
  Keyboard, 
  Scale, 
  Sliders
} from 'lucide-react';
import { SOCRATIC_PERSONAS, RIGOR_INTENSITY_MODES } from '../constants/personas';
import SocraticIcon from './SocraticIcon';

export default function FaqModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('rigor'); // 'workflow' | 'rigor' | 'tactics' | 'personas' | 'shortcuts'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative bg-[#090b10] border border-zinc-700/80 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden z-10 font-sans">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-zinc-100 uppercase tracking-wide">
                Руководство и Справочник // Сократ AI
              </h2>
              <p className="text-[11px] text-zinc-400">
                Методология сократического спарринга, назначение режимов и тактик
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-2 bg-zinc-950 border-b border-zinc-800/80 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'rigor', label: 'Режимы спарринга' },
            { id: 'tactics', label: 'Тактики Superpower' },
            { id: 'workflow', label: 'Как устроен метод' },
            { id: 'personas', label: 'Стили диалектики' },
            { id: 'shortcuts', label: 'Клавиши' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: RIGOR MODES */}
          {activeTab === 'rigor' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-zinc-100 font-semibold text-sm mb-1">
                  Напор спарринга (Rigor Intensity)
                </h3>
                <p className="text-zinc-400 text-xs">
                  Режим жесткости задает температуру диалектики и силу давления на ваши предпосылки.
                </p>
              </div>

              <div className="space-y-3">
                {/* Mode 1: Calm */}
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-zinc-100">Конструктивный ментор (Мягкий)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      Майевтика
                    </span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    <strong>Суть:</strong> Помощь в структурировании сырой интуиции без излишней конфронтации. ИИ задает наводящие вопросы, помогая вам самостоятельно сформулировать мысль.
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    <strong>Когда использовать:</strong> Когда идея только зародилась, вы исследуете творческий замысел или хотите бережно распаковать смутное ощущение.
                  </p>
                </div>

                {/* Mode 2: Strategic */}
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-700/80 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-zinc-100">Стратегический спарринг (По умолчанию)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 font-semibold">
                      Совет директоров
                    </span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    <strong>Суть:</strong> Прагматичный аудит на уровне венчурного инвестора. Оценка экономических рычагов, вероятностей, скрытых издержек, масштабируемости и защитного рва (Moat).
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    <strong>Когда использовать:</strong> Для любых реальных бизнес-решений, стартапов, крупных инвестиций или смены карьеры. Оптимальный баланс глубины и конструктива.
                  </p>
                </div>

                {/* Mode 3: Brutal */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span className="font-semibold text-rose-200">Безжалостный Red Team (Стресс-тест)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                      Крах-тест
                    </span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    <strong>Суть:</strong> Никаких поблажек и вежливости. ИИ ищет точку излома и наносит хирургический удар в самое уязвимое место аргумента, разрушая самообман и иллюзии легкого успеха.
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    <strong>Когда использовать:</strong> Перед принятием необратимых решений (увольнение, вложение семейного капитала, подписание контракта). Лучше сломать идею в спарринге, чем на реальном рынке.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TACTICAL SUPERPOWERS */}
          {activeTab === 'tactics' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-zinc-100 font-semibold text-sm mb-1">
                  4 тактических маневра мысли
                </h3>
                <p className="text-zinc-400 text-xs">
                  Кнопки быстрого тактического удара прямо над полем ввода для мгновенной перефокусировки диалога.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Смертельный риск</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Выявляет критическую точку отказа (Single Point of Failure). Вопрос: что если главное допущение рухнет в первый день?
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs">
                    <Target className="w-4 h-4" />
                    <span>Аргумент критика (Steelman)</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Формулирует сильнейший контртезис умнейшего оппонента на основе фактов. Заставляет подготовить защиту от реальной конкуренции.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
                    <Atom className="w-4 h-4" />
                    <span>Первопричины</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Стирает социальные шаблоны «так принято». Сводит проблему к базовым законам физики, экономики и биологии.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                    <RefreshCw className="w-4 h-4" />
                    <span>Инверсия (от обратного)</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Метод Чарли Мангера: «Как гарантированно провалить эту затею со 100% вероятностью?». Показывает скрытые правила выживания.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-zinc-100 font-semibold text-sm mb-1">
                  Как устроен диалектический цикл
                </h3>
                <p className="text-zinc-400 text-xs">
                  От сырого импульса до кристаллизованного исполнительного регламента решений.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { step: '1', title: 'Исходный тезис', desc: 'Вы вводите любую гипотезу: идею стартапа, план дохода или жизненный выбор.' },
                  { step: '2', title: 'Эленхос (Диалектика)', desc: 'ИИ не соглашается и не хвалит, а находит скрытую аксиому, которую вы принимаете на веру без доказательств.' },
                  { step: '3', title: 'Стресс-тест границ', desc: 'Проверка аргумента на краш-сценариях и конкурентном давлении рынка.' },
                  { step: '4', title: 'Холст и Исполнительный вердикт', desc: 'Автоматическая фиксация первых принципов в виде готового документа для Совета директоров.' }
                ].map((s) => (
                  <div key={s.step} className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                    <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-zinc-200 shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-zinc-200 text-xs">{s.title}</span>
                      <p className="text-zinc-400 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERSONAS */}
          {activeTab === 'personas' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-zinc-100 font-semibold text-sm mb-1">
                  Стили диалектики (Спарринг-партнеры)
                </h3>
                <p className="text-zinc-400 text-xs">
                  Каждый мыслитель смотрит на ваш тезис через уникальную философскую линзу.
                </p>
              </div>

              <div className="space-y-2.5">
                {SOCRATIC_PERSONAS.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SocraticIcon name={p.iconName || p.id} className="w-3.5 h-3.5 text-zinc-300" />
                        <span className="font-semibold text-zinc-200 text-xs">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-zinc-100 font-semibold text-sm mb-1">
                  Горячие клавиши (Keyboard Navigation)
                </h3>
                <p className="text-zinc-400 text-xs">
                  Управляйте мыслительным процессом с клавиатуры без лишних кликов.
                </p>
              </div>

              <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/30">
                {[
                  { key: '⌘ + K (или Ctrl + K)', action: 'Открыть командную панель (быстрый запуск тактик, смены жесткости и навигации)' },
                  { key: 'Enter', action: 'Отправить ответ в диалектическом спарринге' },
                  { key: 'Shift + Enter', action: 'Перенос строки без отправки' },
                  { key: 'Холст (в шапке)', action: 'Открыть/закрыть исполнительный меморандум решения' },
                  { key: 'Esc', action: 'Закрыть любое активное модальное окно или панель' }
                ].map((s, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-sans">{s.action}</span>
                    <span className="font-mono text-[11px] px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 shrink-0 ml-4">
                      {s.key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            Socrates // Dialectic Reasoning Core
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-sm"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
