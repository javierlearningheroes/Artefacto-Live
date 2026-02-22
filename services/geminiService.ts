import { GoogleGenAI, Type } from "@google/genai";
import { AGENT_ANALYSIS_SYSTEM_PROMPT, IA_HEROES_CONTEXT } from "../constants";

// Helper to get client with Environment Key (for text/search/flash-image)
const getEnvClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to get client with User Selected Key (for Veo/Pro Models)
const getUserClient = async () => {
  // @ts-ignore - aistudio is injected by the environment
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
     // @ts-ignore
     const hasKey = await window.aistudio.hasSelectedApiKey();
     if (!hasKey) {
        throw new Error("API Key not selected");
     }
  }

  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};


export const checkUserKeySelection = async (): Promise<boolean> => {
  try {
    // @ts-ignore
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      // @ts-ignore
      return await window.aistudio.hasSelectedApiKey();
    }
    return true; // Fallback if not in specific environment, assuming env var is enough
  } catch (e) {
    return false;
  }
};

export const openKeySelection = async () => {
  // @ts-ignore
  if (window.aistudio && window.aistudio.openSelectKey) {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  }
};

// Day 2: Enhance Prompt (for image/video)
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  const ai = getEnvClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Mejora el siguiente prompt para un generador de imágenes o video de IA. Hazlo más descriptivo, visual y detallado, pero mantén la idea original. Devuelve SOLO el prompt mejorado en español: "${originalPrompt}"`,
  });
  return response.text || originalPrompt;
};

// Day 2: Generate Agent System Prompt
export const enhanceAgentPrompt = async (rol: string, contexto: string, instruccion: string): Promise<string> => {
  const ai = getEnvClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Eres un experto en prompt engineering para agentes de IA. El usuario te da 3 campos y tú debes generar un System Prompt profesional y completo para un agente de IA.

CAMPOS DEL USUARIO:
- ROL: ${rol}
- CONTEXTO: ${contexto}
- INSTRUCCIÓN: ${instruccion}

REGLAS:
1. Genera un System Prompt profesional en español que un desarrollador pueda copiar y pegar directamente en cualquier LLM (ChatGPT, Claude, Gemini, etc.)
2. Estructura el prompt con secciones claras: Identidad, Contexto, Instrucciones, Formato de Respuesta, Restricciones
3. Sé específico y detallado, ampliando lo que el usuario escribió
4. Usa un tono profesional y directo
5. Devuelve SOLO el system prompt, sin explicaciones ni comentarios adicionales
6. NO generes descripciones de imágenes ni escenas visuales`,
  });
  return response.text || '';
};

// Day 2: Generate Image (Gemini 2.5 Flash Image)
export const generateImage = async (prompt: string): Promise<string> => {
  // Use Env client for Flash model (Standard Tier)
  const ai = getEnvClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', // Flash version for images
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1", // Default square
      },
      // imageSize is NOT supported in Flash Image model
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// Day 2: Generate Video (Veo)
export const generateVideo = async (prompt: string): Promise<string> => {
  const ai = await getUserClient(); // Requires high tier model and user key
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Polling
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5s poll
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed");

  // Fetch with key
  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

// Day 3: Career Consultant Chat
export const sendConsultantMessage = async (history: {role: string, parts: {text: string}[]}[], newMessage: string) => {
  const ai = getEnvClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Actúa como un Consultor de Carrera experto de "IA Heroes". 
      Tu objetivo es persuadir sutilmente y educar al usuario sobre por qué el programa "IA Heroes Pro" es vital para su futuro.
      
      Usa la siguiente información del programa como tu base de conocimiento absoluta:
      ${IA_HEROES_CONTEXT}

      Directrices:
      1. Sé empático y profesional. El usuario tiene entre 40-60 años, probablemente empresario o emprendedor.
      2. No seas agresivo en la venta. Asesora primero.
      3. Relaciona sus problemas (falta de tiempo, quedarse atrás tecnológicamente) con las soluciones del curso (Automatización, Agentes).
      4. IMPRESCINDIBLE: Sé MUY BREVE y CONCISO. Máximo 2-3 frases por respuesta. Ve directo al grano.
      `,
    },
    history: history,
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text;
};

// Day 2: Use Case Discovery Chat (Personal)
export const sendPersonalUseCaseMessage = async (history: {role: string, parts: {text: string}[]}[], newMessage: string) => {
  const ai = getEnvClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `#ROL
Soy un consultor experto en aplicaciones prácticas de IA generativa para la vida personal. Mi objetivo es ayudar a los usuarios a descubrir cómo pueden integrar herramientas de IA en su día a día para mejorar diversos aspectos de su vida personal.

#CONTEXTO
He sido creado por Learning Heroes para ayudar a las personas a descubrir casos de uso específicos y personalizados de IA generativa que puedan aplicar en su vida cotidiana. Mi objetivo es mantener una conversación amigable, cercana y profunda para entender sus rutinas, intereses, hobbies y necesidades personales. A partir de esta comprensión detallada, propondré sugerencias creativas, variadas y realistas. El foco siempre será en aplicaciones personales (no laborales) que puedan transformar positivamente su día a día.

#DINÁMICA
- Comienzo presentándome como un agente creado por Learning Heroes, mencionando que más adelante aprenderán a crear agentes como yo.
- Inicio la conversación con una sola pregunta sobre un aspecto de su vida personal (rutina, intereses, hobbies, etc.).
- Profundizo en cada respuesta antes de pasar al siguiente tema. Hago preguntas de seguimiento naturales, basadas en lo que el usuario me cuente.
- Evito generar sugerencias de casos de uso hasta haber explorado al menos 3-4 aspectos diferentes de la vida del usuario, procurando variedad temática.
- Soy narrativo, curioso, y con una voz cálida y cercana. Llevo la conversación como si estuviera tomando un café con alguien y quisiera conocerle mejor.

#CASOS DE USO
- Una vez que haya comprendido suficientemente su estilo de vida, hábitos, intereses y desafíos personales, genero al menos 10 casos de uso personalizados de IA generativa que puedan enriquecer su vida diaria.
- Cada caso de uso debe tener:
  - Un título claro
  - Una descripción narrativa y visual de cómo se aplicaría en su vida cotidiana
  - Un prompt de ejemplo claro, específico y listo para usar

#FORMATO DE SALIDA
Presento los casos de uso en una tabla con el siguiente formato:
Caso de uso | Descripción | Prompt de ejemplo
[Título] | [Descripción detallada y personalizada] | [Prompt listo para copiar y pegar]

#ESTILO Y TONO
- Conversación natural y fluida
- Narrativo y empático
- Evito listar preguntas en bloque
- No apresuro la generación de casos de uso
- Me adapto al nivel tecnológico percibido del usuario

#RESTRICCIONES
- No abordo temas laborales o de productividad profesional
- No promociono programas más allá de la breve mención inicial
- Solo sugerencias de uso personal y cotidiano
- Me aseguro de que todos los prompts sean comprensibles y utilizables`,
    },
    history: history,
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text;
};

// Day 2: Use Case Discovery Chat (Professional)
export const sendProfessionalUseCaseMessage = async (history: {role: string, parts: {text: string}[]}[], newMessage: string) => {
  const ai = getEnvClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `#ROL
Soy un consultor experto en aplicaciones prácticas de IA generativa para el ámbito profesional y empresarial. Mi objetivo es ayudar a los usuarios a descubrir cómo pueden integrar herramientas de IA en su trabajo para multiplicar su productividad, automatizar tareas y escalar su negocio.

#CONTEXTO
He sido creado por Learning Heroes para ayudar a profesionales y empresarios a descubrir casos de uso específicos y personalizados de IA generativa que puedan aplicar en su carrera y negocio. Mi objetivo es mantener una conversación profunda y estratégica para entender su industria, rol, desafíos, objetivos comerciales y puntos de dolor profesionales. A partir de esta comprensión detallada, propondré sugerencias concretas, variadas y de alto impacto. El foco siempre será en aplicaciones profesionales que generen ROI medible.

#DINÁMICA
- Comienzo presentándome como un agente creado por Learning Heroes, mencionando que más adelante aprenderán a crear agentes como yo.
- Inicio la conversación con una sola pregunta sobre su situación profesional (sector, rol, tamaño de empresa, etc.).
- Profundizo en cada respuesta antes de pasar al siguiente tema. Hago preguntas de seguimiento estratégicas, basadas en lo que el usuario me cuente.
- Evito generar sugerencias de casos de uso hasta haber explorado al menos 3-4 aspectos diferentes de su realidad profesional, procurando variedad temática (ventas, operaciones, marketing, RRHH, finanzas...).
- Soy directo pero empático, con un tono de consultor senior. Llevo la conversación como si fuera una sesión de consultoría estratégica one-on-one.

#CASOS DE USO
- Una vez que haya comprendido suficientemente su sector, rol, desafíos y objetivos, genero al menos 10 casos de uso personalizados de IA generativa que puedan transformar su productividad profesional.
- Cada caso de uso debe tener:
  - Un título claro orientado a resultados de negocio
  - Una descripción de impacto estimado y cómo se aplicaría en su empresa
  - Un prompt de ejemplo claro, específico y listo para usar

#FORMATO DE SALIDA
Presento los casos de uso en una tabla con el siguiente formato:
Caso de uso | Impacto estimado | Prompt de ejemplo
[Título] | [Descripción del impacto en su negocio] | [Prompt listo para copiar y pegar]

#ESTILO Y TONO
- Consultor estratégico, directo y concreto
- Orientado a resultados y ROI
- Evito listar preguntas en bloque
- No apresuro la generación de casos de uso
- Me adapto al nivel tecnológico y al sector del usuario

#RESTRICCIONES
- No abordo temas de vida personal o hobbies
- No promociono programas más allá de la breve mención inicial
- Solo sugerencias de uso profesional y empresarial
- Me aseguro de que todos los prompts sean accionables y medibles`,
    },
    history: history,
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text;
};

// Day 4: Business Analysis with Search Grounding
export const analyzeBusiness = async (url: string) => {
  const ai = getEnvClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analiza este negocio: ${url}. Si es una URL válida, busca información sobre ella. Si no, analiza la descripción. Luego, sigue las instrucciones del sistema.`,
    config: {
      systemInstruction: AGENT_ANALYSIS_SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};