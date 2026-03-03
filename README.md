# 🚀 FitScience - Entrenamiento & Nutrición Inteligente

**FitScience** es una aplicación nativa para iOS (iPhone) diseñada para llevar el entrenamiento y la nutrición al siguiente nivel mediante el uso de **evidencia científica real**. 

Desarrollada con **SwiftUI** y **SwiftData**, la app ofrece una experiencia premium, fluida y totalmente personalizada tanto para uso personal como para escalar a un producto comercial.

---

## ✨ Características Principales

### 👥 Sistema Multi-Perfil
Diseñado desde el inicio para permitir múltiples usuarios independientes (ej: tú y tu pareja). Cada perfil cuenta con su propia base de datos de:
- Medidas corporales (Peso, Altura, Edad).
- Objetivos específicos (Pérdida de grasa, Ganancia muscular, Recomposición).
- Historial de entrenamientos y nutrición.

### 🔬 Base Científica Obligatoria
Nada de recomendaciones genéricas. La lógica de la app se basa en:
- **Fórmula Mifflin-St Jeor** para el cálculo preciso de la Tasa Metabólica Basal (TMB).
- **Proteína Optimizada**: Ajuste automático entre 1.6–2.2 g/kg.
- **Volumen de Entrenamiento**: Monitoreo de 10-20 series semanales por grupo muscular.
- **Sobrecarga Progresiva**: Detección inteligente de estancamientos y sugerencias de aumento de carga.

### 🏋️ Registro de Entrenamiento (Logger)
- Creación de rutinas personalizadas.
- Registro detallado de series, repeticiones, peso y **RPE**.
- Seguimiento de PRs automáticos y gráficas de progresión por ejercicio.

### 🍎 Nutrición IA Adaptativa
- Cálculo dinámico de macros según objetivo y nivel de actividad.
- Feedback en tiempo real: "Te faltan 30g de proteína para tu objetivo".
- Ajustes semanales automáticos basados en la tendencia de peso y rendimiento.

---

## 🛠️ Stack Tecnológico

- **Lenguaje:** Swift 5.10+
- **Interfaz:** SwiftUI (declarativa y reactiva)
- **Persistencia:** SwiftData (Base de datos local relacional introducida en iOS 17)
- **Gráficas:** SwiftUI Charts
- **Arquitectura:** MVVM + Service-Oriented Logic (Clean Architecture)
- **Notificaciones:** UNUserNotificationCenter para recordatorios inteligentes.

---

## 📂 Estructura del Proyecto

```text
FitScience/
├── 📱 App/                 # Punto de entrada y navegación (MainTabView)
├── 📊 Models/              # Esquema de la base de datos SwiftData
├── 🧠 Services/            # Motores científicos (NutritionEngine, TrainingEngine, etc.)
├── 🖥️ ViewModels/          # Lógica de estados y preparación de datos
├── 🎨 Views/               # Componentes de UI y pantallas principales
└── ⚙️ Core/                # Constantes, Enums y lógicas globales
```

---

## 🚀 Instalación y Ejecución

1. Clona este repositorio o descarga los archivos.
2. Abre el proyecto en **Xcode 15.0+**.
3. Asegúrate de tener seleccionado un Simulador o iPhone físico con **iOS 17.0+**.
4. En **Signing & Capabilities**, selecciona tu equipo de desarrollo de Apple.
5. Pulsa `Cmd + R` para compilar y ejecutar.

---

## 📈 Hoja de Ruta (Roadmap)

- [ ] Integración con **Apple HealthKit** (Pasos y sueño automático).
- [ ] Sincronización con **iCloud** para multi-dispositivo.
- [ ] Versión para **Apple Watch**.
- [ ] Backend en la nube para suscripciones y comunidad.

---

## 📄 Licencia

Este proyecto es para uso personal y educativo. Todos los derechos reservados.

---
*Desarrollado con ❤️ y Ciencia por Antigravity AI.*
