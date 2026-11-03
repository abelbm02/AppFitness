import { MuscleGroup, Workout, WorkoutSet } from '../types';

export const ALL_MUSCLE_GROUPS: MuscleGroup[] = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

export class TrainingEngine {
  /**
   * Fórmula de Epley para estimar 1RM (1 Repetition Maximum)
   */
  static estimate1RM(weight: number, reps: number): number {
    if (reps === 1) return weight;
    if (reps <= 0 || weight <= 0) return 0;
    return Math.round(weight * (1 + reps / 30));
  }

  /**
   * Detección de sobrecarga progresiva: si las últimas 3 series se completaron con éxito
   */
  static shouldIncreaseWeight(history: WorkoutSet[]): boolean {
    if (history.length < 3) return false;
    const lastThree = history.slice(-3);
    return lastThree.every(set => set.isCompleted && set.reps >= 8);
  }

  /**
   * Detección de estancamiento (Plateau): si el volumen total en 3 sesiones no progresa
   */
  static detectPlateau(exerciseName: string, workouts: Workout[]): boolean {
    const exerciseSets: WorkoutSet[] = [];
    
    // Ordenar de más reciente a más antiguo
    const sorted = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const workout of sorted) {
      for (const ex of workout.exercises) {
        if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
          exerciseSets.push(...ex.sets);
        }
      }
    }

    if (exerciseSets.length < 9) return false;

    const calcVolume = (sets: WorkoutSet[]) => 
      sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);

    const last3 = calcVolume(exerciseSets.slice(0, 3));
    const middle3 = calcVolume(exerciseSets.slice(3, 6));
    const prior3 = calcVolume(exerciseSets.slice(6, 9));

    return last3 <= middle3 && middle3 <= prior3 && last3 > 0;
  }

  /**
   * Calcula el volumen semanal efectivo (series completadas en los últimos 7 días)
   */
  static calculateWeeklyVolume(workouts: Workout[]): Record<MuscleGroup, number> {
    const volumes: Record<MuscleGroup, number> = {
      Pecho: 0,
      Espalda: 0,
      Piernas: 0,
      Hombros: 0,
      Brazos: 0,
      Core: 0
    };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo);

    for (const workout of recentWorkouts) {
      for (const exercise of workout.exercises) {
        const completedSets = exercise.sets.filter(s => s.isCompleted).length;
        if (volumes[exercise.muscleGroup] !== undefined) {
          volumes[exercise.muscleGroup] += completedSets;
        }
      }
    }

    return volumes;
  }

  /**
   * Recomendaciones de volumen basadas en literatura de hipertrofia (Schoenfeld et al: 10-20 series/sem)
   */
  static getVolumeRecommendation(currentVolume: Record<MuscleGroup, number>): {
    summary: string;
    lowMuscles: MuscleGroup[];
    highMuscles: MuscleGroup[];
    optimalMuscles: MuscleGroup[];
  } {
    const lowMuscles: MuscleGroup[] = [];
    const highMuscles: MuscleGroup[] = [];
    const optimalMuscles: MuscleGroup[] = [];

    for (const muscle of ALL_MUSCLE_GROUPS) {
      const vol = currentVolume[muscle] ?? 0;
      if (vol < 10) {
        lowMuscles.push(muscle);
      } else if (vol > 20) {
        highMuscles.push(muscle);
      } else {
        optimalMuscles.push(muscle);
      }
    }

    let summary = "Tu volumen semanal está en el rango óptimo de hipertrofia.";
    if (lowMuscles.length > 0) {
      summary = `Volumen subóptimo (<10 series) en: ${lowMuscles.slice(0, 2).join(', ')}. Añade series para maximizar estímulo.`;
    } else if (highMuscles.length > 0) {
      summary = `Volumen muy alto (>20 series) en: ${highMuscles.slice(0, 2).join(', ')}. Cuidado con la fatiga acumulada.`;
    }

    return { summary, lowMuscles, highMuscles, optimalMuscles };
  }
}
