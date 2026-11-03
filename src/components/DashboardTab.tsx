import React from 'react';
import { UserProfile, Workout, NutritionLog, PlannedDay, MuscleGroup } from '../types';
import { NutritionEngine } from '../services/nutritionEngine';
import { TrainingEngine, ALL_MUSCLE_GROUPS } from '../services/trainingEngine';
import { ScoreEngine } from '../services/scoreEngine';
import { Sparkles, Dumbbell, Utensils, CheckCircle2, ChevronRight, Moon, Flame, MessageSquare, Plus } from 'lucide-react';
import { triggerHaptic } from '../services/haptics';

interface Props {
  user: UserProfile;
  todayLog?: NutritionLog;
  workouts: Workout[];
  planning: PlannedDay[];
  onNavigateTab: (tab: 'workouts' | 'nutrition' | 'planning' | 'stats') => void;
  onOpenAICoach: () => void;
}

export const DashboardTab: React.FC<Props> = ({
  user,
  todayLog,
  workouts,
  planning,
  onNavigateTab,
  onOpenAICoach,
}) => {
  const targetMacros = NutritionEngine.calculateTargetMacros(user);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const workoutToday = workouts.some(w => w.date === todayStr && w.isCompleted);
  const scoreData = ScoreEngine.calculateDailyScore(todayLog, user, workoutToday);
  
  const weeklyVolume = TrainingEngine.calculateWeeklyVolume(workouts);
  const volumeRec = TrainingEngine.getVolumeRecommendation(weeklyVolume);
  const nutritionFeedback = NutritionEngine.getNutritionFeedback(user, todayLog);

  // Today's planned workout
  const dayIndex = (new Date().getDay() + 6) % 7; // 0 = Lunes, 6 = Domingo
  const todayPlan = planning[dayIndex] || planning[0];

  const currentCalories = todayLog?.calories ?? 0;
  const currentProtein = todayLog?.protein ?? 0;
  const currentCarbs = todayLog?.carbs ?? 0;
  const currentFats = todayLog?.fats ?? 0;
  const currentSleep = todayLog?.sleepHours ?? 0;

  // Macro Ring Helper
  const renderMacroRing = (
    title: string,
    current: number,
    target: number,
    unit: string,
    strokeColor: string,
    trackColor: string
  ) => {
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(1.0, Math.max(0, current / (target || 1)));
    const strokeDashoffset = circumference - progress * circumference;

    return (
      <div className="flex flex-col items-center bg-[#1c1c1e] p-3 rounded-2xl border border-white/5 shadow-sm">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className={trackColor}
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`${strokeColor} transition-all duration-700 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black tracking-tight">{Math.round(current)}</span>
            <span className="text-[9px] text-zinc-400 -mt-0.5">{unit}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-zinc-300 mt-1.5">{title}</span>
        <span className="text-[10px] text-zinc-400">meta: {Math.round(target)}{unit}</span>
      </div>
    );
  };

  // Score circular calculation
  const scoreRadius = 54;
  const scoreCircumference = 2 * Math.PI * scoreRadius;
  const scoreOffset = scoreCircumference - (scoreData.total / 100) * scoreCircumference;

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Saludo y Resumen */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Hola, {user.name} 👋
          </h2>
          <p className="text-xs text-zinc-400">
            Plan: <span className="text-blue-400 font-semibold">{user.goal === 'fatLoss' ? 'Perder Grasa' : user.goal === 'muscleGain' ? 'Ganar Músculo' : 'Recomposición'}</span> • {user.weight} kg
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('nutrition')}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-zinc-300 transition"
        >
          <Moon className="w-3.5 h-3.5 text-purple-400" />
          <span>Sueño: <strong>{currentSleep > 0 ? `${currentSleep}h` : 'Registrar'}</strong></span>
        </button>
      </div>

      {/* Tarjeta Principal: Daily Score */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#242426] to-[#1c1c1e] rounded-3xl p-5 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                Score Científico
              </span>
              <span className="text-xs text-zinc-400">Hoy</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight text-white">
              {scoreData.total}
              <span className="text-lg text-zinc-400 font-normal">/100</span>
            </h3>
            <p className="text-xs text-zinc-300 max-w-[210px] leading-relaxed">
              {currentCalories === 0 && !workoutToday
                ? 'Empieza registrando tus comidas o tu entreno de hoy para sumar puntos a tu score.'
                : scoreData.total >= 85
                ? '¡Rendimiento sobresaliente! Estímulo y nutrientes al 100%.'
                : 'Buen progreso. Ajusta proteína y completa el entreno para maximizar.'}
            </p>
          </div>

          {/* SVG Score Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={scoreRadius}
                stroke="#2c2c2e"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={scoreRadius}
                stroke="url(#scoreGradient)"
                strokeWidth="10"
                strokeDasharray={scoreCircumference}
                strokeDashoffset={scoreOffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#30D158" />
                  <stop offset="50%" stopColor="#0A84FF" />
                  <stop offset="100%" stopColor="#BF5AF2" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 mt-0.5">FIT INDEX</span>
            </div>
          </div>
        </div>

        {/* Barra desglosada del Score */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
          <div className="bg-black/30 p-2 rounded-xl">
            <span className="text-[10px] text-zinc-400 block">Nutrición</span>
            <span className="text-xs font-bold text-orange-400">{scoreData.nutritionScore}/50</span>
          </div>
          <div className="bg-black/30 p-2 rounded-xl">
            <span className="text-[10px] text-zinc-400 block">Descanso</span>
            <span className="text-xs font-bold text-purple-400">{scoreData.sleepScore}/30</span>
          </div>
          <div className="bg-black/30 p-2 rounded-xl">
            <span className="text-[10px] text-zinc-400 block">Entreno</span>
            <span className="text-xs font-bold text-blue-400">{scoreData.workoutScore}/20</span>
          </div>
        </div>
      </div>

      {/* Tarjeta Destacada del Coach IA */}
      <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-blue-950/40 border border-purple-500/30 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Agente Coach IA</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  En línea
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {currentCalories === 0
                  ? 'Tu diario de hoy está listo para que registres tus comidas. ¿Quieres que te planifique los macros?'
                  : nutritionFeedback}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenAICoach();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-purple-600/20 active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Consultar al Coach IA (Dudas, Recetas, Pesos)</span>
        </button>
      </div>

      {/* Anillos de Macronutrientes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-orange-400" />
            Nutrición de Hoy
          </h3>
          <button
            onClick={() => onNavigateTab('nutrition')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
          >
            {currentCalories === 0 ? '+ Empezar a rellenar' : 'Añadir comida'} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {renderMacroRing('Calorías', currentCalories, targetMacros.calories, 'k', 'text-orange-500', 'text-orange-950')}
          {renderMacroRing('Proteína', currentProtein, targetMacros.protein, 'g', 'text-red-500', 'text-red-950')}
          {renderMacroRing('Carbs', currentCarbs, targetMacros.carbs, 'g', 'text-blue-500', 'text-blue-950')}
          {renderMacroRing('Grasas', currentFats, targetMacros.fats, 'g', 'text-yellow-500', 'text-yellow-950')}
        </div>
      </div>

      {/* Sesión de Entreno Planeada Para Hoy */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-blue-400" />
            Entreno Programado ({todayPlan.dayName})
          </h3>
          <button
            onClick={() => onNavigateTab('planning')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
          >
            Ver planning <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${todayPlan.isRestDay ? 'bg-zinc-700 text-zinc-300' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {todayPlan.isRestDay ? 'Descanso' : 'Sesión'}
              </span>
              <span className="text-xs text-zinc-400">{todayPlan.calorieTargetDesc}</span>
            </div>
            <h4 className="text-base font-bold text-white">{todayPlan.routineName}</h4>
            <div className="flex items-center gap-1.5 flex-wrap">
              {todayPlan.focusMuscles.map(m => (
                <span key={m} className="text-[10px] px-2 py-0.5 bg-white/5 text-zinc-300 rounded-md">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              onNavigateTab('workouts');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30 active:scale-95 flex-shrink-0"
          >
            {workoutToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                Completado
              </>
            ) : (
              <>
                <Dumbbell className="w-4 h-4" />
                Registrar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Volumen Semanal por Grupo Muscular */}
      <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Volumen Semanal Efectivo (10-20 series)
          </h4>
          <span className="text-[10px] text-zinc-400">Óptimo Hipertrofia</span>
        </div>

        <div className="space-y-2.5">
          {ALL_MUSCLE_GROUPS.map((muscle) => {
            const count = weeklyVolume[muscle] ?? 0;
            const progress = Math.min(100, (count / 20) * 100);
            const isSuboptimal = count < 10;
            const isOverkill = count > 20;

            const barColor = isSuboptimal ? 'bg-amber-500' : isOverkill ? 'bg-red-500' : 'bg-emerald-500';

            return (
              <div key={muscle} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">{muscle}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">
                      {isSuboptimal ? 'Bajo (<10)' : isOverkill ? 'Excesivo (>20)' : 'Óptimo'}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      {count} / 20 series
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
