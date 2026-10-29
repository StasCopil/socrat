import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  X,
  Atom,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { DEPTH_LEVELS, RIGOR_INTENSITY_MODES } from '../constants/personas';
import { querySocraticSynthesis } from '../services/socraticEngine';
import { updateSession } from '../services/storage';
import { playMechanicalClick, playEpiphanyChime } from '../services/soundEffects';

export default function ExecutiveBlueprint({
  session,
  settings,
  onOpenFullSynthesis,
  onSessionUpdated,
  currentRigor = 'strategic',
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!session) return null;

  const currentDepth = session.depthLevel || 1;
  const depthInfo = DEPTH_LEVELS.find(d => d.level === currentDepth) || DEPTH_LEVELS[0];
  const synthesis = session.synthesis || null;
  const activeRigorMode = RIGOR_INTENSITY_MODES.find(m => m.id === (session.rigorMode || currentRigor)) || RIGOR_INTENSITY_MODES[1];
  const resilienceScore = Math.min(100, Math.round((currentDepth / 5) * 80 + (synthesis ? 20 : 0)));

  const handleQuickSynthesize = async () => {
    playMechanicalClick(settings?.soundEnabled);
    setIsGenerating(true);
    try {
      const res = await querySocraticSynthesis(session, settings);
      const updated = { ...session, synthesis: res, depthLevel: 5 };
      updateSession(updated);
      onSessionUpdated(updated);
      playEpiphanyChime(settings?.soundEnabled);
    } catch (e) {
      console.error('Ошибка генерации синтеза', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMemo = () => {
    playMechanicalClick(settings?.soundEnabled);
    const text = `# ИСПОЛНИТЕЛЬНЫЙ МЕМОРАНДУМ // РЕШЕНИЕ
Исходный тезис: ${session.initialThought}
Индекс закалки: ${resilienceScore}%
Режим спарринга: ${activeRigorMode.name}

${synthesis ? `
## КРИСТАЛЛИЗОВАННАЯ СУТЬ:
${synthesis.crystallizedIdea}

## ДЕЛЬТА СДВИГА МЫШЛЕНИЯ:
- До анализа: ${session.initialThought}
- Точка излома: ${synthesis.debunkedAssumptions?.[0] || 'Вскрыты скрытые издержки'}
- После анализа (Первопричина): ${synthesis.firstPrinciples?.[0] || 'Сформулирован несгибаемый принцип'}

## ПЕРВЫЕ ПРИНЦИПЫ:
${synthesis.firstPrinciples?.map(p => `- ${p}`).join('\n')}

## ДЕКОНСТРУИРОВАННЫЕ ИЛЛЮЗИИ:
${synthesis.debunkedAssumptions?.map(a => `- ${a}`).join('\n')}

## ДИРЕКТИВЫ ПРИНЯТИЯ РЕШЕНИЙ:
${synthesis.actionManifesto?.map(m => `- ${m}`).join('\n')}
` : 'Анализ находится в процессе диалектической закалки.'}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#08090d] text-zinc-100 overflow-hidden font-sans">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 uppercase tracking-wide">
              Холст архитектуры мысли
            </h3>
            <p className="text-[11px] text-zinc-500">
              Закалка: {resilienceScore}% • {activeRigorMode.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMemo}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-colors"
            title="Скопировать меморандум в буфер обмена"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span className="hidden sm:inline">{copied ? 'Скопировано' : 'Скопировать'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 rounded-lg transition-colors"
              title="Закрыть панель (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Drawer Body: Clean Executive Document */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Seed Thesis Box */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
            Исходный тезис
          </span>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium">
            «{session.initialThought}»
          </p>
        </div>

        {synthesis ? (
          <div className="space-y-5">
            {/* Mindshift Delta */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Дельта сдвига мышления</span>
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">1. До спарринга (Сырое представление):</span>
                  <p className="text-zinc-300 font-sans">{session.initialThought}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 space-y-1">
                  <span className="text-[10px] text-rose-400 uppercase font-mono block">2. Точка излома (Вскрытая уязвимость):</span>
                  <p className="text-rose-200 font-sans">{synthesis.debunkedAssumptions?.[0] || 'Иллюзия быстрого масштабирования без защитного рва'}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-mono block">3. После спарринга (Первый принцип):</span>
                  <p className="text-emerald-200 font-sans">{synthesis.firstPrinciples?.[0] || synthesis.crystallizedIdea}</p>
                </div>
              </div>
            </div>

            {/* Crystallized Core Solution */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-750 space-y-2 shadow-lg">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Кристаллизованный вердикт</span>
              </span>
              <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-sans">
                {synthesis.crystallizedIdea}
              </p>
            </div>

            {/* First Principles */}
            {synthesis.firstPrinciples && synthesis.firstPrinciples.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center space-x-1.5">
                  <Atom className="w-3.5 h-3.5" />
                  <span>Первые принципы</span>
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {synthesis.firstPrinciples.map((p, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-cyan-400 font-mono mt-0.5">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Debunked Assumptions */}
            {synthesis.debunkedAssumptions && synthesis.debunkedAssumptions.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Разрушенные иллюзии</span>
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {synthesis.debunkedAssumptions.map((a, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-mono mt-0.5">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Directives */}
            {synthesis.actionManifesto && synthesis.actionManifesto.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Директивы к реализации</span>
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-200">
                  {synthesis.actionManifesto.map((act, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-mono mt-0.5">{idx + 1}.</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          /* Live evolving placeholder */
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 text-center space-y-4">
            <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-zinc-200">
                Холст кристаллизуется в ходе диалектики
              </p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Отвечайте на провокационные вопросы или используйте тактические маневры, чтобы закалить гипотезу до 100%.
              </p>
            </div>

            <button
              onClick={handleQuickSynthesize}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Кристаллизация вердикта...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Синтезировать прямо сейчас</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Status Strip */}
      <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span>Статус: {synthesis ? 'Закалено' : `Этап ${currentDepth}/5`}</span>
        <button
          onClick={handleQuickSynthesize}
          disabled={isGenerating}
          className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center space-x-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{synthesis ? 'Пересчитать' : 'Синтезировать'}</span>
        </button>
      </div>
    </div>
  );
}
