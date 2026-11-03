# 🚀 FitScience - Entrenamiento & Nutrición Inteligente (Cross-Platform)

**FitScience** es una aplicación multiplataforma de alto rendimiento diseñada para llevar el entrenamiento y la nutrición al siguiente nivel mediante el uso de **evidencia científica real**.

Funciona tanto en **Windows (PC/Escritorio)** como en **iPhone (iOS)** mediante tecnología **Progressive Web App (PWA)** de última generación con estética y sensación táctil nativa de Apple (iOS Safe Areas, haptics, dark theme de alto contraste).

---

## 📱 ¿Cómo ejecutarlo y verlo en activo AHORA MISMO?

El servidor de desarrollo ya está configurado y optimizado para emitir en tu red local.

### 1. En tu ordenador con Windows:
Abre tu navegador (Chrome, Edge o Brave) y visita:
👉 **[http://localhost:5173](http://localhost:5173)**

*(Opcional: En la barra de direcciones de Chrome/Edge, puedes pulsar el icono de "Instalar FitScience" para tenerla como app de escritorio independiente).*

---

### 2. En tu teléfono iPhone:
1. Asegúrate de que tu iPhone esté conectado a la **misma red Wi-Fi** que este PC.
2. Abre la cámara de tu iPhone y escanea el código QR que aparece al pulsar **"Ver en iPhone"** en la esquina superior de la aplicación en tu PC, o abre **Safari** y escribe directamente:
   👉 **`http://192.168.1.64:5173`**
3. Una vez cargada en Safari en tu iPhone:
   - Toca el botón de **Compartir** (el icono del cuadrado con una flecha hacia arriba en la parte inferior de Safari).
   - Desliza hacia abajo y pulsa **"Añadir a la pantalla de inicio"** (Add to Home Screen).
   - Pulsa **Añadir**.
4. ¡Listo! Se creará el icono de **FitScience** en la pantalla de inicio de tu iPhone. Al abrirlo, se ejecutará a pantalla completa sin barras de navegador, comportándose al 100% como una aplicación nativa de iOS.

---

## ✨ Características y Módulos Implementados

### 🏠 1. Dashboard Diario ("Hoy")
* **Daily Score Científico (0-100)**: Ponderación algorítmica de nutrición (50%), horas de descanso (30%) y entrenamiento completado (20%).
* **Anillos de Macronutrientes**: Progreso en tiempo real de Calorías, Proteínas, Carbohidratos y Grasas con cálculo de restantes.
* **IA Adaptativa Científica**: Sugerencias dinámicas según tu balance calórico, ingesta proteica y fatiga muscular.
* **Resumen de Volumen Semanal**: Monitor de 10 a 20 series semanales por grupo muscular (rango óptimo de hipertrofia según Schoenfeld et al.).
* **Acceso Rápido al Entreno**: Previsualización de la rutina programada para el día de hoy.

### 🏋️ 2. Entrenamientos (Logger de Fuerza con RPE)
* **Cronómetro de Sesión en Vivo**: Control de tiempo de entrenamiento activo.
* **Sobrecarga Progresiva Automática**: Detección inteligente de mejora para recomendar incrementos de peso (+2.5 kg).
* **Detección de Estancamientos (*Plateau*)**: Alertas si no ha habido progresión de volumen en 3 sesiones consecutivas.
* **Escala RPE (1-10)**: Registro de esfuerzo percibido y repeticiones en recámara (RIR) por cada serie.
* **Celebración con Confetti**: Animación de victoria al completar un entrenamiento.

### 🥗 3. Comidas y Hábitos (Nutrición Científica)
* **Fórmula Mifflin-St Jeor**: Cálculo personalizado de Tasa Metabólica Basal (TMB) y Gasto Total Diario (TDEE).
* **Proteína Optimizada**: Ajuste a **2.0 g/kg** de peso corporal.
* **Registro Rápido de 1 Clic**: Base de datos preinstalada de alimentos saludables (Pechuga de pollo, arroz, avena, huevos, proteína whey, yogur griego, etc.).
* **Creador de Alimentos Personalizados**: Para registrar cualquier receta o comida externa.
* **Monitor de Sueño e Hidratación**: Control de horas de descanso y registro de vasos de agua diarios.

### 📅 4. Planning Semanal (Entreno & Ciclos de Calorías)
* **División semanal de Lunes a Domingo**: Asignación de rutinas por días (Empuje, Tracción, Piernas, Descanso activo).
* **Estrategia Nutricional**: Sincronización de días altos en carbohidratos en entrenamientos pesados y días de mantenimiento en descanso.
* **Editor Interactivo**: Personaliza grupos musculares, días libres y objetivos por día.

### 📊 5. Gráficas & Calculadoras Científicas
* **Adherencia Proteica**: Gráfica de barras de los últimos 7 días con línea de meta.
* **Distribución de Volumen Muscular**: Gráfica sectorial con porcentaje de series efectivas por grupo muscular.
* **Calculadora de 1RM (Epley)**: Estima tu repetición máxima teórica y tus cargas para 5RM (85%) y 10RM (75%).

### 👥 6. Perfiles y Copia de Seguridad
* **Sistema Multi-Perfil**: Alterna al instante entre diferentes usuarios (ej. tú y tu pareja) con bases de datos independientes.
* **Exportar / Importar Copia de Seguridad**: Descarga tus datos en formato JSON para transferirlos o respaldarlos con un clic.

---

## 🛠️ Stack Tecnológico
* **Frontend**: React 18 + TypeScript + Vite 6
* **Estilos**: Tailwind CSS con paleta de diseño nativa de Apple (iOS Dark Theme)
* **PWA & Mobile**: Viewport fit cover, Safe Area insets para Dynamic Island / Notch de iPhone, Web App Manifest
* **Iconografía & Haptics**: Lucide Icons + Vibration API
* **Persistencia**: LocalStorage con migración y exportación JSON completa

---

*Desarrollado para Abel Blanco Muñoz.*
