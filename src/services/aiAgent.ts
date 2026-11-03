import { UserProfile, NutritionLog, Workout, PlannedDay } from '../types';
import { NutritionEngine } from './nutritionEngine';
import { TrainingEngine, ALL_MUSCLE_GROUPS } from './trainingEngine';

export interface AgentContext {
  user: UserProfile;
  todayLog: NutritionLog;
  workouts: Workout[];
  planning: PlannedDay[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'nutrition' | 'training' | 'recovery' | 'science';
}

export class AIAgentService {
  /**
   * Genera sugerencias rápidas inteligentes según el estado real del usuario
   */
  static getDynamicSuggestions(ctx: AgentContext): string[] {
    const targets = NutritionEngine.calculateTargetMacros(ctx.user);
    const protDeficit = targets.protein - ctx.todayLog.protein;
    const calDeficit = targets.calories - ctx.todayLog.calories;
    const suggestions: string[] = [];

    if (ctx.todayLog.calories === 0) {
      suggestions.push("🎯 ¿Cómo debería distribuir mis comidas y calorías de hoy?");
      suggestions.push("🥗 Recomiéndame un desayuno óptimo para mi objetivo");
    } else if (protDeficit > 20) {
      suggestions.push(`🍗 ¿Qué puedo cenar para completar mis ${Math.round(protDeficit)}g de proteína restantes?`);
    }

    if (ctx.todayLog.sleepHours > 0 && ctx.todayLog.sleepHours < 6.5) {
      suggestions.push("😴 He dormido poco hoy, ¿debo entrenar o cómo adapto la sesión?");
    }

    suggestions.push("📊 Analiza mi estado actual de hoy y dame feedback");
    suggestions.push("🏋️ ¿Cuándo y cuánto peso debo subir en mis ejercicios?");
    suggestions.push("💧 ¿Cuánta agua y electrolitos necesito según mi peso?");

    return suggestions.slice(0, 4);
  }

  /**
   * Motor de razonamiento científico del Agente FitScience
   */
  static async askAgent(question: string, ctx: AgentContext): Promise<string> {
    const q = question.toLowerCase().trim();
    const targets = NutritionEngine.calculateTargetMacros(ctx.user);
    const log = ctx.todayLog;
    const weeklyVol = TrainingEngine.calculateWeeklyVolume(ctx.workouts);
    const protRemaining = targets.protein - log.protein;
    const calRemaining = targets.calories - log.calories;

    // Simular latencia de "pensamiento de IA" (300-500ms) para que se sienta reactivo y real
    await new Promise(res => setTimeout(res, 450));

    // 1. ANÁLISIS DEL DÍA / ESTADO ACTUAL
    if (q.includes('analiza') || q.includes('cómo voy') || q.includes('resumen') || q.includes('estado')) {
      if (log.calories === 0) {
        return `Hola ${ctx.user.name}. Actualmente tu registro de hoy está **a cero (0 kcal y 0g proteína)**.
        
Para tu objetivo de **${ctx.user.goal === 'muscleGain' ? 'Ganar Músculo' : ctx.user.goal === 'fatLoss' ? 'Perder Grasa' : 'Recomposición'}**, tus metas diarias calculadas por Mifflin-St Jeor son:
* **Calorías:** ${targets.calories} kcal
* **Proteína:** ${targets.protein}g (2.0 g/kg para máxima síntesis proteica)
* **Carbohidratos:** ${targets.carbs}g
* **Grasas:** ${targets.fats}g

💡 **Consejo inicial:** Comienza registrando tu primera comida en la pestaña **Comidas**. ¡Tienes todo el día por delante para bordarlo!`;
      }

      return `Hola ${ctx.user.name}. Aquí tienes tu radiografía metabólica en tiempo real:
* **Calorías:** Llevas **${Math.round(log.calories)} kcal** de tu meta de **${targets.calories} kcal** (${calRemaining > 0 ? `te restan ${Math.round(calRemaining)} kcal` : `superávit de +${Math.abs(Math.round(calRemaining))} kcal`}).
* **Proteína:** Llevas **${Math.round(log.protein)}g** de **${targets.protein}g** (${protRemaining > 0 ? `te faltan ${Math.round(protRemaining)}g` : '¡Meta de proteína alcanzada! ✅'}).
* **Carbos:** ${Math.round(log.carbs)}g / ${targets.carbs}g | **Grasas:** ${Math.round(log.fats)}g / ${targets.fats}g.
* **Hidratación:** ${log.waterLiters || 0}L | **Sueño:** ${log.sleepHours || 0}h.

🔬 **Veredicto Científico:** ${
        protRemaining <= 10
          ? 'Excelente trabajo proteico. El estímulo anabólico muscular está cubierto.'
          : `Prioriza fuentes magras en tu próxima comida para cerrar la brecha de ${Math.round(protRemaining)}g de proteína.`
      }`;
    }

    // 2. SUGERENCIA DE COMIDAS / PROTEÍNA
    if (q.includes('cenar') || q.includes('comer') || q.includes('comida') || q.includes('alimento') || q.includes('proteína') || q.includes('desayun')) {
      const neededProt = Math.max(25, Math.round(protRemaining > 0 ? protRemaining : 35));
      const neededCal = Math.max(300, Math.round(calRemaining > 0 ? calRemaining : 450));

      return `Para cubrir aproximadamente **~${neededProt}g de proteína** con unas **~${neededCal} kcal**, te recomiendo estas opciones científicamente respaldadas por biodisponibilidad (DIAAS):

**Opción 1: Alto en proteína y muy magro**
* 180g de **Pechuga de pollo o Pavo** a la plancha (~45g proteína, ~220 kcal)
* 150g de **Arroz blanco cocido** o patata asada (~42g carbs, ~180 kcal)
* 1 cucharadita de aceite de oliva virgen extra (~45 kcal)

**Opción 2: Rápida y sin cocinar**
* 250g de **Yogur Griego 0% o Queso fresco batido** (~25g proteína, ~140 kcal)
* 1 cazo (30g) de **Proteína Whey** mezclada (~24g proteína, ~120 kcal)
* 1 puñado (25g) de **Nueces o Almendras** (~150 kcal, grasas saludables)

**Opción 3: Pescado rico en Omega-3**
* 200g de **Salmón o Atún fresco** (~40g proteína, grasas antiinflamatorias para recuperación muscular).`;
    }

    // 3. ENTRENAMIENTO Y SOBRECARGA PROGRESIVA
    if (q.includes('peso') || q.includes('subir') || q.includes('entreno') || q.includes('rutina') || q.includes('rpe') || q.includes('estancad')) {
      return `La ciencia de la hipertrofia (*Schoenfeld, 2021*) establece el principio de **Doble Progresión**:

1. **Rango de Repeticiones:** Fija un rango (ej: 8 a 12 reps).
2. **Criterio de Subida de Carga:** Cuando logres completar todas las series marcadas con el extremo superior (ej: 12 reps) manteniendo un **RPE de 8 o inferior (2 reps en reserva)**, es el momento exacto de subir la carga:
   * **Ejercicios multiarticulares (Banca, Sentadilla, Peso Muerto, Remo):** Sube **+2.5 kg a +5 kg** en total.
   * **Ejercicios de aislamiento (Bíceps, Elevaciones laterales, Tríceps):** Sube **+1 kg a +2 kg** o añade 1 repetición más por serie.
3. **¿Estancado (Plateau)?:** Si llevas 3 sesiones sin subir peso ni repeticiones en un ejercicio, aplica una semana de **descarga (-40% de volumen)** o cambia la variante del ejercicio (ej. pasa de Press con barra a Press con mancuernas inclinadas).`;
    }

    // 4. SUEÑO Y RECUPERACIÓN
    if (q.includes('dormid') || q.includes('sueño') || q.includes('cansad') || q.includes('fatiga') || q.includes('descans')) {
      const sleepH = log.sleepHours || 6;
      return `Dormir menos de 7 horas eleva el **cortisol catabólico**, reduce la testosterona transitoria y disminuye la síntesis proteica hasta en un 18%.

💤 **Estrategia para hoy (${sleepH}h de sueño reportadas):**
* **Si te sientes con energía media:** Entrena, pero **reduce 1 serie por ejercicio** y mantén un **RPE 7-8**. No vayas al fallo muscular absoluto para no freír el Sistema Nervioso Central (SNC).
* **Si te sientes exhausto:** Convierte hoy en día de **descanso activo** (caminata ligera de 6.000 a 8.000 pasos y estiramientos). Mañana rendirás el doble.
* **Nutrición clave:** Mantén los carbohidratos en rango para sostener el glucógeno y toma 300-400mg de Magnesio antes de acostarte.`;
    }

    // 5. HIDRATACIÓN
    if (q.includes('agua') || q.includes('hidrat') || q.includes('litro')) {
      const optimalLiters = Math.round((ctx.user.weight * 0.038) * 10) / 10;
      return `Para un atleta de **${ctx.user.weight} kg**, la recomendación de hidratación basada en la *ACSM*:
* **Línea base diaria:** **${optimalLiters} Litros de agua al día** (~${Math.round(optimalLiters * 4)} vasos).
* **Días de entrenamiento intenso:** Añade **+500ml a +750ml** por cada hora de sudoración.
* **Tip pro:** Añade una pizca de sal marina y limón a tu botella de entreno para mantener el balance de sodio-potasio y evitar rampas o bajadas de fuerza intra-entreno.`;
    }

    // 6. CREATINA Y SUPLEMENTACIÓN
    if (q.includes('creatina') || q.includes('suplement') || q.includes('cafeina') || q.includes('whey')) {
      return `Evidencia sobre suplementos de Grado A (máxima evidencia científica):

1. **Creatina Monohidrato (Creapure):**
   * **Dosis:** 3g a 5g diarios (0.05 g/kg de peso). Para ti (${ctx.user.weight} kg) son **~4g/día**.
   * **Timing:** Se acumula por saturación celular; la hora no importa tanto como la constancia diaria (incluso días de descanso). Mejor con algo de carbohidratos o proteína.
2. **Proteína de Suero (Whey):**
   * Útil para alcanzar los **${targets.protein}g diarios** de manera cómoda y con alto contenido en Leucina (activador de la vía mTOR).
3. **Cafeína:**
   * 3-5 mg/kg tomados 45 minutos antes del entrenamiento aumentan la fuerza máxima y retrasan la fatiga percibida.`;
    }

    // 7. RESPUESTA GENERAL CONSULTIVA
    return `Entendido, ${ctx.user.name}. Como tu asistente científico personal de FitScience:

Teniendo en cuenta tus datos:
* **Peso:** ${ctx.user.weight} kg | **Objetivo:** ${ctx.user.goal}
* **Gasto Diario TDEE:** ${targets.calories} kcal | **Proteína diana:** ${targets.protein}g

Cualquier duda sobre cómo ajustar tus calorías de hoy, qué comer en tu siguiente comida, cómo progresar en tus levantamientos o cómo estructurar tu planning, pregúntame directamente. ¡Estoy conectado a tus métricas en tiempo real!`;
  }
}

