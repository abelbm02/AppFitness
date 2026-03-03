import SwiftUI
import SwiftData

struct NutritionLogView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \NutritionLog.date, order: .reverse) private var logs: [NutritionLog]
    @State private var showingAddLog = false
    
    var body: some View {
        NavigationView {
            List {
                ForEach(logs) { log in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(log.date, style: .date)
                                .font(.headline)
                            Spacer()
                            Text("\(Int(log.calories)) kcal")
                                .font(.subheadline.bold())
                                .foregroundColor(.orange)
                        }
                        
                        HStack(spacing: 15) {
                            MacroBar(label: "P", value: log.protein, color: .red)
                            MacroBar(label: "C", value: log.carbs, color: .blue)
                            MacroBar(label: "G", value: log.fats, color: .yellow)
                            Spacer()
                            Label("\(log.sleepHours, specifier: "%.1f")h", systemImage: "moon.fill")
                                .font(.caption)
                                .foregroundColor(.purple)
                        }
                    }
                    .padding(.vertical, 4)
                }
                .onDelete(perform: deleteLogs)
            }
            .navigationTitle("Diario y Sueño")
            .toolbar {
                Button(action: { showingAddLog = true }) {
                    Image(systemName: "plus")
                }
            }
            .sheet(isPresented: $showingAddLog) {
                AddNutritionLogView()
            }
        }
    }
    
    private func deleteLogs(offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(logs[index])
        }
    }
}

struct AddNutritionLogView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    
    @State private var date = Date()
    @State private var calories: Double = 2000
    @State private var protein: Double = 150
    @State private var carbs: Double = 200
    @State private var fats: Double = 60
    @State private var sleepHours: Double = 8
    
    var body: some View {
        NavigationView {
            Form {
                DatePicker("Fecha", selection: $date, displayedComponents: .date)
                
                Section("Energía y Macros") {
                    HStack {
                        Text("Calorías")
                        Spacer()
                        TextField("Kcal", value: $calories, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                    
                    HStack {
                        Text("Proteína (g)")
                        Spacer()
                        TextField("Prot", value: $protein, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                    
                    HStack {
                        Text("Carbohidratos (g)")
                        Spacer()
                        TextField("Carbs", value: $carbs, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                    
                    HStack {
                        Text("Grasas (g)")
                        Spacer()
                        TextField("Grasas", value: $fats, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                }
                
                Section("Recuperación") {
                    HStack {
                        Text("Horas de Sueño")
                        Spacer()
                        Slider(value: $sleepHours, in: 0...12, step: 0.5)
                            .tint(.purple)
                        Text("\(sleepHours, specifier: "%.1f")h")
                            .frame(width: 45)
                    }
                }
            }
            .navigationTitle("Registrar Día")
            .toolbar {
                Button("Guardar") {
                    let newLog = NutritionLog(date: date, calories: calories, protein: protein, carbs: carbs, fats: fats, sleepHours: sleepHours)
                    modelContext.insert(newLog)
                    dismiss()
                }
            }
        }
    }
}

struct MacroBar: View {
    let label: String
    let value: Double
    let color: Color
    
    var body: some View {
        HStack(spacing: 4) {
            Text(label)
                .font(.caption2.bold())
                .foregroundColor(color)
            Text("\(Int(value))g")
                .font(.caption2)
        }
    }
}
