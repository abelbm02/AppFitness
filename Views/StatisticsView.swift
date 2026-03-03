import SwiftUI
import Charts
import SwiftData

struct StatisticsView: View {
    @Query(sort: \NutritionLog.date) private var logs: [NutritionLog]
    @Query(sort: \Workout.date) private var workouts: [Workout]
    @AppStorage("activeUserUUID") private var activeUserUUIDString: String = ""
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 25) {
                    // Weight Progresion (Hypothetically, if we added weight to logs)
                    weightChart
                    
                    // Nutrition Adherence
                    nutritionChart
                    
                    // Volume by Muscle Group
                    volumeDistributionChart
                }
                .padding()
            }
            .navigationTitle("Estadísticas")
        }
    }
    
    private var weightChart: some View {
        VStack(alignment: .leading) {
            Text("Progresión Semanal")
                .font(.headline)
            Chart {
                ForEach(logs.suffix(14)) { log in
                    LineMark(
                        x: .value("Día", log.date),
                        y: .value("Calorías", log.calories)
                    )
                    .foregroundStyle(.orange)
                }
            }
            .frame(height: 200)
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(15)
    }
    
    private var nutritionChart: some View {
        VStack(alignment: .leading) {
            Text("Cumplimiento de Proteína")
                .font(.headline)
            Chart {
                ForEach(logs.suffix(7)) { log in
                    BarMark(
                        x: .value("Día", log.date, unit: .day),
                        y: .value("Proteína", log.protein)
                    )
                    .foregroundStyle(log.protein > 150 ? .green : .red)
                }
            }
            .frame(height: 150)
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(15)
    }
    
    private var volumeDistributionChart: some View {
        VStack(alignment: .leading) {
            Text("Distribución de Volumen")
                .font(.headline)
            Chart {
                ForEach(MuscleGroup.allCases, id: \.self) { muscle in
                    let volume = TrainingEngine.shared.calculateWeeklyVolume(userProfiles: [], workouts: workouts)[muscle] ?? 0
                    SectorMark(
                        angle: .value("Volumen", volume),
                        innerRadius: .ratio(0.6),
                        angularInset: 2
                    )
                    .foregroundStyle(by: .value("Músculo", muscle.rawValue))
                    .annotation(position: .overlay) {
                        if volume > 0 {
                            Text("\(volume)")
                                .font(.caption.bold())
                                .foregroundColor(.white)
                        }
                    }
                }
            }
            .frame(height: 250)
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(15)
    }
}
