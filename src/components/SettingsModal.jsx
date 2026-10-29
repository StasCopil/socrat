import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Sparkles, 
  Bot, 
  ExternalLink, 
  Check, 
  Trash2, 
  Download, 
  ShieldAlert,
  Cpu,
  Sliders,
  Terminal,
  Layers,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { saveSettings, getSessions, saveSessions } from '../services/storage';
import { testGeminiApiKey } from '../services/socraticEngine';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsSaved
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState({ isTesting: false, result: null });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    setSaved(false);
    setTestStatus({ isTesting: false, result: null });
  };

  const handleTestKey = async () => {
    setTestStatus({ isTesting: true, result: null });
    const res = await testGeminiApiKey(formData.geminiKey, formData.geminiModel);
    setTestStatus({ isTesting: false, result: res });
  };

  const handleSave = () => {
    saveSettings(formData);
    onSettingsSaved(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleExportData = () => {
    const data = getSessions();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socrates-sessions-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Удалить ВСЮ историю и сессии? Это действие необратимо.')) {
      saveSessions([]);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#090b10] border border-zinc-700/80 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Sliders className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100 uppercase tracking-wide font-sans">
                Конфигурация интеллекта
              </h2>
              <p className="text-[11px] text-zinc-400 font-sans">
                Провайдеры нейросетей, API-ключи и проверка подключения
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Provider Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-sans">
              Выбор движка мышления
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gemini', name: 'Google Gemini', desc: 'Gemini 1.5 / 2.0 Flash (Бесплатно)' },
                { id: 'offline', name: 'Автономный режим', desc: 'Встроенный локальный движок' },
                { id: 'openai', name: 'OpenAI API', desc: 'GPT-4o / GPT-4o-mini' },
                { id: 'openrouter', name: 'OpenRouter', desc: 'Claude 3.5 Sonnet / DeepSeek' }
              ].map((p) => {
                const isSelected = formData.provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleChange('provider', p.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-zinc-850 border-zinc-400 ring-1 ring-zinc-400/30'
                        : 'bg-zinc-900/60 hover:bg-zinc-850/80 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-zinc-200 font-sans">
                        {p.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-sans">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Gemini API Key, Model & Diagnostics */}
          {formData.provider === 'gemini' && (
            <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-700/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5 font-sans">
                  <Key className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Ключ API Google Gemini</span>
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1 font-sans"
                >
                  <span>Получить ключ бесплатно</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <input
                type="text"
                placeholder="Вставьте ключ AQ.Ab8... или AIzaSy..."
                value={formData.geminiKey || ''}
                onChange={(e) => handleChange('geminiKey', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />

              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 block font-sans">Модель Gemini:</label>
                <select
                  value={formData.geminiModel || 'gemini-3.5-flash-lite'}
                  onChange={(e) => handleChange('geminiModel', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 font-sans"
                >
                  <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (Рекомендовано, ультрабыстрая)</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Стабильная)</option>
                  <option value="gemini-flash-latest">Gemini Flash Latest (Автообновляемая)</option>
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Новейшая)</option>
                </select>
              </div>

              {/* Live Test & Diagnostics Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={testStatus.isTesting || !formData.geminiKey}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 transition-all disabled:opacity-50"
                >
                  {testStatus.isTesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Отправка тестового запроса к Google...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Проверить подключение к Gemini</span>
                    </>
                  )}
                </button>

                {/* Diagnostics Result Card */}
                {testStatus.result && (
                  <div className={`mt-2.5 p-3 rounded-lg border text-xs leading-relaxed ${
                    testStatus.result.ok
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}>
                    {testStatus.result.ok ? (
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-emerald-300">Подключение успешно!</p>
                          <p className="text-[11px] text-emerald-400/90 mt-0.5">
                            Тестовый ответ от Google Gemini получен за {testStatus.result.elapsed} мс. Настоящий ИИ активен и готов к работе.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-rose-300">Ошибка подключения:</p>
                          <p className="text-[11px] text-rose-200/90 mt-0.5">
                            {testStatus.result.error}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans pt-1 border-t border-zinc-800/80">
                Ключ сохраняется локально в памяти вашего браузера и файле <code className="text-zinc-400 font-mono">data/settings.json</code>.
              </p>
            </div>
          )}

          {/* Section 3: OpenAI API Key */}
          {formData.provider === 'openai' && (
            <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-700/80 space-y-3">
              <span className="text-xs font-semibold text-zinc-300 block font-sans">
                Ключ API OpenAI
              </span>
              <input
                type="password"
                placeholder="sk-..."
                value={formData.openaiKey || ''}
                onChange={(e) => handleChange('openaiKey', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          )}

          {/* Section 4: OpenRouter API Key */}
          {formData.provider === 'openrouter' && (
            <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-700/80 space-y-3">
              <span className="text-xs font-semibold text-zinc-300 block font-sans">
                Ключ API OpenRouter
              </span>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={formData.openrouterKey || ''}
                onChange={(e) => handleChange('openrouterKey', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          )}

          {/* Section 5: Data Management */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block font-sans">
              Управление данными сессий
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-sans text-zinc-300 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Сохранить копию (JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleClearData}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-sans text-rose-400 hover:text-rose-300 bg-rose-950/20 border border-rose-900/30 hover:border-rose-800/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Очистить историю</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <span className="text-xs font-sans text-emerald-400">
            {saved ? 'Настройки успешно сохранены' : ''}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-sans text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-sans font-semibold bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Сохранить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
