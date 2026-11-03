import { UserProfile, Workout, NutritionLog, PlannedDay, FoodItem } from '../types';

const USERS_KEY = 'fitscience_users';
const ACTIVE_USER_ID_KEY = 'fitscience_active_user_id';
const WORKOUTS_KEY = 'fitscience_workouts';
const LOGS_KEY = 'fitscience_nutrition_logs';
const PLANNING_KEY = 'fitscience_weekly_planning';

export const COMMON_FOODS: Omit<FoodItem, 'id' | 'mealType'>[] = [
  { name: 'Pechuga de Pollo (plancha)', calories: 165, protein: 31, carbs: 0, fats: 3.6, portion: '100g' },
  { name: 'Arroz blanco cocido', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, portion: '100g' },
  { name: 'Huevos enteros (2 grandes)', calories: 144, protein: 12.6, carbs: 0.8, fats: 9.8, portion: '120g' },
  { name: 'Avena en copos', calories: 190, protein: 6.5, carbs: 34, fats: 3.5, portion: '50g' },
  { name: 'Batido Proteína Whey (1 cazo)', calories: 120, protein: 24, carbs: 2.5, fats: 1.5, portion: '30g' },
  { name: 'Yogur Griego Natural 0%', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, portion: '100g' },
  { name: 'Plátano mediano', calories: 105, protein: 1.3, carbs: 27, fats: 0.3, portion: '1 unidad' },
  { name: 'Atún al natural (1 lata escurrida)', calories: 80, protein: 18, carbs: 0, fats: 0.8, portion: '80g' },
  { name: 'Aceite de Oliva Virgen Extra (1 cda)', calories: 119, protein: 0, carbs: 0, fats: 13.5, portion: '15ml' },
  { name: 'Salmón fresco a la plancha', calories: 208, protein: 20, carbs: 0, fats: 13, portion: '100g' },
  { name: 'Patata cocida / asada', calories: 87, protein: 2, carbs: 20, fats: 0.1, portion: '100g' },
  { name: 'Frutos secos / Nueces', calories: 185, protein: 4.3, carbs: 3.9, fats: 18.5, portion: '30g' },
  { name: 'Ternera magra', calories: 155, protein: 26, carbs: 0, fats: 5.5, portion: '100g' }
];

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-abel-001',
    name: 'Abel',
    age: 26,
    weight: 76.5,
    height: 178,
    sex: 'male',
    goal: 'muscleGain',
    level: 'intermediate',
    activityLevel: 'active',
    sleepHoursGoal: 8.0
  },
  {
    id: 'user-guest-002',
    name: 'Laura (Pareja / Demo)',
    age: 25,
    weight: 60.0,
    height: 165,
    sex: 'female',
    goal: 'fatLoss',
    level: 'beginner',
    activityLevel: 'moderate',
    sleepHoursGoal: 8.5
  }
];

export const DEFAULT_PLANNING: PlannedDay[] = [
  { dayName: 'Lunes', routineName: 'Torso: Empuje Pesado', focusMuscles: ['Pecho', 'Hombros', 'Brazos'], isRestDay: false, calorieTargetDesc: 'Superávit alto (+300 kcal)', completed: true },
  { dayName: 'Martes', routineName: 'Torso: Tracción & Espalda', focusMuscles: ['Espalda', 'Brazos'], isRestDay: false, calorieTargetDesc: 'Superávit estándar (+250 kcal)', completed: true },
  { dayName: 'Miércoles', routineName: 'Descanso Activo / Cardio', focusMuscles: ['Core'], isRestDay: true, calorieTargetDesc: 'Mantenimiento (isocalórico)', completed: false },
  { dayName: 'Jueves', routineName: 'Piernas Enfocada en Cuádriceps', focusMuscles: ['Piernas', 'Core'], isRestDay: false, calorieTargetDesc: 'Superávit alto (+350 kcal)', completed: false },
  { dayName: 'Viernes', routineName: 'Torso Hipertrofia & Brazos', focusMuscles: ['Pecho', 'Espalda', 'Brazos'], isRestDay: false, calorieTargetDesc: 'Superávit estándar (+250 kcal)', completed: false },
  { dayName: 'Sábado', routineName: 'Pierna Posterior & Glúteo', focusMuscles: ['Piernas'], isRestDay: false, calorieTargetDesc: 'Superávit alto (+300 kcal)', completed: false },
  { dayName: 'Domingo', routineName: 'Recuperación Total & Saunas', focusMuscles: [], isRestDay: true, calorieTargetDesc: 'Mantenimiento / Recarga limpia', completed: false },
];

export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: 'w-today',
    name: 'Torso: Empuje & Hombro (Fuerza)',
    date: new Date().toISOString().split('T')[0],
    userId: 'user-abel-001',
    durationMinutes: 65,
    isCompleted: true,
    notes: 'Sensaciones excelentes. Subida de 2.5kg en Press Banca con RPE 8.',
    exercises: [
      {
        id: 'ex-1',
        name: 'Press de Banca con Barra',
        muscleGroup: 'Pecho',
        sets: [
          { id: 's1', weight: 85, reps: 8, rpe: 8, isCompleted: true, date: new Date().toISOString() },
          { id: 's2', weight: 85, reps: 8, rpe: 8.5, isCompleted: true, date: new Date().toISOString() },
          { id: 's3', weight: 85, reps: 7, rpe: 9, isCompleted: true, date: new Date().toISOString() },
          { id: 's4', weight: 80, reps: 9, rpe: 9, isCompleted: true, date: new Date().toISOString() }
        ]
      },
      {
        id: 'ex-2',
        name: 'Press Militar con Mancuernas',
        muscleGroup: 'Hombros',
        sets: [
          { id: 's5', weight: 26, reps: 10, rpe: 8, isCompleted: true, date: new Date().toISOString() },
          { id: 's6', weight: 26, reps: 9, rpe: 8.5, isCompleted: true, date: new Date().toISOString() },
          { id: 's7', weight: 24, reps: 10, rpe: 9, isCompleted: true, date: new Date().toISOString() }
        ]
      },
      {
        id: 'ex-3',
        name: 'Fondos en Paralelas (Lastrados)',
        muscleGroup: 'Pecho',
        sets: [
          { id: 's8', weight: 15, reps: 10, rpe: 8, isCompleted: true, date: new Date().toISOString() },
          { id: 's9', weight: 15, reps: 9, rpe: 8.5, isCompleted: true, date: new Date().toISOString() },
          { id: 's10', weight: 15, reps: 8, rpe: 9, isCompleted: true, date: new Date().toISOString() }
        ]
      },
      {
        id: 'ex-4',
        name: 'Extensiones de Tríceps en Polea',
        muscleGroup: 'Brazos',
        sets: [
          { id: 's11', weight: 35, reps: 12, rpe: 8.5, isCompleted: true, date: new Date().toISOString() },
          { id: 's12', weight: 35, reps: 11, rpe: 9, isCompleted: true, date: new Date().toISOString() },
          { id: 's13', weight: 30, reps: 13, rpe: 9.5, isCompleted: true, date: new Date().toISOString() }
        ]
      }
    ]
  },
  {
    id: 'w-yesterday',
    name: 'Espalda & Tracción (Sobrecarga)',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    userId: 'user-abel-001',
    durationMinutes: 70,
    isCompleted: true,
    notes: 'Dominadas con peso y remo barra pesado.',
    exercises: [
      {
        id: 'ex-5',
        name: 'Dominadas Pronas Lastradas',
        muscleGroup: 'Espalda',
        sets: [
          { id: 's14', weight: 12, reps: 8, rpe: 8, isCompleted: true, date: new Date().toISOString() },
          { id: 's15', weight: 12, reps: 7, rpe: 8.5, isCompleted: true, date: new Date().toISOString() },
          { id: 's16', weight: 12, reps: 7, rpe: 9, isCompleted: true, date: new Date().toISOString() }
        ]
      },
      {
        id: 'ex-6',
        name: 'Remo con Barra 90º',
        muscleGroup: 'Espalda',
        sets: [
          { id: 's17', weight: 80, reps: 8, rpe: 8, isCompleted: true, date: new Date().toISOString() },
          { id: 's18', weight: 80, reps: 8, rpe: 8.5, isCompleted: true, date: new Date().toISOString() },
          { id: 's19', weight: 80, reps: 8, rpe: 9, isCompleted: true, date: new Date().toISOString() }
        ]
      },
      {
        id: 'ex-7',
        name: 'Curl Bíceps con Barra Z',
        muscleGroup: 'Brazos',
        sets: [
          { id: 's20', weight: 35, reps: 10, rpe: 8, isCompleted: true, date: new Date().toISOString() },
          { id: 's21', weight: 35, reps: 9, rpe: 8.5, isCompleted: true, date: new Date().toISOString() },
          { id: 's22', weight: 30, reps: 12, rpe: 9, isCompleted: true, date: new Date().toISOString() }
        ]
      }
    ]
  }
];

export const DEFAULT_LOGS: NutritionLog[] = [
  {
    id: 'log-today',
    userId: 'user-abel-001',
    date: new Date().toISOString().split('T')[0],
    calories: 2750,
    protein: 165,
    carbs: 320,
    fats: 72,
    sleepHours: 8.2,
    waterLiters: 3.0,
    foods: [
      { id: 'f1', name: 'Avena con Proteína y Plátano', calories: 415, protein: 32, carbs: 63, fats: 5, portion: '1 bol', mealType: 'desayuno' },
      { id: 'f2', name: 'Arroz blanco con 200g Pechuga y AOVE', calories: 580, protein: 65, carbs: 56, fats: 11, portion: 'Plato principal', mealType: 'almuerzo' },
      { id: 'f3', name: 'Yogur Griego con Nueces y Miel', calories: 280, protein: 16, carbs: 18, fats: 15, portion: 'Merienda', mealType: 'merienda' },
      { id: 'f4', name: 'Salmón al horno con Patatas asadas', calories: 620, protein: 42, carbs: 45, fats: 26, portion: 'Cena', mealType: 'cena' },
    ]
  },
  {
    id: 'log-yesterday',
    userId: 'user-abel-001',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    calories: 2690,
    protein: 160,
    carbs: 310,
    fats: 68,
    sleepHours: 7.8,
    waterLiters: 2.8,
    foods: []
  },
  {
    id: 'log-d2',
    userId: 'user-abel-001',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    calories: 2720,
    protein: 158,
    carbs: 315,
    fats: 70,
    sleepHours: 8.0,
    waterLiters: 3.2,
    foods: []
  },
  {
    id: 'log-d3',
    userId: 'user-abel-001',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    calories: 2650,
    protein: 154,
    carbs: 300,
    fats: 69,
    sleepHours: 7.5,
    waterLiters: 2.7,
    foods: []
  },
  {
    id: 'log-d4',
    userId: 'user-abel-001',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    calories: 2800,
    protein: 168,
    carbs: 330,
    fats: 74,
    sleepHours: 8.5,
    waterLiters: 3.5,
    foods: []
  }
];

export class StorageService {
  static getUsers(): UserProfile[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      this.saveUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  }

  static saveUsers(users: UserProfile[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getActiveUserId(): string {
    const active = localStorage.getItem(ACTIVE_USER_ID_KEY);
    if (active) return active;
    const users = this.getUsers();
    const id = users[0]?.id || 'user-abel-001';
    this.setActiveUserId(id);
    return id;
  }

  static setActiveUserId(id: string) {
    localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  }

  static getWorkouts(): Workout[] {
    const raw = localStorage.getItem(WORKOUTS_KEY);
    if (!raw) {
      this.saveWorkouts(DEFAULT_WORKOUTS);
      return DEFAULT_WORKOUTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_WORKOUTS;
    }
  }

  static saveWorkouts(workouts: Workout[]) {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  }

  static getNutritionLogs(): NutritionLog[] {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      this.saveNutritionLogs(DEFAULT_LOGS);
      return DEFAULT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_LOGS;
    }
  }

  static saveNutritionLogs(logs: NutritionLog[]) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }

  static getPlanning(): PlannedDay[] {
    const raw = localStorage.getItem(PLANNING_KEY);
    if (!raw) {
      this.savePlanning(DEFAULT_PLANNING);
      return DEFAULT_PLANNING;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PLANNING;
    }
  }

  static savePlanning(plan: PlannedDay[]) {
    localStorage.setItem(PLANNING_KEY, JSON.stringify(plan));
  }

  static exportBackup(): string {
    const data = {
      users: this.getUsers(),
      activeUserId: this.getActiveUserId(),
      workouts: this.getWorkouts(),
      logs: this.getNutritionLogs(),
      planning: this.getPlanning(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.users && Array.isArray(data.users)) this.saveUsers(data.users);
      if (data.activeUserId) this.setActiveUserId(data.activeUserId);
      if (data.workouts && Array.isArray(data.workouts)) this.saveWorkouts(data.workouts);
      if (data.logs && Array.isArray(data.logs)) this.saveNutritionLogs(data.logs);
      if (data.planning && Array.isArray(data.planning)) this.savePlanning(data.planning);
      return true;
    } catch {
      return false;
    }
  }
}
