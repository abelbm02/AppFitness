import Foundation

class AdaptationEngine {
    static let shared = AdaptationEngine()
    
    private init() {}
    
    func analyzeWeeklyProgress(user: UserProfile, logs: [NutritionLog], workouts: [Workout]) -> String {
        // In a real app, we would compare this week's average weight vs last week
        // and exercise weight/volume progress
        
        let recentLogs = logs.sorted { $0.date > $1.date }.prefix(7)
        let avgSleep = recentLogs.map { $0.sleepHours }.reduce(0, +) / Double(max(1, recentLogs.count))
        
        var message = ""
        
        if avgSleep < user.sleepHoursGoal - 1 {
            message += "Tu recuperación se ve afectada por falta de sueño. Prioriza dormir \(Int(user.sleepHoursGoal))h."
        }
        
        // Example logic for caloric adjustment
        // If fat loss goal and no weight change in 2 weeks -> suggest -150 kcal
        
        return message.isEmpty ? "Continúa con tu plan actual. Los datos muestran buen progreso." : message
    }
}

class ScoreEngine {
    static let shared = ScoreEngine()
    
    private init() {}
    
    func calculateDailyScore(log: NutritionLog, user: UserProfile, workoutDone: Bool) -> Int {
        let targets = NutritionEngine.shared.calculateTargetMacros(user: user)
        
        var score = 0
        
        // Nutrition: Up to 50 points
        let calAccuracy = 1.0 - (abs(log.calories - targets.calories) / targets.calories)
        let proteinAccuracy = log.protein >= targets.protein ? 1.0 : (log.protein / targets.protein)
        score += Int(max(0, calAccuracy) * 25)
        score += Int(max(0, proteinAccuracy) * 25)
        
        // Sleep: Up to 30 points
        let sleepRatio = log.sleepHours / user.sleepHoursGoal
        score += Int(min(1.0, sleepRatio) * 30)
        
        // Workout: 20 points
        if workoutDone {
            score += 20
        }
        
        return min(100, score)
    }
}
