import React from 'react';
import { UserProfile } from '../types';
import { Smartphone, User, ChevronDown, Sparkles } from 'lucide-react';

interface Props {
  user: UserProfile;
  users: UserProfile[];
  onSelectUser: (id: string) => void;
  onOpenIPhoneModal: () => void;
  onOpenAICoach: () => void;
}

export const Header: React.FC<Props> = ({
  user,
  users,
  onSelectUser,
  onOpenIPhoneModal,
  onOpenAICoach,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 pt-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
              <span className="font-black text-sm bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">FS</span>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              FitScience
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">PRO</span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">Ciencia & Entrenamiento</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Coach Button */}
          <button
            onClick={onOpenAICoach}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold shadow-md shadow-purple-500/10 transition active:scale-95 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Coach IA</span>
          </button>

          {/* User selector dropdown */}
          <div className="relative group">
            <select
              value={user.id}
              onChange={(e) => onSelectUser(e.target.value)}
              className="appearance-none bg-[#1c1c1e] hover:bg-[#2c2c2e] text-xs font-semibold text-zinc-200 pl-7 pr-7 py-1.5 rounded-full border border-white/10 focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#1c1c1e] text-white">
                  {u.name}
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Connect iPhone Button */}
          <button
            onClick={onOpenIPhoneModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-full text-xs font-semibold shadow-sm transition active:scale-95"
            title="Conectar iPhone"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">iPhone</span>
          </button>
        </div>
      </div>
    </header>
  );
};
