import React, { useState } from 'react';
import { UserProfile, FitnessGoal, BiologicalSex, FitnessLevel, ActivityLevel } from '../types';
import { NutritionEngine, ACTIVITY_FACTORS, GOAL_CONFIG } from '../services/nutritionEngine';
import { StorageService } from '../services/storage';
import { User, Plus, Edit2, Download, Upload, CheckCircle2, Flame, Smartphone, Trash2 } from 'lucide-react';
import { triggerHaptic } from '../services/haptics';

interface Props {
  user: UserProfile;
  users: UserProfile[];
  onSelectUser: (id: string) => void;
  onSaveUsers: (users: UserProfile[]) => void;
  onOpenIPhoneModal: () => void;
}

export const ProfilesTab: React.FC<Props> = ({
  user,
  users,
  onSelectUser,
  onSaveUsers,
  onOpenIPhoneModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [goal, setGoal] = useState<FitnessGoal>('muscleGain');
  const [level, setLevel] = useState<FitnessLevel>('intermediate');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [sleepHoursGoal, setSleepHoursGoal] = useState(8.0);

  const bmr = NutritionEngine.calculateBMR(user);
  const tdee = NutritionEngine.calculateTDEE(user);
  const targetMacros = NutritionEngine.calculateTargetMacros(user);

  const handleOpenCreate = () => {
    triggerHaptic('light');
    setEditingUserId(null);
    setName('');
    setAge(25);
    setWeight(75);
    setHeight(175);
    setSex('male');
    setGoal('muscleGain');
    setLevel('intermediate');
    setActivityLevel('moderate');
    setSleepHoursGoal(8.0);
    setIsEditing(true);
  };

  const handleOpenEdit = (targetUser: UserProfile) => {
    triggerHaptic('light');
    setEditingUserId(targetUser.id);
    setName(targetUser.name);
    setAge(targetUser.age);
    setWeight(targetUser.weight);
    setHeight(targetUser.height);
    setSex(targetUser.sex);
    setGoal(targetUser.goal);
    setLevel(targetUser.level);
    setActivityLevel(targetUser.activityLevel);
    setSleepHoursGoal(targetUser.sleepHoursGoal || 8.0);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    triggerHaptic('medium');

    if (editingUserId) {
      // Update
      const updated = users.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            name: name.trim(),
            age,
            weight,
            height,
            sex,
            goal,
            level,
            activityLevel,
            sleepHoursGoal
          };
        }
        return u;
      });
      onSaveUsers(updated);
    } else {
      // Create new
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        age,
        weight,
        height,
        sex,
        goal,
        level,
        activityLevel,
        sleepHoursGoal
      };
      onSaveUsers([...users, newUser]);
      onSelectUser(newUser.id);
    }
    setIsEditing(false);
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('Debes mantener al menos un perfil en la aplicación.');
      return;
    }
    if (confirm('¿Eliminar este perfil?')) {
      triggerHaptic('warning');
      const updated = users.filter(u => u.id !== id);
      onSaveUsers(updated);
      if (user.id === id) {
        onSelectUser(updated[0].id);
      }
    }
  };

  const handleExportBackup = () => {
    triggerHaptic('light');
    const jsonStr = StorageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitscience-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importBackup(content);
        if (success) {
          alert('¡Datos restaurados con éxito! La página se actualizará.');
          window.location.reload();
        } else {
          alert('Error al leer el archivo de copia de seguridad.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-blue-400" />
            Perfil & Configuración
          </h2>
          <p className="text-xs text-zinc-400">
            Cálculo metabólico individual y gestión de perfiles
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Perfil
        </button>
      </div>

      {/* Resumen Fisiológico del Perfil Activo */}
      <div className="bg-gradient-to-b from-[#242426] to-[#1c1c1e] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">{user.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                ACTIVO
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {user.sex === 'male' ? 'Hombre' : 'Mujer'} • {user.age} años • {user.height} cm • {user.weight} kg
            </p>
          </div>
          <button
            onClick={() => handleOpenEdit(user)}
            className="p-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Fórmulas Científicas Calculadas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">
              TMB (Mifflin-St Jeor)
            </span>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {Math.round(bmr)} <span className="text-xs font-normal text-zinc-400">kcal</span>
            </div>
            <span className="text-[10px] text-zinc-500">Gasto metabólico en reposo</span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">
              TDEE (Gasto Diario Total)
            </span>
            <div className="text-xl font-black text-orange-400 font-mono mt-0.5">
              {tdee} <span className="text-xs font-normal text-zinc-400">kcal</span>
            </div>
            <span className="text-[10px] text-zinc-500">Mantenimiento con actividad</span>
          </div>
        </div>

        {/* Macros calculados para el objetivo */}
        <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-300">Objetivo: {GOAL_CONFIG[user.goal]?.label}</span>
            <span className="text-orange-400 font-mono">{targetMacros.calories} kcal/día</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 py-1.5 rounded-lg">
              <span className="text-[10px] text-red-400 block font-bold">Proteína</span>
              <span className="font-mono font-bold text-white">{targetMacros.protein}g</span>
            </div>
            <div className="bg-white/5 py-1.5 rounded-lg">
              <span className="text-[10px] text-blue-400 block font-bold">Carbs</span>
              <span className="font-mono font-bold text-white">{targetMacros.carbs}g</span>
            </div>
            <div className="bg-white/5 py-1.5 rounded-lg">
              <span className="text-[10px] text-yellow-400 block font-bold">Grasas</span>
              <span className="font-mono font-bold text-white">{targetMacros.fats}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Crear / Editar Perfil */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-[#1c1c1e] border-2 border-blue-500/40 rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn">
          <h3 className="text-sm font-bold text-white">
            {editingUserId ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2c2c2e] text-white px-3 py-2 rounded-xl border border-white/10"
                placeholder="Ej: Abel"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Edad</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  className="w-full bg-[#2c2c2e] text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 70)}
                  className="w-full bg-[#2c2c2e] text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 170)}
                  className="w-full bg-[#2c2c2e] text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Sexo Biológico</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as BiologicalSex)}
                  className="w-full bg-[#2c2c2e] text-white px-3 py-2 rounded-xl border border-white/10"
                >
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Objetivo Físico</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-[#2c2c2e] text-white px-3 py-2 rounded-xl border border-white/10"
                >
                  <option value="fatLoss">Perder Grasa (-20%)</option>
                  <option value="muscleGain">Ganar Músculo (+10%)</option>
                  <option value="recomp">Recomposición (0%)</option>
                  <option value="performance">Rendimiento (-5%)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Nivel de Actividad Diaria</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full bg-[#2c2c2e] text-white px-3 py-2 rounded-xl border border-white/10"
              >
                {Object.entries(ACTIVITY_FACTORS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Meta de Sueño ({sleepHoursGoal}h)</label>
              <input
                type="range"
                min="6"
                max="10"
                step="0.5"
                value={sleepHoursGoal}
                onChange={(e) => setSleepHoursGoal(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
            >
              Guardar Perfil
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 font-bold rounded-xl text-xs transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Perfiles Disponibles (Multi-Usuario) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Perfiles en este dispositivo ({users.length})
        </h3>

        {users.map(u => {
          const isActive = u.id === user.id;

          return (
            <div
              key={u.id}
              onClick={() => {
                triggerHaptic('light');
                onSelectUser(u.id);
              }}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                isActive
                  ? 'bg-blue-950/20 border-blue-500/40'
                  : 'bg-[#1c1c1e] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-zinc-400'
                }`}>
                  {u.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{u.name}</h4>
                  <p className="text-xs text-zinc-400">
                    {GOAL_CONFIG[u.goal]?.label.split(' ')[0]} {GOAL_CONFIG[u.goal]?.label.split(' ')[1]} • {u.weight} kg
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                )}
                {users.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(u.id);
                    }}
                    className="p-1.5 text-zinc-600 hover:text-red-400 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Herramientas de Datos y Conexión iPhone */}
      <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Sincronización & Respaldos
        </h3>

        <button
          onClick={onOpenIPhoneModal}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Smartphone className="w-4 h-4" />
          Conectar / Enviar a mi iPhone (Código QR)
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Exportar Backup JSON
          </button>

          <label className="py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Importar Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

