import Foundation

enum FitnessGoal: String, Codable, CaseIterable {
    case fatLoss = "Perder Grasa"
    case muscleGain = "Ganar Músculo"
    case recomp = "Recomposición"
    case performance = "Rendimiento"
    
    var deficitPercentage: Double {
        switch self {
        case .fatLoss: return 0.20 // 20% deficit
        case .muscleGain: return -0.10 // 10% surplus
        case .recomp: return 0.0
        case .performance: return -0.05 // Slight surplus
        }
    }
}

enum FitnessLevel: String, Codable, CaseIterable {
    case beginner = "Principiante"
    case intermediate = "Intermedio"
    case advanced = "Avanzado"
}

enum BiologicalSex: String, Codable, CaseIterable {
    case male = "Hombre"
    case female = "Mujer"
}

enum MuscleGroup: String, Codable, CaseIterable {
    case chest = "Pecho"
    case back = "Espalda"
    case legs = "Piernas"
    case shoulders = "Hombros"
    case arms = "Brazos"
    case core = "Core"
}

enum ActivityLevel: String, Codable, CaseIterable {
    case sedentary = "Sedentario"
    case light = "Ligero"
    case moderate = "Moderado"
    case active = "Activo"
    case veryActive = "Muy Activo"
    
    var factor: Double {
        switch self {
        case .sedentary: return 1.2
        case .light: return 1.375
        case .moderate: return 1.55
        case .active: return 1.725
        case .veryActive: return 1.9
        }
    }
}
