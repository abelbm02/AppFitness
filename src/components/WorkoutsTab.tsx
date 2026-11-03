import React, { useState, useEffect } from 'react';
import { Workout, Exercise, WorkoutSet, MuscleGroup } from '../types';
import { ALL_MUSCLE_GROUPS, TrainingEngine } from '../services/trainingEngine';
import { Dumbbell, Plus, Trash2, CheckCircle2, Play, Pause, RotateCcw, AlertTriangle, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../services/haptics';

interface Props {
  workouts: Workout[];
  onSaveWorkouts: (workouts: Workout[]) => void;
  activeUserId: string;
}

export const WorkoutsTab: React.FC<Props> = ({
  workouts,
  onSaveWorkouts,
  activeUserId,
}) => {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('Pecho');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartNewWorkout = (name: string) => {
    triggerHaptic('medium');
    const newW: Workout = {
      id: `w-${Date.now()}`,
      name: name || 'Entrenamiento de Fuerza',
      date: new Date().toISOString().split('T')[0],
      userId: activeUserId,
      durationMinutes: 0,
      isCompleted: false,
      exercises: [
        {
          id: `ex-${Date.now()}-1`,
          name: 'Press de Banca',
          muscleGroup: 'Pecho',
          sets: [
            { id: `s-${Date.now()}-1`, weight: 70, reps: 10, rpe: 8, isCompleted: false, date: new Date().toISOString() },
            { id: `s-${Date.now()}-2`, weight: 70, reps: 10, rpe: 8, isCompleted: false, date: new Date().toISOString() },
            { id: `s-${Date.now()}-3`, weight: 70, reps: 9, rpe: 8.5, isCompleted: false, date: new Date().toISOString() },
          ]
        }
      ]
    };
    setActiveWorkout(newW);
    setTimerSeconds(0);
    setTimerRunning(true);
    setIsCreatingWorkout(false);
  };

  const handleAddExercise = () => {
    if (!activeWorkout || !newExerciseName.trim()) return;
    triggerHaptic('light');
    const ex: Exercise = {
      id: `ex-${Date.now()}`,
      name: newExerciseName.trim(),
      muscleGroup: selectedMuscle,
      sets: [
        { id: `s-${Date.now()}-1`, weight: 40, reps: 10, rpe: 8, isCompleted: false, date: new Date().toISOString() },
        { id: `s-${Date.now()}-2`, weight: 40, reps: 10, rpe: 8, isCompleted: false, date: new Date().toISOString() },
      ]
    };
    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, ex]
    });
    setNewExerciseName('');
  };

  const handleAddSet = (exerciseId: string) => {
    if (!activeWorkout) return;
    triggerHaptic('light');
    const updatedExercises = activeWorkout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: WorkoutSet = {
          id: `s-${Date.now()}`,
          weight: lastSet ? lastSet.weight : 50,
          reps: lastSet ? lastSet.reps : 10,
          rpe: 8,
          isCompleted: false,
          date: new Date().toISOString()
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    });
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const handleUpdateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;
    const updatedExercises = activeWorkout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map(s => {
          if (s.id === setId) {
            return { ...s, ...updates };
          }
          return s;
        });
        return { ...ex, sets: updatedSets };
      }
      return ex;
    });
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    if (!activeWorkout) return;
    triggerHaptic('light');
    const updatedExercises = activeWorkout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    });
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (!activeWorkout) return;
    triggerHaptic('warning');
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const handleFinishWorkout = () => {
    if (!activeWorkout) return;
    triggerHaptic('success');
    
    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const finished: Workout = {
      ...activeWorkout,
      durationMinutes: Math.max(1, Math.round(timerSeconds / 60)),
      isCompleted: true
    };

    const existingIdx = workouts.findIndex(w => w.id === finished.id);
    let updated: Workout[];
    if (existingIdx >= 0) {
      updated = [...workouts];
      updated[existingIdx] = finished;
    } else {
      updated = [finished, ...workouts];
    }

    onSaveWorkouts(updated);
    setActiveWorkout(null);
    setTimerRunning(false);
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-blue-400" />
            Entrenamientos
          </h2>
          <p className="text-xs text-zinc-400">
            Registro con RPE, Sobrecarga Progresiva & Series Efectivas
          </p>
        </div>
        {!activeWorkout && (
          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsCreatingWorkout(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nuevo Entreno
          </button>
        )}
      </div>

      {/* Modal / Form para Crear Nuevo Entreno */}
      {isCreatingWorkout && !activeWorkout && (
        <div className="bg-[#1c1c1e] border border-blue-500/30 rounded-2xl p-4 space-y-3 animate-fadeIn">
          <h3 className="text-sm font-bold text-white">Nombre de la Rutina / Sesión</h3>
          <input
            type="text"
            placeholder="Ej: Empuje A (Pecho, Hombro, Tríceps)"
            value={newWorkoutTitle}
            onChange={(e) => setNewWorkoutTitle(e.target.value)}
            className="w-full bg-[#2c2c2e] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartNewWorkout(newWorkoutTitle)}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
            >
              Comenzar Sesión Ahora
            </button>
            <button
              onClick={() => setIsCreatingWorkout(false)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 font-bold rounded-xl text-xs transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* SESIÓN ACTIVA EN CURSO */}
      {activeWorkout && (
        <div className="bg-gradient-to-b from-[#242426] to-[#1c1c1e] border-2 border-blue-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                Sesión en Curso
              </span>
              <h3 className="text-lg font-black text-white mt-1">{activeWorkout.name}</h3>
            </div>

            {/* Cronómetro */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="font-mono text-sm font-bold text-blue-400">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="text-zinc-300 hover:text-white p-1"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="text-zinc-400 hover:text-white p-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lista de Ejercicios en Sesión Activa */}
          <div className="space-y-4">
            {activeWorkout.exercises.map((exercise) => {
              const shouldIncrease = TrainingEngine.shouldIncreaseWeight(exercise.sets);
              const isPlateau = TrainingEngine.detectPlateau(exercise.name, workouts);

              return (
                <div key={exercise.id} className="bg-[#18181a] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {exercise.name}
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">
                          {exercise.muscleGroup}
                        </span>
                      </h4>
                      {/* Badge Científico de Progresión */}
                      {shouldIncrease && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>¡Sobrecarga completada! Sube +2.5 kg en la próxima</span>
                        </div>
                      )}
                      {isPlateau && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Estancamiento detectado: varía repeticiones o aplica descarga</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tabla de Series */}
                  <div className="space-y-1.5 text-xs">
                    <div className="grid grid-cols-12 gap-2 text-zinc-400 font-bold px-1 text-[11px]">
                      <span className="col-span-2">Serie</span>
                      <span className="col-span-3">Peso (kg)</span>
                      <span className="col-span-3">Reps</span>
                      <span className="col-span-2">RPE</span>
                      <span className="col-span-2 text-right">Listo</span>
                    </div>

                    {exercise.sets.map((set, sIdx) => (
                      <div
                        key={set.id}
                        className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition ${
                          set.isCompleted ? 'bg-emerald-950/20 border border-emerald-500/20' : 'bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="col-span-2 font-mono font-bold text-zinc-400">#{sIdx + 1}</span>
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleUpdateSet(exercise.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                          className="col-span-3 bg-black/50 text-white font-mono px-2 py-1 rounded-lg border border-white/10 text-center"
                        />
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(exercise.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                          className="col-span-3 bg-black/50 text-white font-mono px-2 py-1 rounded-lg border border-white/10 text-center"
                        />
                        <select
                          value={set.rpe ?? 8}
                          onChange={(e) => handleUpdateSet(exercise.id, set.id, { rpe: parseFloat(e.target.value) })}
                          className="col-span-2 bg-black/50 text-white font-mono px-1 py-1 rounded-lg border border-white/10 text-center"
                        >
                          {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(val => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              triggerHaptic('light');
                              handleUpdateSet(exercise.id, set.id, { isCompleted: !set.isCompleted });
                            }}
                            className={`p-1.5 rounded-lg transition ${
                              set.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSet(exercise.id, set.id)}
                            className="text-zinc-600 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddSet(exercise.id)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir Serie
                  </button>
                </div>
              );
            })}
          </div>

          {/* Form para añadir ejercicio */}
          <div className="bg-black/30 p-3 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[11px] font-bold text-zinc-400">Añadir Ejercicio a la Sesión</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre (ej: Fondos en paralelas)"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                className="flex-1 bg-black/60 text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
              />
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value as MuscleGroup)}
                className="bg-black/60 text-white text-xs px-2 py-2 rounded-xl border border-white/10"
              >
                {ALL_MUSCLE_GROUPS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <button
                onClick={handleAddExercise}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Botones de Finalización */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleFinishWorkout}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black rounded-2xl text-sm transition shadow-lg shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Finalizar & Guardar Entreno
            </button>
            <button
              onClick={() => {
                if (confirm('¿Descartar este entrenamiento?')) {
                  setActiveWorkout(null);
                  setTimerRunning(false);
                }
              }}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 font-semibold rounded-2xl text-xs transition"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Historial de Entrenamientos Guardados */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
          Historial de Sesiones ({workouts.length})
        </h3>

        {workouts.map((workout) => {
          const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
          const totalVolume = workout.exercises.reduce((sum, ex) => 
            sum + ex.sets.reduce((sSum, s) => sSum + (s.weight * s.reps), 0), 0);

          return (
            <div key={workout.id} className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{workout.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{workout.date}</span>
                    <span>•</span>
                    <span>{workout.durationMinutes || 60} min</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-blue-400">{totalSets} series</span>
                  <span className="block text-[10px] text-zinc-400 font-mono">{Math.round(totalVolume)} kg vol</span>
                </div>
              </div>

              {/* Ejercicios resumidos */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {workout.exercises.map(ex => (
                  <span key={ex.id} className="text-[11px] px-2 py-0.5 bg-white/5 text-zinc-300 rounded-md">
                    {ex.name} ({ex.sets.length}x)
                  </span>
                ))}
              </div>

              {workout.notes && (
                <p className="text-xs text-zinc-400 italic pt-1 border-t border-white/5">
                  "{workout.notes}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

