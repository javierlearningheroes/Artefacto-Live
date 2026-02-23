import React from 'react';
import { COLORS } from '../constants';
import { isCTABannerVisible } from '../utils/unlockSystem';
import { useAdmin } from '../contexts/AdminContext';
import { trackCTAClick, buildCTAUrl } from '../services/trackingService';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack }) => {
  const { isAdmin } = useAdmin();
  const showHeader = !!title || !!onBack;
  const showBanner = isCTABannerVisible(isAdmin);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-slate-800">
      {/* Sticky Promo Banner — visible from Wednesday 25 Feb 20:30 CET */}
      {showBanner && (
        <a href={buildCTAUrl('banner')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTAClick('banner')} className="sticky top-0 z-50 w-full text-center py-3 px-4 font-bold text-white shadow-md transition-colors hover:bg-opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: COLORS.primary }}>
          <span className="text-xs md:text-base truncate md:overflow-visible">🚀 ¿Quieres dominar la IA? Únete al programa IA Heroes Pro</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      )}

      {/* Header */}
      {showHeader && (
        <header className={`bg-white border-b border-slate-200 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between shadow-sm sticky z-40 ${showBanner ? 'top-[48px]' : 'top-0'}`}>
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
          <a
            href="https://classroom.learningheroes.com/ia-heroes-14-ln?utm_source=artefacto&utm_medium=platform&utm_campaign=ia-heroes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 rounded-lg text-white text-xs md:text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 flex-shrink-0 shadow-sm"
            style={{ backgroundColor: COLORS.accent }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className="hidden md:inline">Aula Virtual</span>
            <span className="md:hidden">Aula</span>
          </a>
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
    </div>
  );
};

export default Layout;
