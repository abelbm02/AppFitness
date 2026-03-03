import SwiftUI
import SwiftData

@main
struct FitnessApp: App {
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .onAppear {
                    NotificationManager.shared.requestAuthorization()
                }
        }
        .modelContainer(for: [UserProfile.self, Workout.self, Exercise.self, WorkoutSet.self, NutritionLog.self])
    }
}

struct MainTabView: View {
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Hoy", systemImage: "house.fill")
                }
            
            StatisticsView()
                .tabItem {
                    Label("Graficas", systemImage: "chart.bar.xaxis")
                }
            
            WorkoutLogView()
                .tabItem {
                    Label("Entreno", systemImage: "dumbbell.fill")
                }
            
            NutritionLogView()
                .tabItem {
                    Label("Log", systemImage: "square.and.pencil")
                }
            
            ProfileListView()
                .tabItem {
                    Label("Ajustes", systemImage: "gear")
                }
        }
    }
}
