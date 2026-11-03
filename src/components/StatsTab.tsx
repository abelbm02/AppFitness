import React, { useState } from 'react';
import { NutritionLog, Workout, UserProfile, MuscleGroup } from '../types';
import { TrainingEngine, ALL_MUSCLE_GROUPS } from '../services/trainingEngine';
import { NutritionEngine } from '../services/nutritionEngine';
import { BarChart3, Calculator, TrendingUp, Award } from 'lucide-react';

interface Props {
  user: UserProfile;
  logs: NutritionLog[];
  workouts: Workout[];
}

export const StatsTab: React.FC<Props> = ({
  user,
  logs,
  workouts,
}) => {
  const targetMacros = NutritionEngine.calculateTargetMacros(user);
  const weeklyVolume = TrainingEngine.calculateWeeklyVolume(workouts);

  // 1RM Calculator State
  const [calcWeight, setCalcWeight] = useState(85);
  const [calcReps, setCalcReps] = useState(8);
  const estimated1RM = TrainingEngine.estimate1RM(calcWeight, calcReps);

  // Prepare 7-day logs for protein chart
  const recentLogs = [...logs].slice(-7);

  // Donut chart calculations for muscle volume
  const totalVolumeSets = Object.values(weeklyVolume).reduce((a, b) => a + b, 0);

  const colors: Record<MuscleGroup, string> = {
    Pecho: '#0A84FF',
    Espalda: '#30D158',
    Piernas: '#FF9F0A',
    Hombros: '#BF5AF2',
    Brazos: '#FF453A',
    Core: '#64D2FF'
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Métricas & Análisis
          </h2>
          <p className="text-xs text-zinc-400">
            Adherencia a Macros, Distribución de Cargas y Estimación de 1RM
          </p>
        </div>
      </div>

      {/* Gráfica 1: Cumplimiento de Proteína (Últimos 7 días) */}
      <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Adherencia Proteica (7 días)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Meta: {targetMacros.protein}g / día
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
            2.0 g/kg
          </span>
        </div>

        {/* SVG Bar Chart */}
        <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-white/10">
          {recentLogs.map((log, idx) => {
            const heightPercent = Math.min(100, (log.protein / (targetMacros.protein * 1.25)) * 100);
            const isMet = log.protein >= targetMacros.protein;

            return (
              <div key={log.id || idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-zinc-400 mb-1 opacity-80 group-hover:opacity-100 transition">
                  {Math.round(log.protein)}g
                </span>
                <div className="w-full bg-zinc-800 rounded-t-lg relative flex items-end h-32 overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${
                      isMet ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[9px] text-zinc-500 mt-2 font-mono">
                  D{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Objetivo Alcanzado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Por debajo del umbral</span>
          </div>
        </div>
      </div>

      {/* Gráfica 2: Distribución de Volumen Muscular */}
      <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-5 space-y-4">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Distribución de Estímulo Semanal
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {totalVolumeSets} Series Efectivas Registradas
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ALL_MUSCLE_GROUPS.map(muscle => {
            const sets = weeklyVolume[muscle] ?? 0;
            const pct = totalVolumeSets > 0 ? Math.round((sets / totalVolumeSets) * 100) : 0;
            const color = colors[muscle];

            return (
              <div key={muscle} className="bg-black/40 border border-white/5 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <div>
                    <span className="text-xs font-bold text-white block">{muscle}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{sets} series</span>
                  </div>
                </div>
                <span className="text-sm font-black font-mono" style={{ color }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calculadora Científica de 1RM */}
      <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Calculadora 1RM (Fórmula de Epley)</h3>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">1RM = Peso × (1 + Reps/30)</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-zinc-400 font-bold block mb-1">Peso Levantado (kg)</label>
            <input
              type="number"
              value={calcWeight}
              onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-black/50 text-white font-mono font-bold text-sm px-3 py-2 rounded-xl border border-white/10"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400 font-bold block mb-1">Repeticiones</label>
            <input
              type="number"
              value={calcReps}
              onChange={(e) => setCalcReps(parseInt(e.target.value) || 0)}
              className="w-full bg-black/50 text-white font-mono font-bold text-sm px-3 py-2 rounded-xl border border-white/10"
            />
          </div>
        </div>

        {/* Resultado de 1RM */}
        <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
              1RM Teórico Estimado
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {estimated1RM} <span className="text-sm text-zinc-400 font-normal">kg</span>
            </div>
          </div>
          <div className="text-right text-xs font-mono space-y-1">
            <div className="text-zinc-300">85% (5RM): <strong>{Math.round(estimated1RM * 0.85)} kg</strong></div>
            <div className="text-zinc-300">75% (10RM): <strong>{Math.round(estimated1RM * 0.75)} kg</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
