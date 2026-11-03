import { UserProfile, NutritionLog } from '../types';
import { NutritionEngine } from './nutritionEngine';

export class ScoreEngine {
  /**
   * Puntuación Diaria Científica (0 - 100)
   * - Nutrición: Hasta 50 pts (25 pts calorías exactas + 25 pts proteína cumplida)
   * - Descanso: Hasta 30 pts (sueño respecto a meta personalizada)
   * - Entrenamiento: Hasta 20 pts (sesión ejecutada)
   */
  static calculateDailyScore(log: NutritionLog | undefined, user: UserProfile, workoutDone: boolean): {
    total: number;
    nutritionScore: number;
    sleepScore: number;
    workoutScore: number;
  } {
    if (!log) {
      return {
        total: workoutDone ? 20 : 0,
        nutritionScore: 0,
        sleepScore: 0,
        workoutScore: workoutDone ? 20 : 0
      };
    }

    const targets = NutritionEngine.calculateTargetMacros(user);
    
    // Calorías: Desviación porcentual
    const calDiff = Math.abs(log.calories - targets.calories);
    const calAccuracy = Math.max(0, 1.0 - (calDiff / targets.calories));
    const calPoints = Math.round(calAccuracy * 25);

    // Proteína: Adherencia
    const proteinRatio = targets.protein > 0 ? (log.protein / targets.protein) : 1;
    const proteinAccuracy = proteinRatio >= 1.0 ? 1.0 : proteinRatio;
    const proteinPoints = Math.round(proteinAccuracy * 25);

    const nutritionScore = calPoints + proteinPoints;

    // Sueño: Proporción contra meta personal (default 8h)
    const sleepGoal = user.sleepHoursGoal || 8;
    const sleepRatio = Math.min(1.0, (log.sleepHours || 0) / sleepGoal);
    const sleepScore = Math.round(sleepRatio * 30);

    // Entrenamiento
    const workoutScore = workoutDone ? 20 : 0;

    const total = Math.min(100, Math.max(0, nutritionScore + sleepScore + workoutScore));

    return { total, nutritionScore, sleepScore, workoutScore };
  }
}

