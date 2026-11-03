import React from 'react';
import { Home, Dumbbell, Utensils, CalendarCheck, BarChart3, User } from 'lucide-react';
import { triggerHaptic } from '../services/haptics';

export type TabType = 'today' | 'workouts' | 'nutrition' | 'planning' | 'stats' | 'profile';

interface Props {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Hoy', icon: Home },
    { id: 'workouts' as TabType, label: 'Entreno', icon: Dumbbell },
    { id: 'nutrition' as TabType, label: 'Comidas', icon: Utensils },
    { id: 'planning' as TabType, label: 'Planning', icon: CalendarCheck },
    { id: 'stats' as TabType, label: 'Gráficas', icon: BarChart3 },
    { id: 'profile' as TabType, label: 'Perfil', icon: User },
  ];

  const handleSelect = (id: TabType) => {
    triggerHaptic('light');
    onChangeTab(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121214]/90 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 ${
                isActive
                  ? 'text-blue-400 scale-105'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-blue-400 font-bold' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

