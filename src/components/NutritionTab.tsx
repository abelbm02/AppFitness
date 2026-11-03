import React, { useState } from 'react';
import { UserProfile, NutritionLog, FoodItem } from '../types';
import { NutritionEngine } from '../services/nutritionEngine';
import { COMMON_FOODS } from '../services/storage';
import { Utensils, Plus, Trash2, Moon, Droplets, ChevronDown, Check, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../services/haptics';

interface Props {
  user: UserProfile;
  todayLog?: NutritionLog;
  onSaveLog: (log: NutritionLog) => void;
}

export const NutritionTab: React.FC<Props> = ({
  user,
  todayLog,
  onSaveLog,
}) => {
  const targetMacros = NutritionEngine.calculateTargetMacros(user);
  const [selectedMeal, setSelectedMeal] = useState<FoodItem['mealType']>('almuerzo');
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Custom Food Form State
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');
  const [customPortion, setCustomPortion] = useState('100g');

  // Create current log if missing
  const currentLog: NutritionLog = todayLog || {
    id: `log-${Date.now()}`,
    userId: user.id,
    date: new Date().toISOString().split('T')[0],
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    sleepHours: 8,
    waterLiters: 2.5,
    foods: []
  };

  const recalculateAndSave = (foods: FoodItem[], extra?: Partial<NutritionLog>) => {
    const totalCals = foods.reduce((sum, f) => sum + f.calories, 0);
    const totalProt = foods.reduce((sum, f) => sum + f.protein, 0);
    const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
    const totalFats = foods.reduce((sum, f) => sum + f.fats, 0);

    const updated: NutritionLog = {
      ...currentLog,
      calories: totalCals,
      protein: totalProt,
      carbs: totalCarbs,
      fats: totalFats,
      foods,
      ...extra
    };
    onSaveLog(updated);
  };

  const handleAddPresetFood = (preset: typeof COMMON_FOODS[0]) => {
    triggerHaptic('light');
    const newFood: FoodItem = {
      id: `food-${Date.now()}`,
      name: preset.name,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fats: preset.fats,
      portion: preset.portion,
      mealType: selectedMeal
    };
    const updatedFoods = [...(currentLog.foods || []), newFood];
    recalculateAndSave(updatedFoods);
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    triggerHaptic('light');

    const newFood: FoodItem = {
      id: `food-${Date.now()}`,
      name: customName.trim(),
      calories: parseFloat(customCalories) || 0,
      protein: parseFloat(customProtein) || 0,
      carbs: parseFloat(customCarbs) || 0,
      fats: parseFloat(customFats) || 0,
      portion: customPortion || '1 ración',
      mealType: selectedMeal
    };

    const updatedFoods = [...(currentLog.foods || []), newFood];
    recalculateAndSave(updatedFoods);

    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFats('');
    setShowAddCustom(false);
  };

  const handleDeleteFood = (foodId: string) => {
    triggerHaptic('light');
    const updatedFoods = (currentLog.foods || []).filter(f => f.id !== foodId);
    recalculateAndSave(updatedFoods);
  };

  const handleSleepChange = (hours: number) => {
    const updated: NutritionLog = {
      ...currentLog,
      sleepHours: hours
    };
    onSaveLog(updated);
  };

  const handleWaterClick = (liters: number) => {
    triggerHaptic('light');
    const updated: NutritionLog = {
      ...currentLog,
      waterLiters: Math.max(0, Math.round((currentLog.waterLiters + liters) * 10) / 10)
    };
    onSaveLog(updated);
  };

  const mealTypes: { id: FoodItem['mealType']; label: string; emoji: string }[] = [
    { id: 'desayuno', label: 'Desayuno', emoji: '🍳' },
    { id: 'almuerzo', label: 'Almuerzo', emoji: '🍗' },
    { id: 'merienda', label: 'Merienda', emoji: '🥪' },
    { id: 'cena', label: 'Cena', emoji: '🥗' },
    { id: 'snack', label: 'Snack / Batido', emoji: '🥤' }
  ];

  const calRemaining = targetMacros.calories - currentLog.calories;
  const protRemaining = targetMacros.protein - currentLog.protein;

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-400" />
            Nutrición & Hábitos
          </h2>
          <p className="text-xs text-zinc-400">
            Base científica: <strong>{targetMacros.calories} kcal</strong> • <strong>{targetMacros.protein}g</strong> Proteína
          </p>
        </div>
      </div>

      {/* Balance Diario de Macros */}
      <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400">Consumidas hoy</span>
            <div className="text-3xl font-black text-white">
              {Math.round(currentLog.calories)}
              <span className="text-sm text-zinc-400 font-normal"> / {targetMacros.calories} kcal</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400">Restante</span>
            <div className={`text-xl font-bold font-mono ${calRemaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {calRemaining >= 0 ? `${Math.round(calRemaining)} kcal` : `+${Math.abs(Math.round(calRemaining))} exceso`}
            </div>
          </div>
        </div>

        {/* Barras de progreso de macros */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Proteína */}
          <div className="bg-black/30 p-3 rounded-2xl border border-red-500/10">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-red-400">Proteína</span>
              <span className="font-mono text-zinc-300">{Math.round(currentLog.protein)}/{targetMacros.protein}g</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentLog.protein / targetMacros.protein) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">
              {protRemaining > 0 ? `Faltan ${Math.round(protRemaining)}g` : 'Meta cumplida 🎉'}
            </span>
          </div>

          {/* Carbohidratos */}
          <div className="bg-black/30 p-3 rounded-2xl border border-blue-500/10">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-blue-400">Carbs</span>
              <span className="font-mono text-zinc-300">{Math.round(currentLog.carbs)}/{targetMacros.carbs}g</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentLog.carbs / targetMacros.carbs) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">Energía glucógeno</span>
          </div>

          {/* Grasas */}
          <div className="bg-black/30 p-3 rounded-2xl border border-yellow-500/10">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-yellow-400">Grasas</span>
              <span className="font-mono text-zinc-300">{Math.round(currentLog.fats)}/{targetMacros.fats}g</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentLog.fats / targetMacros.fats) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">Salud hormonal</span>
          </div>
        </div>
      </div>

      {/* Selector de Comida Activa (Píldoras) */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Añadir a:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {mealTypes.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMeal(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
                selectedMeal === m.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[#1c1c1e] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alimentos Rápidos de 1 Clic */}
      <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Alimentos Frecuentes (1 Clic)
          </span>
          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Crear Personalizado
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COMMON_FOODS.slice(0, 6).map((food) => (
            <button
              key={food.name}
              onClick={() => handleAddPresetFood(food)}
              className="text-left bg-black/40 hover:bg-black/60 p-2.5 rounded-xl border border-white/5 transition active:scale-95 group"
            >
              <div className="text-xs font-bold text-zinc-200 group-hover:text-blue-400 truncate">
                {food.name}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1">
                <span className="text-orange-400 font-mono">{food.calories} kcal</span>
                <span className="text-red-400 font-mono">{food.protein}g P</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Formulario de Comida Personalizada (Modal / Desplegable) */}
      {showAddCustom && (
        <form onSubmit={handleAddCustomFood} className="bg-[#1c1c1e] border border-blue-500/30 rounded-2xl p-4 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Añadir Alimento Personalizado</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nombre (ej: Tortilla de 3 claras)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="col-span-2 bg-[#2c2c2e] text-white text-xs px-3 py-2 rounded-xl border border-white/10"
              required
            />
            <input
              type="number"
              placeholder="Calorías (kcal)"
              value={customCalories}
              onChange={(e) => setCustomCalories(e.target.value)}
              className="bg-[#2c2c2e] text-white text-xs px-3 py-2 rounded-xl border border-white/10"
              required
            />
            <input
              type="number"
              placeholder="Proteína (g)"
              value={customProtein}
              onChange={(e) => setCustomProtein(e.target.value)}
              className="bg-[#2c2c2e] text-white text-xs px-3 py-2 rounded-xl border border-white/10"
              required
            />
            <input
              type="number"
              placeholder="Carbohidratos (g)"
              value={customCarbs}
              onChange={(e) => setCustomCarbs(e.target.value)}
              className="bg-[#2c2c2e] text-white text-xs px-3 py-2 rounded-xl border border-white/10"
            />
            <input
              type="number"
              placeholder="Grasas (g)"
              value={customFats}
              onChange={(e) => setCustomFats(e.target.value)}
              className="bg-[#2c2c2e] text-white text-xs px-3 py-2 rounded-xl border border-white/10"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
            >
              Guardar y Añadir a {selectedMeal}
            </button>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 font-bold rounded-xl text-xs transition"
            >
              Cerrar
            </button>
          </div>
        </form>
      )}

      {/* Desglose de Comidas del Día */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Comidas Registradas Hoy ({currentLog.foods?.length || 0})
        </h3>

        {mealTypes.map(m => {
          const mealFoods = (currentLog.foods || []).filter(f => f.mealType === m.id);
          const mealCals = mealFoods.reduce((sum, f) => sum + f.calories, 0);
          const mealProt = mealFoods.reduce((sum, f) => sum + f.protein, 0);

          return (
            <div key={m.id} className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span>{m.emoji}</span>
                  <h4 className="text-sm font-bold text-white capitalize">{m.label}</h4>
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  <span className="text-orange-400 font-bold">{Math.round(mealCals)} kcal</span> • <span className="text-red-400 font-bold">{Math.round(mealProt)}g P</span>
                </div>
              </div>

              {mealFoods.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-1">Sin alimentos registrados</p>
              ) : (
                <div className="space-y-1.5 pt-1">
                  {mealFoods.map(food => (
                    <div key={food.id} className="flex items-center justify-between py-1 px-2 rounded-lg bg-black/20 text-xs">
                      <div>
                        <span className="font-medium text-zinc-200">{food.name}</span>
                        <span className="text-[10px] text-zinc-500 ml-2 font-mono">({food.portion})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-orange-400 text-[11px]">{food.calories} kcal</span>
                        <span className="font-mono text-red-400 text-[11px]">{food.protein}g P</span>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="text-zinc-600 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hábitos: Sueño e Hidratación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tracker de Sueño */}
        <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-purple-400" />
              Horas de Sueño
            </span>
            <span className="text-sm font-bold font-mono text-purple-400">{currentLog.sleepHours || 8}h</span>
          </div>
          <input
            type="range"
            min="4"
            max="12"
            step="0.5"
            value={currentLog.sleepHours || 8}
            onChange={(e) => handleSleepChange(parseFloat(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <span className="text-[10px] text-zinc-500 block">
            Meta personal: {user.sleepHoursGoal}h para óptima recuperación del SNC
          </span>
        </div>

        {/* Tracker de Agua */}
        <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Hidratación Diaria
            </span>
            <span className="text-sm font-bold font-mono text-cyan-400">{currentLog.waterLiters || 2.5}L</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleWaterClick(0.25)}
              className="flex-1 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/20 text-cyan-300 rounded-xl text-xs font-bold transition"
            >
              +250ml
            </button>
            <button
              onClick={() => handleWaterClick(0.5)}
              className="flex-1 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/20 text-cyan-300 rounded-xl text-xs font-bold transition"
            >
              +500ml
            </button>
            <button
              onClick={() => handleWaterClick(-0.25)}
              className="px-2.5 py-1.5 bg-white/5 text-zinc-400 hover:text-white rounded-xl text-xs font-bold"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
