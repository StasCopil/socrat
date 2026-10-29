import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  ArrowRight, 
  Radio
} from 'lucide-react';
import { SOCRATIC_PERSONAS } from '../constants/personas';
import SocraticIcon from './SocraticIcon';

export default function NewThoughtForm({ onSubmit, initialText = '', initialPersona = 'classic' }) {
  const [thought, setThought] = useState(initialText);
  const [selectedPersona, setSelectedPersona] = useState(initialPersona);
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);

  useEffect(() => {
    if (initialText) setThought(initialText);
  }, [initialText]);

  useEffect(() => {
    if (initialPersona) setSelectedPersona(initialPersona);
  }, [initialPersona]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setRecognitionSupported(true);
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionSupported) {
      alert('Голосовой ввод не поддерживается вашим браузером.');
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
        setThought(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!thought.trim()) return;
    onSubmit({
      initialThought: thought.trim(),
      personaId: selectedPersona
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 sm:py-20 px-4">
      {/* Title & Introduction */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight font-sans">
          Какую идею или решение проверить на прочность?
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-sans">
          Сформулируйте тезис или дилемму. Сократ вскроет скрытые допущения, проведет стресс-тест и поможет кристаллизовать решение.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative rounded-2xl bg-zinc-900/80 border border-zinc-800 p-3 sm:p-4 shadow-xl focus-within:border-zinc-600 transition-all">
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            rows={3}
            placeholder="Например: «Хочу запустить агентство по ИИ-автоматизации и выйти на 20 000$ в месяц...»"
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm p-2 resize-none focus:outline-none leading-relaxed font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />

          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 px-1">
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-colors ${
                isListening
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
              title="Надиктовать мысль"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-sans">
                {isListening ? 'Запись...' : 'Диктовка'}
              </span>
            </button>

            <button
              type="submit"
              disabled={!thought.trim()}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-100 text-zinc-950 hover:bg-white shadow"
            >
              <span>Начать спарринг</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Framework Selector (Compact chips) */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
            Стиль диалектики
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOCRATIC_PERSONAS.map((persona) => {
              const isSelected = selectedPersona === persona.id;
              return (
                <button
                  type="button"
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-zinc-850 border-zinc-500 text-zinc-100 shadow'
                      : 'bg-zinc-900/40 hover:bg-zinc-850/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SocraticIcon name={persona.iconName || persona.id} className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                    <span className="font-sans font-medium text-xs truncate">
                      {persona.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick starter chips */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
            Примеры тезисов
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { text: 'Хочу открыть свой бизнес, чтобы обрести свободу', persona: 'classic' },
              { text: 'Хорошему продукту маркетинг и продажи не нужны', persona: 'pragmatist' },
              { text: 'Уйти из найма в стартап ради квантового роста дохода', persona: 'first_principles' }
            ].map((starter, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setThought(starter.text);
                  setSelectedPersona(starter.persona);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors text-left font-sans"
              >
                «{starter.text}»
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
