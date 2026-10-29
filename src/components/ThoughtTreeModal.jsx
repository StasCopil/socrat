import React from 'react';
import { 
  X, 
  GitBranch, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Terminal, 
  MessageSquare,
  Scale
} from 'lucide-react';
import { DEPTH_LEVELS, SOCRATIC_PERSONAS } from '../constants/personas';
import SocraticIcon from './SocraticIcon';

export default function ThoughtTreeModal({ session, isOpen, onClose, onOpenSynthesis }) {
  if (!isOpen || !session) return null;

  const persona = SOCRATIC_PERSONAS.find(p => p.id === session.personaId) || SOCRATIC_PERSONAS[0];

  const steps = [];
  session.messages.forEach((msg, idx) => {
    if (msg.role === 'user') {
      steps.push({
        type: msg.isSeed ? 'seed' : 'user',
        title: msg.isSeed ? 'Исходный тезис' : `Аргумент (Этап ${msg.depthLevel || 1})`,
        content: msg.content,
        timestamp: msg.timestamp,
        depth: msg.depthLevel || 1
      });
    } else if (msg.role === 'assistant') {
      steps.push({
        type: 'assistant',
        title: `Вопрос спарринг-партнера: ${DEPTH_LEVELS.find(d => d.level === msg.depthLevel)?.short || ''}`,
        content: msg.coreQuestion || msg.content,
        assumption: msg.hiddenAssumption,
        reflection: msg.reflection,
        timestamp: msg.timestamp,
        depth: msg.depthLevel || 1
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#090b10] border border-zinc-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <GitBranch className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-mono font-semibold text-zinc-100 uppercase tracking-wide">
                Граф эволюции аргумента
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Последовательная деконструкция и закалка мысли
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

        {/* Tree Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="relative border-l-2 border-zinc-800 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
            {steps.map((step, index) => {
              const isSeed = step.type === 'seed';
              const isAssistant = step.type === 'assistant';

              return (
                <div key={index} className="relative group">
                  {/* Node icon on line */}
                  <div className={`absolute -left-[27px] sm:-left-[35px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                    isSeed
                      ? 'bg-zinc-900 border-emerald-400 text-emerald-400'
                      : isAssistant
                      ? 'bg-zinc-900 border-cyan-400 text-cyan-400'
                      : 'bg-zinc-900 border-zinc-600 text-zinc-400'
                  }`}>
                    {isSeed ? (
                      <Radio className="w-3 h-3 text-emerald-400" />
                    ) : isAssistant ? (
                      <Scale className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <MessageSquare className="w-3 h-3 text-zinc-400" />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`rounded-xl p-3.5 border transition-all ${
                    isSeed
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      : isAssistant
                      ? 'bg-zinc-900/80 border-zinc-800 text-zinc-200'
                      : 'bg-zinc-950/60 border-zinc-850 text-zinc-300'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono font-semibold uppercase tracking-wider text-zinc-400">
                        {step.title}
                      </span>
                      <span className="text-zinc-500 text-[10px] font-mono">
                        {new Date(step.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {step.assumption && (
                      <div className="text-xs text-amber-300 font-mono mb-2 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 flex items-center space-x-1.5">
                        <Eye className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Аксиома: {step.assumption}</span>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm leading-relaxed font-sans text-zinc-200">
                      {step.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            Шагов деконструкции: <strong className="text-zinc-200 font-semibold">{steps.length}</strong>
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenSynthesis();
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-zinc-100 hover:bg-white text-zinc-950 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
            <span>Перейти к синтезу</span>
          </button>
        </div>
      </div>
    </div>
  );
}
