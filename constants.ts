export const COLORS = {
  primary: '#243F4C', // Dark Blue/Teal
  accent: '#FF2878', // Pink/Magenta
  white: '#FFFFFF',
  background: '#F8FAFC',
};

export const IA_HEROES_CONTEXT = `
# Resumen del Programa Universitario en Inteligencia Artificial: IA Heroes Pro
A continuación se presenta un resumen detallado del programa de formación **IA Heroes Pro**, ofrecido por **Learning Heroes**.

## Descripción General
**IA Heroes Pro** es un programa universitario diseñado para capacitar a los participantes en el dominio de la inteligencia artificial, con un enfoque práctico en la aplicación de herramientas como **ChatGPT**, **Copilot** y la creación de agentes de IA. El objetivo principal es mejorar la productividad, optimizar el tiempo y aumentar el valor profesional de los estudiantes.

## Características Principales
| Característica | Descripción |
| :--- | :--- |
| **Nombre** | IA Heroes Pro |
| **Duración** | 8 meses (5 meses bloque inmersivo + 3 meses bloque avanzado) |
| **Formato** | Híbrido: clases en vivo, grabadas y tutorías. |
| **Titulación** | Título universitario propio avalado por la **Western Europe University** (60 ECTS). |
| **Inicio** | Próxima convocatoria en **Marzo**. |

## Contenido (7 Módulos)
1. Introducción a la era exponencial
2. ¿Qué es la IA?
3. Prompt Engineering y creación de agentes
4. Creación de Chatbots profesionales
5. IA Generativa en el mundo audiovisual
6. El futuro del trabajo
7. Introducción a la venta de servicios de IA Generativa

## Equipo Docente
Xavier Recio (CEO), Arnau Ramió (Dir. Académico), Javier Sáez (Dir. Programa), Javier de Puelles, Alex Fernández.

## Valoración
"Excelente" en Trustpilot (+1,800 opiniones).
`;

export const AGENT_ANALYSIS_SYSTEM_PROMPT = `
Eres un experto consultor de negocios e Inteligencia Artificial.
Tu tarea es analizar un negocio basándote en la información encontrada en su web (proporcionada por search grounding).
IMPORTANTE: NO incluyas tu proceso de pensamiento ("thought I will search...") en la respuesta final. Empieza directamente con el análisis en español.

Debes proponer 3 o 4 agentes de IA que ofrezcan el mayor retorno de inversión (ROI) para ese negocio específico.
Para cada agente, debes proporcionar el "System Prompt" en formato Markdown.

ESTRUCTURA DE RESPUESTA REQUERIDA:

1. Breve introducción del análisis del negocio (1 párrafo).

2. Para cada agente, usa este formato exacto:

### Agente [Emoji] [Nombre del Agente]
**Impacto en Negocio:** [Frase MUY LLAMATIVA sobre el valor/ahorro/ventas, estilo marketing]

\`\`\`markdown
# ROL
[Rol del agente]

# CONTEXTO
[Contexto del negocio y situación]

# OBJETIVO
[Objetivo principal del agente]

# INSTRUCCIONES
[Lista de instrucciones paso a paso]

# LIMITACIONES
[Lo que el agente NO debe hacer]
\`\`\`

Usa un tono profesional, persuasivo pero accesible para un empresario de 40-60 años.
`;