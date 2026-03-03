import SwiftUI
import SwiftData

struct WorkoutLogView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Workout.date, order: .reverse) private var workouts: [Workout]
    @State private var showingAddWorkout = false
    
    var body: some View {
        NavigationView {
            List {
                ForEach(workouts) { workout in
                    NavigationLink(destination: WorkoutDetailView(workout: workout)) {
                        VStack(alignment: .leading) {
                            Text(workout.name)
                                .font(.headline)
                            Text(workout.date, style: .date)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                .onDelete(perform: deleteWorkouts)
            }
            .navigationTitle("Entrenamientos")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddWorkout = true }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddWorkout) {
                AddWorkoutView()
            }
        }
    }
    
    private func deleteWorkouts(offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(workouts[index])
        }
    }
}

struct AddWorkoutView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    
    var body: some View {
        NavigationView {
            Form {
                TextField("Nombre de la rutina (ej: Empuje A)", text: $name)
            }
            .navigationTitle("Nuevo Entreno")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Guardar") {
                        let newWorkout = Workout(name: name)
                        modelContext.insert(newWorkout)
                        dismiss()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }
}

struct WorkoutDetailView: View {
    @Bindable var workout: Workout
    @State private var showingAddExercise = false
    
    var body: some View {
        List {
            ForEach(workout.exercises) { exercise in
                Section(header: Text(exercise.name)) {
                    ForEach(exercise.sets) { set in
                        HStack {
                            Text("\(set.weight, specifier: "%.1f") kg")
                            Spacer()
                            Text("\(set.reps) reps")
                            if let rpe = set.rpe {
                                Text("RPE \(rpe, specifier: "%.1f")")
                                    .font(.caption)
                                    .padding(4)
                                    .background(Color.blue.opacity(0.1))
                                    .cornerRadius(4)
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle(workout.name)
        .toolbar {
            Button("Añadir Ejercicio") {
                showingAddExercise = true
            }
        }
        .sheet(isPresented: $showingAddExercise) {
            AddExerciseToWorkoutView(workout: workout)
        }
    }
}

struct AddExerciseToWorkoutView: View {
    @Bindable var workout: Workout
    @Environment(\.dismiss) private var dismiss
    @State private var exerciseName = ""
    @State private var selectedMuscle: MuscleGroup = .chest
    
    var body: some View {
        NavigationView {
            Form {
                TextField("Nombre del ejercicio", text: $exerciseName)
                Picker("Grupo Muscular", selection: $selectedMuscle) {
                    ForEach(MuscleGroup.allCases, id: \.self) { muscle in
                        Text(muscle.rawValue).tag(muscle)
                    }
                }
            }
            .navigationTitle("Añadir Ejercicio")
            .toolbar {
                Button("Guardar") {
                    let newExercise = Exercise(name: exerciseName, muscleGroup: selectedMuscle)
                    workout.exercises.append(newExercise)
                    dismiss()
                }
                .disabled(exerciseName.isEmpty)
            }
        }
    }
}
