/**
 * Tracking Service — Interaction tracking, GTM events, and CTA trigger logic
 *
 * Tracks user interactions per section and triggers CTA popups when thresholds are met.
 * Pushes events to GTM dataLayer for GA4 aggregate analytics.
 * Stores counts in sessionStorage to persist within the same session.
 */

// ─── Types ──────────────────────────────────────────────────────────────
export type InteractionType =
  | 'day1_slide_view'
  | 'day1_card_flip'
  | 'day2_prompt_enhance'
  | 'day2_image_generate'
  | 'day2_video_generate'
  | 'day3_chat_message'
  | 'day4_analysis_complete'
  | 'agents_prompt_copy'
  | 'agents_card_flip';

export interface InteractionCounts {
  [key: string]: number;
}

// ─── CTA Trigger Thresholds ─────────────────────────────────────────────
// Each section triggers a CTA popup after N interactions
const CTA_THRESHOLDS: Record<string, { interactions: InteractionType[]; threshold: number; ctaContent: string }> = {
  day1: {
    interactions: ['day1_slide_view', 'day1_card_flip'],
    threshold: 5,
    ctaContent: 'slides',
  },
  day2: {
    interactions: ['day2_prompt_enhance', 'day2_image_generate', 'day2_video_generate'],
    threshold: 2,
    ctaContent: 'creative',
  },
  day3: {
    interactions: ['day3_chat_message'],
    threshold: 2,
    ctaContent: 'consultant',
  },
  day4: {
    interactions: ['day4_analysis_complete'],
    threshold: 1,
    ctaContent: 'analysis',
  },
  agents: {
    interactions: ['agents_prompt_copy', 'agents_card_flip'],
    threshold: 3,
    ctaContent: 'agents',
  },
};

// ─── Storage Keys ───────────────────────────────────────────────────────
const STORAGE_KEY = 'ia-heroes-interactions';
const CTA_SHOWN_KEY = 'ia-heroes-cta-shown';

// ─── Internal State ─────────────────────────────────────────────────────
let interactionCounts: InteractionCounts = {};
let ctaShownSections: Set<string> = new Set();

// Initialize from sessionStorage
function initialize() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) interactionCounts = JSON.parse(stored);

    const ctaStored = sessionStorage.getItem(CTA_SHOWN_KEY);
    if (ctaStored) ctaShownSections = new Set(JSON.parse(ctaStored));
  } catch {
    // Ignore storage errors
  }
}
initialize();

// ─── Save State ─────────────────────────────────────────────────────────
function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(interactionCounts));
    sessionStorage.setItem(CTA_SHOWN_KEY, JSON.stringify(Array.from(ctaShownSections)));
  } catch {
    // Ignore storage errors
  }
}

// ─── GTM DataLayer Push ─────────────────────────────────────────────────
function pushToDataLayer(eventName: string, params: Record<string, string | number>) {
  try {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: eventName,
      ...params,
    });
  } catch {
    // Ignore GTM errors
  }
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Track an interaction and push to GTM.
 * Returns the section key if this interaction triggers a CTA popup (first time only).
 */
export function trackInteraction(type: InteractionType): string | null {
  // Increment count
  interactionCounts[type] = (interactionCounts[type] || 0) + 1;
  persist();

  // Push to GTM
  pushToDataLayer('artefacto_interaction', {
    interaction_type: type,
    interaction_count: interactionCounts[type],
  });

  // Check if any section threshold is now met
  for (const [sectionKey, config] of Object.entries(CTA_THRESHOLDS)) {
    // Skip if CTA already shown for this section
    if (ctaShownSections.has(sectionKey)) continue;

    // Sum all interaction types for this section
    const total = config.interactions.reduce((sum, t) => sum + (interactionCounts[t] || 0), 0);

    if (total >= config.threshold) {
      ctaShownSections.add(sectionKey);
      persist();

      // Push CTA trigger event to GTM
      pushToDataLayer('artefacto_cta_trigger', {
        cta_section: sectionKey,
        cta_content: config.ctaContent,
        interaction_total: total,
      });

      return sectionKey;
    }
  }

  return null;
}

/**
 * Track a CTA click (when user clicks the reservation link)
 */
export function trackCTAClick(source: string) {
  pushToDataLayer('artefacto_cta_click', {
    cta_source: source,
  });
}

/**
 * Build the full CTA URL with UTM parameters
 */
export function buildCTAUrl(trigger: string): string {
  const baseUrl = 'https://programas.learningheroes.com/ia-heroes/reserva-llamada';
  const params = new URLSearchParams({
    utm_campaign: 'IAH14',
    utm_source: 'Live',
    utm_medium: 'artefacto',
    utm_content: trigger,
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Build CTA URL for Day 3 redirect (consultant → reservation call)
 */
export function buildDay3CTAUrl(): string {
  return buildCTAUrl('consultant-day3');
}

/**
 * Get all interaction counts (for admin panel)
 */
export function getInteractionCounts(): InteractionCounts {
  return { ...interactionCounts };
}

/**
 * Get which sections have triggered CTAs
 */
export function getCTAShownSections(): string[] {
  return Array.from(ctaShownSections);
}

/**
 * Reset all tracking (for testing)
 */
export function resetTracking() {
  interactionCounts = {};
  ctaShownSections = new Set();
  persist();
}

/**
 * Get CTA content config for a section
 */
export function getCTAConfig(sectionKey: string) {
  const config = CTA_THRESHOLDS[sectionKey];
  if (!config) return null;

  const titles: Record<string, string> = {
    day1: '¡Estás absorbiendo conocimiento a toda velocidad!',
    day2: '¡Tu creatividad con IA es impresionante!',
    day3: '¡Gran conversación con tu consultor IA!',
    day4: '¡Análisis completado con éxito!',
    agents: '¡Ya tienes un equipo de agentes IA!',
  };

  const messages: Record<string, string> = {
    day1: 'Imagina dominar estos conceptos en profundidad. En IA Heroes Pro tendrás 8 meses de formación universitaria con titulación.',
    day2: 'Esto es solo el comienzo. En IA Heroes Pro aprenderás técnicas avanzadas de generación con todas las herramientas del mercado.',
    day3: 'La IA puede transformar tu carrera. Reserva una llamada gratuita con nuestro equipo para diseñar tu plan personalizado.',
    day4: 'Has visto cómo la IA puede analizar y optimizar un negocio real. En IA Heroes Pro, lo harás con el tuyo propio.',
    agents: 'Ya tienes 30 agentes listos. En IA Heroes Pro aprenderás a crear agentes avanzados con herramientas, memoria y automatización.',
  };

  return {
    title: titles[sectionKey] || '¿Te ha gustado la experiencia?',
    message: messages[sectionKey] || 'Esto es solo el 1% de lo que puedes lograr.',
    url: buildCTAUrl(config.ctaContent),
  };
}
