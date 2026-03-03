import Foundation
import SwiftData
import SwiftUI

@MainActor
class DashboardViewModel: ObservableObject {
    @Published var currentUser: UserProfile?
    @Published var dailyLog: NutritionLog?
    @Published var dailyScore: Int = 0
    @Published var recommendation: String = ""
    @Published var weeklyVolume: [MuscleGroup: Int] = [:]
    
    private let nutritionEngine = NutritionEngine.shared
    private let trainingEngine = TrainingEngine.shared
    private let adaptationEngine = AdaptationEngine.shared
    private let scoreEngine = ScoreEngine.shared
    
    func refreshData(activeUserUUID: String, users: [UserProfile], allLogs: [NutritionLog], allWorkouts: [Workout]) {
        self.currentUser = users.first { $0.id.uuidString == activeUserUUID } ?? users.first
        
        guard let userValue = currentUser else { 
            self.dailyLog = nil
            self.dailyScore = 0
            self.recommendation = "Por favor crea un perfil para comenzar."
            return
        }
        
        let userLogs = userValue.nutritionLogs
        let userWorkouts = userValue.workouts
        
        let today = Calendar.current.startOfDay(for: Date())
        self.dailyLog = userLogs.first { Calendar.current.isDate($0.date, inSameDayAs: today) } ?? NutritionLog(date: today)
        
        guard let log = dailyLog else { return }
        
        let workoutToday = userWorkouts.contains { Calendar.current.isDate($0.date, inSameDayAs: today) }
        self.dailyScore = scoreEngine.calculateDailyScore(log: log, user: userValue, workoutDone: workoutToday)
        
        let nutritionFeedback = nutritionEngine.getNutritionFeedback(user: userValue, currentLog: log)
        let adaptationFeedback = adaptationEngine.analyzeWeeklyProgress(user: userValue, logs: userLogs, workouts: userWorkouts)
        
        self.weeklyVolume = trainingEngine.calculateWeeklyVolume(userProfiles: [userValue], workouts: userWorkouts)
        let trainingFeedback = trainingEngine.getVolumeRecommendation(currentVolume: weeklyVolume)
        
        self.recommendation = "\(nutritionFeedback) \(trainingFeedback) \(adaptationFeedback)"
    }
    
    var targetMacros: NutritionMacros? {
        guard let user = currentUser else { return nil }
        return nutritionEngine.calculateTargetMacros(user: user)
    }
}
