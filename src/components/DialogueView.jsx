import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  RefreshCw, 
  ShieldAlert,
  Target,
  Atom,
  X
} from 'lucide-react';
import SocraticMessageCard from './SocraticMessageCard';
import UserMessageCard from './UserMessageCard';
import ExecutiveBlueprint from './ExecutiveBlueprint';
import { playMechanicalClick, playEpiphanyChime } from '../services/soundEffects';

export default function DialogueView({
  session,
  settings,
  onSendMessage,
  onOpenSynthesis,
  onTacticalAction,
  onSessionUpdated,
  onChangeRigor,
  currentRigor,
  isLoading,
  isExecutingTactic = false,
  blueprintOpen = false,
  onToggleBlueprint
}) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isLoading]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestionPill = (pillText) => {
    playMechanicalClick(settings?.soundEnabled);
    setInputText(prev => {
      if (!prev) return pillText + ' ';
      return `${prev} ${pillText} `;
    });
    textareaRef.current?.focus();
  };

  const toggleVoice = () => {
    if (!speechSupported) {
      alert('Голосовой ввод не поддерживается в данном браузере.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const tacticalButtons = [
    { id: 'fatal_flaw', label: 'Смертельный риск', icon: ShieldAlert, color: 'text-rose-400 hover:border-rose-500/50' },
    { id: 'steel_man', label: 'Аргумент критика', icon: Target, color: 'text-cyan-400 hover:border-cyan-500/50' },
    { id: 'first_principles', label: 'Первопричины', icon: Atom, color: 'text-amber-400 hover:border-amber-500/50' },
    { id: 'inversion', label: 'Инверсия', icon: RefreshCw, color: 'text-emerald-400 hover:border-emerald-500/50' }
  ];

  return (
    <div className="flex-1 h-full flex flex-col bg-[#07080b] relative overflow-hidden">
      {/* Messages Stream: Centered, Breathable Editorial Canvas */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {session.messages.map((message, index) => {
            const isLatest = index === session.messages.length - 1;

            if (message.role === 'user') {
              return (
                <UserMessageCard
                  key={message.id || index}
                  message={message}
                />
              );
            }

            return (
              <SocraticMessageCard
                key={message.id || index}
                message={message}
                personaId={session.personaId}
                onSelectSuggestion={handleSuggestionPill}
                isLatest={isLatest}
              />
            );
          })}

          {/* Thinking / Analysis Indicator */}
          {(isLoading || isExecutingTactic) && (
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-3 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-300" />
                </div>
                <div>
                  <div className="text-xs font-sans font-medium text-zinc-200">
                    {isExecutingTactic ? 'Применение тактического маневра мысли...' : 'Сократ деконструирует аргумент...'}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-sans">
                    Поиск скрытых аксиом и расчет асимметрий риска
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Floating Bottom Console Area */}
      <div className="p-3 sm:p-5 bg-gradient-to-t from-[#07080b] via-[#07080b]/95 to-transparent">
        <div className="max-w-3xl mx-auto space-y-2.5">
          {/* Tactical Superpower Chips (Right above input) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium mr-1 hidden sm:inline">
              Маневр:
            </span>
            {tacticalButtons.map((tac) => {
              const Icon = tac.icon;
              return (
                <button
                  key={tac.id}
                  onClick={() => onTacticalAction(tac.id)}
                  disabled={isLoading || isExecutingTactic}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-sans font-medium bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 transition-all disabled:opacity-40 shrink-0 ${tac.color}`}
                  title={`Применить тактический маневр мысли: ${tac.label}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tac.label}</span>
                </button>
              );
            })}
          </div>

          {/* Elevated Floating Input Console */}
          <form onSubmit={handleSubmit} className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl p-2.5 shadow-2xl focus-within:border-zinc-600 transition-all">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={2}
              placeholder="Обоснуйте тезис, ответьте на вопрос или приведите контраргумент..."
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm p-2 resize-none focus:outline-none leading-relaxed font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />

            <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 px-1">
              {/* Voice dictation */}
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 rounded-lg text-xs font-sans flex items-center space-x-1.5 transition-colors ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
                title="Голосовой ввод"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline font-sans">
                  {isListening ? 'Слушаю...' : 'Диктовка'}
                </span>
              </button>

              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  ↵ Enter для отправки
                </span>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <span>Ответить</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Slide-over Executive Blueprint Sheet (Холст архитектуры мысли) */}
      {blueprintOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={onToggleBlueprint}
          />

          {/* Drawer container */}
          <aside className="fixed inset-y-0 right-0 w-full max-w-xl z-50 bg-[#08090d] border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <ExecutiveBlueprint
              session={session}
              settings={settings}
              onTacticalAction={onTacticalAction}
              onOpenFullSynthesis={onOpenSynthesis}
              onSessionUpdated={onSessionUpdated}
              onChangeRigor={onChangeRigor}
              currentRigor={currentRigor}
              onClose={onToggleBlueprint}
              isExecutingTactic={isExecutingTactic}
            />
          </aside>
        </>
      )}
    </div>
  );
}
