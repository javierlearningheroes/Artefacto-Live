import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { useAdmin } from '../contexts/AdminContext';
import { trackCTAClick, buildCTAUrl } from '../services/trackingService';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
}

const POST_EVENT_KEY = 'ia-heroes-post-event-shown';

const Layout: React.FC<LayoutProps> = ({ children, title, onBack }) => {
  const { isAdmin } = useAdmin();
  const showHeader = !!title || !!onBack;

  // ─── Post-event popup (shows immediately on first visit) ──────
  const [showPostEvent, setShowPostEvent] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(POST_EVENT_KEY) !== 'true') {
        setShowPostEvent(true);
        sessionStorage.setItem(POST_EVENT_KEY, 'true');
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-slate-800">
      {/* Sticky Promo Banner */}
      <a href={buildCTAUrl('banner-post')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTAClick('banner-post')} className="sticky top-0 z-50 w-full text-center py-3 px-4 font-bold text-white shadow-md transition-colors hover:bg-opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: COLORS.primary }}>
        <span className="text-xs md:text-base truncate md:overflow-visible">🚀 ¿Quieres dominar la IA? Reserva tu llamada gratuita</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>

      {/* Floating Aula Virtual Button — always visible, top-right */}
      <a
        href="https://classroom.learningheroes.com/ia-heroes-14-ln?utm_source=artefacto&utm_medium=platform&utm_campaign=ia-heroes"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-3 md:right-5 z-50 flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-full text-white text-xs md:text-sm font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl top-[56px] md:top-[58px]"
        style={{ backgroundColor: COLORS.accent }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
        <span className="hidden md:inline">Aula Virtual</span>
        <span className="md:hidden">Aula</span>
      </a>

      {/* Header */}
      {showHeader && (
        <header className="bg-white border-b border-slate-200 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between shadow-sm sticky z-40 top-[48px]">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {onBack && (
              <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition flex-shrink-0" aria-label="Volver">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
            )}
            <h1 className="text-lg md:text-3xl font-bold truncate" style={{ color: COLORS.primary }}>
              {title}
            </h1>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-4xl w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs md:text-sm border-t border-slate-200 mt-auto">
        <p>2026 @ Learning Heroes.</p>
      </footer>

      {/* Post-Event Popup — shows immediately on page load */}
      {showPostEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPostEvent(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-fade-in-up">
            {/* Decorative Header */}
            <div className="h-36 bg-gradient-to-r from-[#243F4C] to-[#2a4d5e] relative flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF2878] rounded-full blur-3xl opacity-15 -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-10 -ml-10 -mb-10" />
              <span className="text-6xl relative z-10 mb-2">🎉</span>
              <p className="text-white/80 text-sm font-medium relative z-10">IA Heroes Live 14</p>
              <button onClick={() => setShowPostEvent(false)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                ¡Gracias por este evento increíble!
              </h2>
              <p className="text-slate-600 mb-3 text-base leading-relaxed">
                Ha sido una semana inolvidable descubriendo juntos el poder de la IA generativa. Todas las herramientas que has probado aquí siguen disponibles para los alumnos de IA Heroes Pro.
              </p>
              <p className="text-slate-600 mb-6 text-base leading-relaxed">
                <span className="font-semibold text-[#243F4C]">¡Enhorabuena a todos los que ya se han unido!</span> Si tú también quieres dar el paso, reserva tu llamada gratuita y descubre cómo transformar tu carrera con IA.
              </p>

              <div className="space-y-3">
                <a href={buildCTAUrl('post-event')} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackCTAClick('post-event')}
                  className="block w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:brightness-110 transition-all transform hover:scale-[1.02]"
                  style={{ backgroundColor: COLORS.accent }}>
                  📞 Reserva tu llamada gratuita
                </a>
                <button onClick={() => setShowPostEvent(false)} className="block w-full py-3 px-6 rounded-xl font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                  Seguir explorando las herramientas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
