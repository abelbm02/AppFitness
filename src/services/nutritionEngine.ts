import { UserProfile, NutritionMacros, NutritionLog, ActivityLevel } from '../types';

export const ACTIVITY_FACTORS: Record<ActivityLevel, { factor: number; label: string }> = {
  sedentary: { factor: 1.2, label: 'Sedentario (poco o nada de ejercicio)' },
  light: { factor: 1.375, label: 'Ligero (ejercicio 1-3 días/sem)' },
  moderate: { factor: 1.55, label: 'Moderado (ejercicio 3-5 días/sem)' },
  active: { factor: 1.725, label: 'Activo (ejercicio 6-7 días/sem)' },
  veryActive: { factor: 1.9, label: 'Muy Activo (trabajo físico o 2x entreno)' },
};

export const GOAL_CONFIG = {
  fatLoss: { deficit: 0.20, label: 'Perder Grasa (-20% déficit)', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  muscleGain: { deficit: -0.10, label: 'Ganar Músculo (+10% superávit)', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  recomp: { deficit: 0.0, label: 'Recomposición (Mantenimiento)', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  performance: { deficit: -0.05, label: 'Rendimiento (+5% ligero)', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

export class NutritionEngine {
  /**
   * Cálculo de Tasa Metabólica Basal mediante fórmula Mifflin-St Jeor
   */
  static calculateBMR(user: UserProfile): number {
    const weightFactor = 10 * user.weight;
    const heightFactor = 6.25 * user.height;
    const ageFactor = 5 * user.age;
    
    if (user.sex === 'male') {
      return weightFactor + heightFactor - ageFactor + 5;
    } else {
      return weightFactor + heightFactor - ageFactor - 161;
    }
  }

  /**
   * Gasto Energético Total Diario (TDEE)
   */
  static calculateTDEE(user: UserProfile): number {
    const bmr = this.calculateBMR(user);
    const factor = ACTIVITY_FACTORS[user.activityLevel]?.factor ?? 1.55;
    return Math.round(bmr * factor);
  }

  /**
   * Distribución de macronutrientes basada en evidencia científica:
   * - Proteína: 2.0 g/kg (rango 1.6 - 2.2 g/kg)
   * - Grasas: ~25% de las calorías totales
   * - Carbohidratos: el resto calórico
   */
  static calculateTargetMacros(user: UserProfile): NutritionMacros {
    const tdee = this.calculateTDEE(user);
    const deficitPercentage = GOAL_CONFIG[user.goal]?.deficit ?? 0;
    const targetCalories = Math.round(tdee * (1.0 - deficitPercentage));

    const targetProtein = Math.round(user.weight * 2.0);
    const targetFats = Math.round((targetCalories * 0.25) / 9.0);
    
    const proteinCalories = targetProtein * 4;
    const fatCalories = targetFats * 9;
    const remainingCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const targetCarbs = Math.round(remainingCalories / 4.0);

    return {
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fats: targetFats,
    };
  }

  /**
   * Feedback nutricional inteligente en tiempo real
   */
  static getNutritionFeedback(user: UserProfile, currentLog?: NutritionLog): string {
    if (!currentLog) return "Registra tus comidas de hoy para obtener análisis metabólico.";
    
    const targets = this.calculateTargetMacros(user);
    const proteinDeficit = targets.protein - currentLog.protein;
    const calorieDiff = currentLog.calories - targets.calories;

    if (proteinDeficit > 25) {
      return `Te faltan ${Math.round(proteinDeficit)}g de proteína para llegar a tu umbral anabólico óptimo (2g/kg). Considera pechuga de pollo, claras, o batido whey.`;
    }

    if (user.goal === 'fatLoss') {
      if (calorieDiff > 250) {
        return `Has superado tus calorías meta por +${Math.round(calorieDiff)} kcal. Ajusta tus raciones en la siguiente comida para mantener el déficit.`;
      }
      if (calorieDiff >= -150 && calorieDiff <= 150 && proteinDeficit <= 10) {
        return `¡Déficit y proteína impecables! Estás maximizando la oxidación de grasa y preservando masa muscular.`;
      }
    }

    if (user.goal === 'muscleGain') {
      if (calorieDiff < -400) {
        return `Estás en déficit (${Math.round(currentLog.calories)} kcal). Para maximizar hipertrofia necesitas un superávit de ~${targets.calories} kcal.`;
      }
      if (proteinDeficit <= 10) {
        return `Superávit y síntesis de proteína óptimos para generar nuevo tejido muscular.`;
      }
    }

    return "¡Buen trabajo! Estás en el rango ideal de macros y calorías para tu objetivo.";
  }
}

