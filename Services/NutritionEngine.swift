import Foundation

struct NutritionMacros {
    let calories: Double
    let protein: Double
    let carbs: Double
    let fats: Double
}

class NutritionEngine {
    static let shared = NutritionEngine()
    
    private init() {}
    
    /// Calculate TMB using Mifflin-St Jeor Formula
    func calculateBMR(user: UserProfile) -> Double {
        let weightFactor = 10 * user.weight
        let heightFactor = 6.25 * user.height
        let ageFactor = 5 * Double(user.age)
        
        let bmr: Double
        if user.sex == .male {
            bmr = weightFactor + heightFactor - ageFactor + 5
        } else {
            bmr = weightFactor + heightFactor - ageFactor - 161
        }
        return bmr
    }
    
    /// Calculate TDEE (Total Daily Energy Expenditure)
    func calculateTDEE(user: UserProfile) -> Double {
        let bmr = calculateBMR(user: user)
        return bmr * user.activityLevel.factor
    }
    
    /// Calculate Target Calories and Macros based on objective
    func calculateTargetMacros(user: UserProfile) -> NutritionMacros {
        let tdee = calculateTDEE(user: user)
        let adjustmentFactor = 1.0 - user.goal.deficitPercentage
        let targetCalories = tdee * adjustmentFactor
        
        // Protein: 2.0g/kg as a recommended baseline (within 1.6-2.2 range)
        let targetProtein = user.weight * 2.0
        
        // Fats: ~25% of calories
        let targetFats = (targetCalories * 0.25) / 9.0
        
        // Carbs: The rest
        let proteinCalories = targetProtein * 4.0
        let fatCalories = targetFats * 9.0
        let targetCarbs = (targetCalories - proteinCalories - fatCalories) / 4.0
        
        return NutritionMacros(calories: targetCalories, protein: targetProtein, carbs: targetCarbs, fats: targetFats)
    }
    
    /// Analyzes current intake and provides a suggestion
    func getNutritionFeedback(user: UserProfile, currentLog: NutritionLog) -> String {
        let targets = calculateTargetMacros(user: user)
        let proteinDeficit = targets.protein - currentLog.protein
        
        if proteinDeficit > 10 {
            return "Te faltan \(Int(proteinDeficit))g de proteína para alcanzar tu objetivo de 2g/kg. Intenta comer pollo, huevos o un batido de proteína."
        }
        
        let calorieDeficit = targets.calories - currentLog.calories
        if user.goal == .fatLoss && calorieDeficit < -200 {
            return "Estás consumiendo demasiadas calorías para tu objetivo de pérdida de grasa. Ajusta tus porciones."
        } else if user.goal == .muscleGain && calorieDeficit > 500 {
            return "Tu superávit es insuficiente. Necesitas comer más para ganar músculo."
        }
        
        return "¡Buen trabajo! Estás en buen camino con tu nutrición hoy."
    }
}
