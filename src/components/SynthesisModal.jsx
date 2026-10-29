import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  ShieldAlert, 
  Atom, 
  Target, 
  CheckCircle2,
  FileText,
  Layers
} from 'lucide-react';
import { querySocraticSynthesis } from '../services/socraticEngine';
import { updateSession } from '../services/storage';

export default function SynthesisModal({
  session,
  settings,
  isOpen,
  onClose,
  onSessionUpdated
}) {
  const [synthesis, setSynthesis] = useState(session?.synthesis || null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      if (session.synthesis) {
        setSynthesis(session.synthesis);
      } else {
        handleGenerate();
      }
    }
  }, [isOpen, session?.id]);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#71717a', '#10b981', '#38bdf8']
      });
    } catch (e) {
      console.log('Confetti failed to run', e);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await querySocraticSynthesis(session, settings);
      setSynthesis(result);

      // Save to session
      const updated = { ...session, synthesis: result, depthLevel: 5 };
      updateSession(updated);
      onSessionUpdated(updated);

      setTimeout(() => fireConfetti(), 300);
    } catch (err) {
      console.error('Ошибка формирования синтеза:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarkdownText = () => {
    if (!synthesis) return '';
    return `# ИСПОЛНИТЕЛЬНЫЙ МЕМОРАНДУМ // СИНТЕЗ
*Система: Сократ V2.0*

## Исходная гипотеза:
> ${session.initialThought}

## Кристаллизованная суть:
${synthesis.crystallizedIdea}

## Первые принципы (Фундамент):
${synthesis.firstPrinciples?.map(p => `- ${p}`).join('\n')}

## Развеянные иллюзии и слепые зоны:
${synthesis.debunkedAssumptions?.map(a => `- ${a}`).join('\n')}

## Выдержанные контраргументы и пределы применимости:
${synthesis.counterArgumentsHandled?.map(c => `- ${c}`).join('\n')}

## Исполнительный регламент решений:
${synthesis.actionManifesto?.map(m => `- ${m}`).join('\n')}

---
*${synthesis.quote || '«Тот, кто знает достаточно, чтобы сомневаться, стоит ближе всего к истине».'}*
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMarkdownText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getMarkdownText();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socrates-memorandum-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#090b10] border border-zinc-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-semibold text-zinc-100 uppercase tracking-wide font-sans">
                  Исполнительный меморандум // Синтез
                </h2>
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  ВЕРДИКТ
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Кристаллизованное ядро решений, очищенное от когнитивных искажений
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-zinc-200 font-sans">
                  Формирование исполнительного вердикта...
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto font-sans">
                  Сведение воедино первых принципов, деконструкция аксиом и выработка практических правил решений.
                </p>
              </div>
            </div>
          ) : synthesis ? (
            <div className="space-y-6">
              {/* Seed vs Crystallized Core */}
              <div className="rounded-xl p-4 sm:p-5 bg-zinc-900 border border-zinc-700/80 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Кристаллизованная суть тезиса</span>
                </span>
                <p className="text-sm sm:text-base font-medium text-zinc-100 leading-relaxed font-sans">
                  {synthesis.crystallizedIdea}
                </p>
                <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800 font-sans">
                  Исходный тезис: «{session.initialThought}»
                </div>
              </div>

              {/* Two Column Section: First Principles & Debunked Assumptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Principles */}
                <div className="rounded-xl p-4 bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5 font-sans">
                    <Atom className="w-3.5 h-3.5" />
                    <span>Первые принципы</span>
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {synthesis.firstPrinciples?.map((principle, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-cyan-400 font-mono mt-0.5">•</span>
                        <span className="leading-relaxed font-sans">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Debunked Assumptions */}
                <div className="rounded-xl p-4 bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5 font-sans">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Разрушенные иллюзии</span>
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {synthesis.debunkedAssumptions?.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-rose-400 font-mono mt-0.5">•</span>
                        <span className="leading-relaxed font-sans">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Counter Arguments Handled */}
              {synthesis.counterArgumentsHandled?.length > 0 && (
                <div className="rounded-xl p-4 bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 font-sans">
                    <Target className="w-3.5 h-3.5" />
                    <span>Выдержанные возражения и пределы</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {synthesis.counterArgumentsHandled.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-mono mt-0.5">•</span>
                        <span className="font-sans">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Manifesto */}
              <div className="rounded-xl p-5 bg-zinc-900/90 border border-zinc-700 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 font-sans">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Исполнительный регламент решений</span>
                </span>
                <div className="space-y-2 text-xs text-zinc-200">
                  {synthesis.actionManifesto?.map((step, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-start space-x-2.5">
                      <span className="font-mono font-bold text-emerald-400">{i + 1}.</span>
                      <span className="leading-relaxed font-sans">{step.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="text-center py-2 px-4 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-400 font-sans italic">
                {synthesis.quote}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Пересчитать</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={isLoading || !synthesis}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопировано' : 'Скопировать мемо'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading || !synthesis}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-sans font-semibold bg-zinc-100 hover:bg-white text-zinc-950 shadow transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать мемо (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
