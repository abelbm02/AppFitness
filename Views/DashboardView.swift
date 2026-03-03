import SwiftUI
import SwiftData

struct DashboardView: View {
    @Environment(\.modelContext) private var modelContext
    @StateObject private var viewModel = DashboardViewModel()
    @AppStorage("activeUserUUID") private var activeUserUUIDString: String = ""
    
    @Query var users: [UserProfile]
    @Query var logs: [NutritionLog]
    @Query var workouts: [Workout]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                headerView
                
                // Score Circle
                scoreCard
                
                // Macro Progress
                nutritionSection
                
                // Recommendation Box
                recommendationBox
                
                // Training Summary
                trainingSummary
            }
            .padding()
        }
        .background(Color(UIColor.systemGroupedBackground))
        .onAppear {
            viewModel.refreshData(activeUserUUID: activeUserUUIDString, users: users, allLogs: logs, allWorkouts: workouts)
        }
        .onChange(of: activeUserUUIDString) { _ in
            viewModel.refreshData(activeUserUUID: activeUserUUIDString, users: users, allLogs: logs, allWorkouts: workouts)
        }
    }
    
    private var headerView: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("Hola, \(viewModel.currentUser?.name ?? "Atleta")")
                    .font(.largeTitle.bold())
                Text("Tu progreso basado en ciencia")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Image(systemName: "person.circle.fill")
                .font(.system(size: 40))
                .foregroundColor(.blue)
        }
    }
    
    private var scoreCard: some View {
        VStack {
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 15)
                Circle()
                    .trim(from: 0, to: CGFloat(viewModel.dailyScore) / 100)
                    .stroke(
                        AngularGradient(colors: [.red, .orange, .green], center: .center),
                        style: StrokeStyle(lineWidth: 15, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                
                VStack {
                    Text("\(viewModel.dailyScore)")
                        .font(.system(size: 50, weight: .bold, design: .rounded))
                    Text("Daily Score")
                        .font(.caption.bold())
                        .foregroundColor(.secondary)
                }
            }
            .frame(height: 180)
            .padding()
        }
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(20)
        .shadow(color: .black.opacity(0.05), radius: 10)
    }
    
    private var nutritionSection: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("Nutrición Hoy")
                .font(.headline)
            
            if let targets = viewModel.targetMacros, let current = viewModel.dailyLog {
                HStack(spacing: 20) {
                    MacroRing(title: "Calorías", current: current.calories, target: targets.calories, color: .orange)
                    MacroRing(title: "Proteína", current: current.protein, target: targets.protein, color: .red)
                    MacroRing(title: "Carbs", current: current.carbs, target: targets.carbs, color: .blue)
                    MacroRing(title: "Grasas", current: current.fats, target: targets.fats, color: .yellow)
                }
            }
        }
    }
    
    private var recommendationBox: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: "sparkles")
                    .foregroundColor(.yellow)
                Text("IA Adaptativa")
                    .font(.headline)
            }
            Text(viewModel.recommendation)
                .font(.callout)
                .foregroundColor(.primary.opacity(0.8))
                .lineLimit(nil)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.blue.opacity(0.1))
        .cornerRadius(15)
        .overlay(
            RoundedRectangle(cornerRadius: 15)
                .stroke(Color.blue.opacity(0.2), lineWidth: 1)
        )
    }
    
    private var trainingSummary: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Volumen Semanal (Series)")
                .font(.headline)
            
            ForEach(MuscleGroup.allCases, id: \.self) { muscle in
                let count = viewModel.weeklyVolume[muscle] ?? 0
                HStack {
                    Text(muscle.rawValue)
                        .font(.subheadline)
                    Spacer()
                    ProgressView(value: Double(count), total: 20)
                        .tint(count < 10 ? .orange : (count > 20 ? .red : .green))
                        .frame(width: 150)
                    Text("\(count)/20")
                        .font(.caption.monospacedDigit())
                }
            }
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(15)
    }
}

struct MacroRing: View {
    let title: String
    let current: Double
    let target: Double
    let color: Color
    
    var body: some View {
        VStack {
            ZStack {
                Circle()
                    .stroke(color.opacity(0.2), lineWidth: 5)
                Circle()
                    .trim(from: 0, to: CGFloat(min(1.0, current / target)))
                    .stroke(color, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                    .rotationEffect(.degrees(-90))
            }
            .frame(width: 50, height: 50)
            
            Text(title)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(.secondary)
            Text("\(Int(current))/\(Int(target))")
                .font(.system(size: 9, weight: .medium))
        }
    }
}
