import React from 'react';
import { User, Radio } from 'lucide-react';

export default function UserMessageCard({ message }) {
  const isSeed = message.isSeed;

  return (
    <div className="flex justify-end">
      <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 space-y-2 transition-all ${
        isSeed
          ? 'bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 shadow-lg'
          : 'bg-zinc-900/60 border border-zinc-800 text-zinc-200'
      }`}>
        <div className="flex items-center justify-between space-x-3 text-[10px] font-mono text-zinc-400">
          <div className="flex items-center space-x-1.5 uppercase tracking-wider">
            {isSeed ? (
              <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span>Исходный тезис</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 text-zinc-400">
                <User className="w-3 h-3 text-zinc-500" />
                <span>Ваш ответ</span>
              </span>
            )}
          </div>

          <span className="text-zinc-500">
            {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-zinc-100 font-sans">
          {message.content}
        </p>
      </div>
    </div>
  );
}
