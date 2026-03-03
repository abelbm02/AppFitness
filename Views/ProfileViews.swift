import SwiftUI
import SwiftData

struct ProfileListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \UserProfile.name) private var users: [UserProfile]
    @State private var showingCreateProfile = false
    
    // Active user tracking (using UUID stored in UserDefaults)
    @AppStorage("activeUserUUID") private var activeUserUUIDString: String = ""
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Perfiles Disponibles")) {
                    ForEach(users) { user in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(user.name)
                                    .font(.headline)
                                Text("\(user.goal.rawValue) • \(user.weight, specifier: "%.1f") kg")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            if user.id.uuidString == activeUserUUIDString {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.green)
                            }
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            activeUserUUIDString = user.id.uuidString
                        }
                    }
                    .onDelete(perform: deleteUser)
                }
                
                Section {
                    Button(action: { showingCreateProfile = true }) {
                        Label("Crear Nuevo Perfil", systemImage: "person.badge.plus")
                    }
                }
            }
            .navigationTitle("Perfiles")
            .sheet(isPresented: $showingCreateProfile) {
                CreateProfileView()
            }
        }
    }
    
    private func deleteUser(offsets: IndexSet) {
        for index in offsets {
            let user = users[index]
            if user.id.uuidString == activeUserUUIDString {
                activeUserUUIDString = ""
            }
            modelContext.delete(user)
        }
    }
}

struct CreateProfileView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    
    @State private var name = ""
    @State private var age = 25
    @State private var weight = 70.0
    @State private var height = 175.0
    @State private var sex: BiologicalSex = .male
    @State private var goal: FitnessGoal = .fatLoss
    @State private var level: FitnessLevel = .intermediate
    @State private var activity: ActivityLevel = .moderate
    
    var body: some View {
        NavigationView {
            Form {
                Section("Información Personal") {
                    TextField("Nombre", text: $name)
                    Stepper("Edad: \(age)", value: $age, in: 15...100)
                    Picker("Sexo Biológico", selection: $sex) {
                        ForEach(BiologicalSex.allCases, id: \.self) { sex in
                            Text(sex.rawValue).tag(sex)
                        }
                    }
                }
                
                Section("Medidas") {
                    HStack {
                        Text("Peso (kg)")
                        Spacer()
                        TextField("Peso", value: $weight, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                    HStack {
                        Text("Altura (cm)")
                        Spacer()
                        TextField("Altura", value: $height, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                }
                
                Section("Objetivos") {
                    Picker("Objetivo", selection: $goal) {
                        ForEach(FitnessGoal.allCases, id: \.self) { goal in
                            Text(goal.rawValue).tag(goal)
                        }
                    }
                    Picker("Nivel", selection: $level) {
                        ForEach(FitnessLevel.allCases, id: \.self) { level in
                            Text(level.rawValue).tag(level)
                        }
                    }
                    Picker("Actividad Diaria", selection: $activity) {
                        ForEach(ActivityLevel.allCases, id: \.self) { level in
                            Text(level.rawValue).tag(level)
                        }
                    }
                }
            }
            .navigationTitle("Nuevo Perfil")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Guardar") {
                        let newUser = UserProfile(name: name, age: age, weight: weight, height: height, sex: sex, goal: goal, level: level, activityLevel: activity)
                        modelContext.insert(newUser)
                        dismiss()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }
}
