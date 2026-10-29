import React, { useState } from 'react';
import { 
  X, 
  Wifi, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Laptop, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export default function NetworkShareModal({
  isOpen,
  onClose,
  networkInfo
}) {
  const [copiedUrl, setCopiedUrl] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const primaryUrl = networkInfo?.bonjourUrl || 'http://localhost:3000';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#090b10] border border-zinc-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Wifi className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-mono font-semibold text-zinc-100 uppercase tracking-wide">
                Сетевой доступ и LAN Sync
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Подключение со второго Mac или мобильного устройства
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

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Main Bonjour URL for other Macs */}
          <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400 flex items-center space-x-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>Основная ссылка для других Mac:</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
                mDNS / Bonjour
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={primaryUrl}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 select-all focus:outline-none"
              />
              <button
                onClick={() => handleCopy(primaryUrl)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors shrink-0"
              >
                {copiedUrl === primaryUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl === primaryUrl ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              На любом другом Mac в вашей сети откройте Safari или Chrome и перейдите по этой ссылке. Домен <code className="text-cyan-400 font-mono">.local</code> привязан к системе и не меняется при перезагрузке роутера.
            </p>
          </div>

          {/* Alternative IP Links */}
          {networkInfo?.urls && networkInfo.urls.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block flex items-center space-x-1.5">
                <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Прямой IP адрес (для iPhone, iPad или других ОС):</span>
              </span>
              <div className="space-y-1.5">
                {networkInfo.urls.map((url, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                    <span className="font-mono text-zinc-300 select-all">{url}</span>
                    <button
                      onClick={() => handleCopy(url)}
                      className="text-zinc-400 hover:text-zinc-100 p-1 rounded hover:bg-zinc-800 transition-colors"
                      title="Скопировать"
                    >
                      {copiedUrl === url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How it works info */}
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-850 text-xs text-zinc-400 space-y-1 font-sans">
            <p className="text-zinc-300 font-medium font-mono flex items-center space-x-1.5 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Локальное хранение и синхронизация</span>
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              Все сессии и мысли сохраняются на вашем компьютере в папке <code className="text-zinc-400 font-mono">data/</code>. Данные не передаются на внешние сервера без вашего ведома.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
