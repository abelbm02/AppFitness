export type BiologicalSex = 'male' | 'female';

export type FitnessGoal = 'fatLoss' | 'muscleGain' | 'recomp' | 'performance';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export type MuscleGroup = 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Core';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  sex: BiologicalSex;
  goal: FitnessGoal;
  level: FitnessLevel;
  activityLevel: ActivityLevel;
  sleepHoursGoal: number;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  rpe?: number; // 1-10
  isCompleted: boolean;
  date: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO string YYYY-MM-DD
  userId?: string;
  durationMinutes?: number;
  isCompleted: boolean;
  exercises: Exercise[];
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion: string;
  mealType: 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack';
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sleepHours: number;
  waterLiters: number;
  foods: FoodItem[];
}

export interface PlannedDay {
  dayName: string; // 'Lunes', 'Martes', etc.
  routineName: string;
  focusMuscles: MuscleGroup[];
  isRestDay: boolean;
  calorieTargetDesc: string;
  completed: boolean;
}

export interface NutritionMacros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

