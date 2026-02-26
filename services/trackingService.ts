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
    threshold: 3,
    ctaContent: 'creative',
  },
  day3: {
    interactions: ['day3_chat_message'],
    threshold: 3,
    ctaContent: 'consultant',
  },
  day4: {
    interactions: ['day4_analysis_complete'],
    threshold: 3,
    ctaContent: 'analysis',
  },
  agents: {
    interactions: ['agents_prompt_copy', 'agents_card_flip'],
    threshold: 3,
    ctaContent: 'agents',
  },
};

// ─── CTA Time Gate ──────────────────────────────────────────────────────
// CTA popups are always enabled (no time gate)
function isCTATimeUnlocked(): boolean {
  return true;
}

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

  // ── Gate: CTA popups never show before Wednesday 20:30 Madrid ──
  if (!isCTATimeUnlocked()) return null;

  // Check if any section threshold is now met
  for (const [sectionKey, config] of Object.entries(CTA_THRESHOLDS)) {
    // Day 1 never triggers CTA popups
    if (sectionKey === 'day1') continue;

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
    day1: '¡Vas por muy buen camino!',
    day2: '¡Tu creatividad con IA no tiene límites!',
    day3: '¿Y si este fuera solo el primer paso?',
    day4: '¡Imagina hacer esto con tu propio negocio!',
    agents: '30 agentes es solo el principio',
  };

  const messages: Record<string, string> = {
    day1: 'Has probado una pequeña muestra de lo que la IA puede hacer. Más de 13.000 profesionales como tú ya se han formado con nosotros en un programa universitario de 8 meses con 60 ECTS y mentores expertos del sector.',
    day2: 'Generar imágenes y vídeos es impresionante, pero en IA Heroes Pro dominarás 10 módulos completos: desde automatización hasta agentes autónomos, con acompañamiento de mentores y una comunidad de 500.000 profesionales.',
    day3: 'Acabas de descubrir cómo la IA puede orientar tu carrera. Reserva una llamada gratuita y descubre cómo 13.000+ profesionales de 40 a 65 años ya están transformando su futuro con nuestro programa.',
    day4: 'Has visto el poder de la IA aplicada a negocios reales. En IA Heroes Pro trabajarás con tu propio negocio durante 8 meses, con mentores como Arnau Ramió y Javier Sáez guiándote paso a paso.',
    agents: 'Estos 30 agentes son un aperitivo. En IA Heroes Pro aprenderás a construir agentes avanzados con memoria, herramientas y automatizaciones — dentro de un programa universitario valorado con 4,6★ en Trustpilot.',
  };

  return {
    title: titles[sectionKey] || '¿Te ha gustado la experiencia?',
    message: messages[sectionKey] || 'Esto es solo el 1% de lo que puedes lograr.',
    url: buildCTAUrl(config.ctaContent),
  };
}
