import Foundation
import UserNotifications

class NotificationManager {
    static let shared = NotificationManager()
    
    private init() {}
    
    func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if granted {
                print("Notification permission granted.")
                self.setupDefaultNotifications()
            }
        }
    }
    
    private func setupDefaultNotifications() {
        // Example: Reminder to log protein if late in the day
        scheduleReminder(title: "Check de Proteína 🍗", body: "¿Ya alcanzaste tus macros hoy?", hour: 20)
        
        // Example: Reminder to sleep
        scheduleReminder(title: "Hora de Recuperar 😴", body: "Tu cuerpo crece mientras duermes. ¡A descansar!", hour: 23)
    }
    
    func scheduleReminder(title: String, body: String, hour: Int) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        var dateComponents = DateComponents()
        dateComponents.hour = hour
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request)
    }
    
    func sendDynamicAlert(title: String, body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request)
    }
}
