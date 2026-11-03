import React from 'react';
import { UserProfile } from '../types';
import { Smartphone, User, ChevronDown } from 'lucide-react';

interface Props {
  user: UserProfile;
  users: UserProfile[];
  onSelectUser: (id: string) => void;
  onOpenIPhoneModal: () => void;
}

export const Header: React.FC<Props> = ({
  user,
  users,
  onSelectUser,
  onOpenIPhoneModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 pt-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
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
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver en iPhone</span>
            <span className="sm:hidden">iPhone</span>
          </button>
        </div>
      </div>
    </header>
  );
};
