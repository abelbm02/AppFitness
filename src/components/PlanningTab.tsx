import React, { useState } from 'react';
import { PlannedDay, MuscleGroup } from '../types';
import { ALL_MUSCLE_GROUPS } from '../services/trainingEngine';
import { CalendarCheck, Dumbbell, Coffee, CheckCircle2, Circle, Edit3, X, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../services/haptics';

interface Props {
  planning: PlannedDay[];
  onSavePlanning: (planning: PlannedDay[]) => void;
}

export const PlanningTab: React.FC<Props> = ({
  planning,
  onSavePlanning,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editRoutineName, setEditRoutineName] = useState('');
  const [editIsRest, setEditIsRest] = useState(false);
  const [editFocusMuscles, setEditFocusMuscles] = useState<MuscleGroup[]>([]);
  const [editCalorieTarget, setEditCalorieTarget] = useState('');

  const handleToggleComplete = (index: number) => {
    triggerHaptic('light');
    const updated = [...planning];
    updated[index] = {
      ...updated[index],
      completed: !updated[index].completed
    };
    onSavePlanning(updated);
  };

  const handleStartEdit = (index: number) => {
    triggerHaptic('light');
    const day = planning[index];
    setEditingIndex(index);
    setEditRoutineName(day.routineName);
    setEditIsRest(day.isRestDay);
    setEditFocusMuscles([...day.focusMuscles]);
    setEditCalorieTarget(day.calorieTargetDesc);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    triggerHaptic('medium');
    const updated = [...planning];
    updated[editingIndex] = {
      ...updated[editingIndex],
      routineName: editRoutineName || (editIsRest ? 'Descanso' : 'Entrenamiento'),
      isRestDay: editIsRest,
      focusMuscles: editIsRest ? [] : editFocusMuscles,
      calorieTargetDesc: editCalorieTarget || (editIsRest ? 'Mantenimiento' : 'Superávit')
    };
    onSavePlanning(updated);
    setEditingIndex(null);
  };

  const toggleMuscle = (muscle: MuscleGroup) => {
    if (editFocusMuscles.includes(muscle)) {
      setEditFocusMuscles(editFocusMuscles.filter(m => m !== muscle));
    } else {
      setEditFocusMuscles([...editFocusMuscles, muscle]);
    }
  };

  const completedDaysCount = planning.filter(p => p.completed).length;

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" />
            Planning Semanal
          </h2>
          <p className="text-xs text-zinc-400">
            Distribución de Rutinas & Ciclos de Calorías (Lunes - Domingo)
          </p>
        </div>
        <div className="bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
          {completedDaysCount} / 7 días
        </div>
      </div>

      {/* Tarjeta de Estrategia Científica de Planificación */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-purple-950/40 border border-emerald-500/20 rounded-3xl p-5 space-y-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Estrategia de Ciclo de Carbohidratos</h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Los días de pierna y torso pesado sincronizan un superávit energético para síntesis proteica máxima. Los días de descanso priorizan la sensibilidad insulínica con calorías de mantenimiento.
        </p>
      </div>

      {/* Editor Modal */}
      {editingIndex !== null && (
        <div className="bg-[#1c1c1e] border-2 border-emerald-500/40 rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">
              Editar Plan de {planning[editingIndex].dayName}
            </h3>
            <button
              onClick={() => setEditingIndex(null)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-zinc-300">¿Día de descanso?</label>
              <input
                type="checkbox"
                checked={editIsRest}
                onChange={(e) => setEditIsRest(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {!editIsRest && (
              <>
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1">Nombre de la Rutina</label>
                  <input
                    type="text"
                    value={editRoutineName}
                    onChange={(e) => setEditRoutineName(e.target.value)}
                    className="w-full bg-[#2c2c2e] text-white text-xs px-3 py-2 rounded-xl border border-white/10"
                    placeholder="Ej: Piernas & Core"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1">Músculos Objetivo</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_MUSCLE_GROUPS.map(muscle => {
                      const selected = editFocusMuscles.includes(muscle);
                      return (
                        <button
                          key={muscle}
                          type="button"
                          onClick={() => toggleMuscle(muscle)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                            selected
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {muscle}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Estrategia Nutricional</label>
              <input
                type="text"
                value={editCalorieTarget}
                onChange={(e) => setEditCalorieTarget(e.target.value)}
                className="w-full bg-[#2c2c2e] text-white text-xs px-3 py-2 rounded-xl border border-white/10"
                placeholder="Ej: Superávit alto (+300 kcal)"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setEditingIndex(null)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 font-bold rounded-xl text-xs transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Días de la Semana */}
      <div className="space-y-3">
        {planning.map((day, idx) => {
          return (
            <div
              key={day.dayName}
              className={`border rounded-2xl p-4 transition-all ${
                day.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-[#1c1c1e] border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(idx)}
                    className="mt-1 text-zinc-400 hover:text-emerald-400 transition"
                  >
                    {day.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{day.dayName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        day.isRestDay
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {day.isRestDay ? 'Descanso' : 'Entreno'}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-zinc-200 mt-1 flex items-center gap-1.5">
                      {day.isRestDay ? (
                        <Coffee className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Dumbbell className="w-4 h-4 text-blue-400" />
                      )}
                      {day.routineName}
                    </h4>

                    {day.focusMuscles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {day.focusMuscles.map(m => (
                          <span key={m} className="text-[10px] px-2 py-0.5 bg-black/40 text-zinc-300 rounded-md border border-white/5">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="text-[11px] text-zinc-400 block mt-2 font-mono">
                      Nutrición: {day.calorieTargetDesc}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartEdit(idx)}
                  className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
