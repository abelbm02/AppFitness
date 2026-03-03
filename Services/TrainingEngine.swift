import Foundation

class TrainingEngine {
    static let shared = TrainingEngine()
    
    private init() {}
    
    /// Detects if the user should increase weight for an exercise
    func shouldIncreaseWeight(history: [WorkoutSet]) -> Bool {
        guard history.count >= 3 else { return false }
        // If last 3 sets were completed with intended reps and low RPE (or just completed)
        let lastThree = history.suffix(3)
        let allCompleted = lastThree.allSatisfy { $0.isCompleted }
        // Simple logic: if you hit your targets 3 times, it's time to bump up
        return allCompleted
    }
    
    /// Detects plateau (3 sessions without improvement in volume or weight)
    func detectPlateau(exerciseName: String, workouts: [Workout]) -> Bool {
        let exerciseSets = workouts
            .sorted { $0.date > $1.date }
            .flatMap { workout in 
                workout.exercises.filter { $0.name == exerciseName }.flatMap { $0.sets } 
            }
        
        guard exerciseSets.count >= 9 else { return false }
        
        let last3 = exerciseSets.prefix(3).map { $0.weight * Double($0.reps) }.reduce(0, +)
        let middle3 = exerciseSets.dropFirst(3).prefix(3).map { $0.weight * Double($0.reps) }.reduce(0, +)
        let prior3 = exerciseSets.dropFirst(6).prefix(3).map { $0.weight * Double($0.reps) }.reduce(0, +)
        
        // Si el volumen total de las últimas 3 sesiones no ha subido respecto a las anteriores: Plateau.
        return last3 <= middle3 && middle3 <= prior3
    }
    
    /// Calculate weekly volume per muscle group
    func calculateWeeklyVolume(userProfiles: [UserProfile], workouts: [Workout]) -> [MuscleGroup: Int] {
        var volumes: [MuscleGroup: Int] = [:]
        let oneWeekAgo = Calendar.current.date(byAdding: .day, value: -7, to: Date())!
        
        let recentWorkouts = workouts.filter { $0.date >= oneWeekAgo }
        
        for workout in recentWorkouts {
            for exercise in workout.exercises {
                let completedSets = exercise.sets.filter { $0.isCompleted }.count
                volumes[exercise.muscleGroup, default: 0] += completedSets
            }
        }
        
        return volumes
    }
    
    /// Provides training recommendations based on scientific volume (10-20 sets/week)
    func getVolumeRecommendation(currentVolume: [MuscleGroup: Int]) -> String {
        var recommendations: [String] = []
        
        for muscle in MuscleGroup.allCases {
            let volume = currentVolume[muscle] ?? 0
            if volume < 10 {
                recommendations.append("Aumenta el volumen de \(muscle.rawValue) (actual: \(volume) series/semana). El mínimo recomendado es 10.")
            } else if volume > 20 {
                recommendations.append("El volumen de \(muscle.rawValue) es muy alto (\(volume)). Considera reducirlo para mejorar la recuperación.")
            }
        }
        
        return recommendations.isEmpty ? "Tu volumen de entrenamiento es óptimo." : recommendations.prefix(2).joined(separator: " ")
    }
}
