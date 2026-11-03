import React, { useState, useEffect } from 'react';
import { UserProfile, Workout, NutritionLog, PlannedDay } from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardTab } from './components/DashboardTab';
import { WorkoutsTab } from './components/WorkoutsTab';
import { NutritionTab } from './components/NutritionTab';
import { PlanningTab } from './components/PlanningTab';
import { StatsTab } from './components/StatsTab';
import { ProfilesTab } from './components/ProfilesTab';
import { IPhoneConnectModal } from './components/iPhoneConnectModal';

export const App: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [planning, setPlanning] = useState<PlannedDay[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [showIPhoneModal, setShowIPhoneModal] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    const loadedUsers = StorageService.getUsers();
    const loadedActiveId = StorageService.getActiveUserId();
    const loadedWorkouts = StorageService.getWorkouts();
    const loadedLogs = StorageService.getNutritionLogs();
    const loadedPlanning = StorageService.getPlanning();

    setUsers(loadedUsers);
    setActiveUserId(loadedActiveId);
    setWorkouts(loadedWorkouts);
    setLogs(loadedLogs);
    setPlanning(loadedPlanning);
    setIsLoaded(true);
  }, []);

  const activeUser = users.find(u => u.id === activeUserId) || users[0];

  const handleSelectUser = (id: string) => {
    setActiveUserId(id);
    StorageService.setActiveUserId(id);
  };

  const handleSaveUsers = (newUsers: UserProfile[]) => {
    setUsers(newUsers);
    StorageService.saveUsers(newUsers);
  };

  const handleSaveWorkouts = (newWorkouts: Workout[]) => {
    setWorkouts(newWorkouts);
    StorageService.saveWorkouts(newWorkouts);
  };

  const handleSaveLog = (updatedLog: NutritionLog) => {
    const existingIdx = logs.findIndex(l => l.date === updatedLog.date && l.userId === updatedLog.userId);
    let updated: NutritionLog[];
    if (existingIdx >= 0) {
      updated = [...logs];
      updated[existingIdx] = updatedLog;
    } else {
      updated = [updatedLog, ...logs];
    }
    setLogs(updated);
    StorageService.saveNutritionLogs(updated);
  };

  const handleSavePlanning = (newPlan: PlannedDay[]) => {
    setPlanning(newPlan);
    StorageService.savePlanning(newPlan);
  };

  if (!isLoaded || !activeUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Cargando FitScience...</span>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === todayStr && (l.userId === activeUser.id || !l.userId));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">
      {/* iOS App Shell Container */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative shadow-2xl bg-black">
        {/* Header fijo superior */}
        <Header
          user={activeUser}
          users={users}
          onSelectUser={handleSelectUser}
          onOpenIPhoneModal={() => setShowIPhoneModal(true)}
        />

        {/* Contenido Principal con Scroll fluido */}
        <main className="flex-1 px-4 pt-4 overflow-y-auto">
          {activeTab === 'today' && (
            <DashboardTab
              user={activeUser}
              todayLog={todayLog}
              workouts={workouts}
              planning={planning}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutsTab
              workouts={workouts}
              onSaveWorkouts={handleSaveWorkouts}
              activeUserId={activeUser.id}
            />
          )}

          {activeTab === 'nutrition' && (
            <NutritionTab
              user={activeUser}
              todayLog={todayLog}
              onSaveLog={handleSaveLog}
            />
          )}

          {activeTab === 'planning' && (
            <PlanningTab
              planning={planning}
              onSavePlanning={handleSavePlanning}
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab
              user={activeUser}
              logs={logs}
              workouts={workouts}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilesTab
              user={activeUser}
              users={users}
              onSelectUser={handleSelectUser}
              onSaveUsers={handleSaveUsers}
              onOpenIPhoneModal={() => setShowIPhoneModal(true)}
            />
          )}
        </main>

        {/* Barra de navegación inferior tipo iOS */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

        {/* Modal para conectar / pasar a iPhone */}
        <IPhoneConnectModal
          isOpen={showIPhoneModal}
          onClose={() => setShowIPhoneModal(false)}
        />
      </div>
    </div>
  );
};

export default App;
