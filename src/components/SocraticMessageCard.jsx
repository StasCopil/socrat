import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  CornerDownRight, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DEPTH_LEVELS, SOCRATIC_PERSONAS } from '../constants/personas';
import SocraticIcon from './SocraticIcon';

export default function SocraticMessageCard({ 
  message, 
  personaId = 'classic',
  onSelectSuggestion,
  isLatest = false 
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const persona = SOCRATIC_PERSONAS.find(p => p.id === personaId) || SOCRATIC_PERSONAS[0];
  const depth = DEPTH_LEVELS.find(d => d.level === message.depthLevel) || DEPTH_LEVELS[0];

  const handleCopy = () => {
    const textToCopy = message.coreQuestion 
      ? `${message.reflection ? message.reflection + '\n\n' : ''}Вопрос: ${message.coreQuestion}`
      : message.content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Синтез речи не поддерживается браузером');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = message.coreQuestion || message.content;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`relative rounded-2xl transition-all duration-300 ${
      isLatest 
        ? 'bg-[#0b0c10]/90 border border-zinc-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)]' 
        : 'bg-[#090a0e]/60 border border-zinc-800/60'
    } p-5 sm:p-7 space-y-5 group`}>
      
      {/* Header bar: Minimal persona info & actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
            <SocraticIcon name={persona.iconName || persona.id} className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-zinc-200 font-sans tracking-wide">
              {persona.name}
            </span>
            <span className="text-zinc-600 font-mono text-[11px]">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              Этап {message.depthLevel || 1}/5 ({depth.short})
            </span>
          </div>
        </div>

        {/* Actions: Copy & TTS */}
        <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleSpeak}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              isSpeaking
                ? 'text-emerald-300 bg-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
            title={isSpeaking ? 'Остановить' : 'Озвучить вопрос'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-emerald-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
            title="Скопировать"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Reflection: Clean, intelligent prose without clunky boxes */}
      {message.reflection && (
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
          {message.reflection}
        </p>
      )}

      {/* Hidden Assumption: Elegant left-accent callout */}
      {message.hiddenAssumption && (
        <div className="border-l-2 border-amber-500/80 bg-amber-500/[0.04] py-2 px-3.5 rounded-r-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold block mb-0.5">
            Скрытая аксиома
          </span>
          <p className="text-xs sm:text-sm text-zinc-200 leading-normal font-sans">
            {message.hiddenAssumption}
          </p>
        </div>
      )}

      {/* The Core Question: The Epicenter of the card */}
      <div className="pt-1 pb-1">
        <p className="text-base sm:text-lg lg:text-xl font-semibold text-zinc-100 leading-relaxed font-sans tracking-tight">
          {message.coreQuestion || message.content}
        </p>
      </div>

      {/* Alternative Angle: Crisp subtle note */}
      {message.alternativeAngle && (
        <div className="flex items-start space-x-2 text-xs sm:text-sm text-zinc-400 pt-1">
          <CornerDownRight className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-1" />
          <p className="leading-relaxed">
            <span className="text-zinc-300 font-medium">Контр-ракурс: </span>
            {message.alternativeAngle}
          </p>
        </div>
      )}

      {/* Suggested Quick Response Chips */}
      {message.suggestedPills && message.suggestedPills.length > 0 && isLatest && (
        <div className="pt-3 border-t border-zinc-800/60 space-y-2">
          <div className="flex flex-wrap gap-2">
            {message.suggestedPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(pill)}
                className="text-xs text-left px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all flex items-center space-x-1.5 font-sans group/pill"
              >
                <span>{pill}</span>
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover/pill:text-zinc-300 group-hover/pill:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
