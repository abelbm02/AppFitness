import Foundation
import SwiftData

@Model
final class UserProfile: Identifiable {
    @Attribute(.unique) var id: UUID
    var name: String
    var age: Int
    var weight: Double // kg
    var height: Double // cm
    var sex: BiologicalSex
    var goal: FitnessGoal
    var level: FitnessLevel
    var activityLevel: ActivityLevel
    var sleepHoursGoal: Double
    
    // Relationship to logs
    @Relationship(deleteRule: .cascade) var nutritionLogs: [NutritionLog] = []
    @Relationship(deleteRule: .cascade) var workouts: [Workout] = []
    
    init(name: String, age: Int, weight: Double, height: Double, sex: BiologicalSex, goal: FitnessGoal, level: FitnessLevel, activityLevel: ActivityLevel, sleepHoursGoal: Double = 8.0) {
        self.id = UUID()
        self.name = name
        self.age = age
        self.weight = weight
        self.height = height
        self.sex = sex
        self.goal = goal
        self.level = level
        self.activityLevel = activityLevel
        self.sleepHoursGoal = sleepHoursGoal
    }
}

@Model
final class Workout: Identifiable {
    @Attribute(.unique) var id: UUID
    var date: Date
    var name: String
    var exercises: [Exercise] = []
    
    init(name: String, date: Date = Date()) {
        self.id = UUID()
        self.name = name
        self.date = date
    }
}

@Model
final class Exercise: Identifiable {
    @Attribute(.unique) var id: UUID
    var name: String
    var muscleGroup: MuscleGroup
    var sets: [WorkoutSet] = []
    
    init(name: String, muscleGroup: MuscleGroup) {
        self.id = UUID()
        self.name = name
        self.muscleGroup = muscleGroup
    }
}

@Model
final class WorkoutSet: Identifiable {
    @Attribute(.unique) var id: UUID
    var reps: Int
    var weight: Double
    var rpe: Double? // Rating of Perceived Exertion (1-10)
    var isCompleted: Bool
    var date: Date
    
    init(reps: Int, weight: Double, rpe: Double? = nil, isCompleted: Bool = true, date: Date = Date()) {
        self.id = UUID()
        self.reps = reps
        self.weight = weight
        self.rpe = rpe
        self.isCompleted = isCompleted
        self.date = date
    }
}

@Model
final class NutritionLog: Identifiable {
    @Attribute(.unique) var id: UUID
    var date: Date
    var calories: Double
    var protein: Double
    var carbs: Double
    var fats: Double
    var sleepHours: Double
    
    init(date: Date = Date(), calories: Double = 0, protein: Double = 0, carbs: Double = 0, fats: Double = 0, sleepHours: Double = 0) {
        self.id = UUID()
        self.date = date
        self.calories = calories
        self.protein = protein
        self.carbs = carbs
        self.fats = fats
        self.sleepHours = sleepHours
    }
}
