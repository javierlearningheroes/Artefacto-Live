import React from 'react';
import { COLORS } from '../constants';
import { isCTABannerVisible } from '../utils/unlockSystem';
import { useAdmin } from '../contexts/AdminContext';

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
        <a href="https://live.learningheroes.com/iah-artefact" target="_blank" rel="noopener noreferrer" className="sticky top-0 z-50 w-full text-center py-3 px-4 font-bold text-white shadow-md transition-colors hover:bg-opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: COLORS.accent }}>
          <span className="text-xs md:text-base truncate md:overflow-visible">🚀 ¿Quieres dominar la IA? Únete al programa IA Heroes Pro</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      )}

      {/* Header */}
      {showHeader && (
        <header className={`bg-white border-b border-slate-200 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between shadow-sm sticky z-40 ${showBanner ? 'top-[48px]' : 'top-0'}`}>
          <div className="flex items-center gap-3 md:gap-4 w-full">
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
    </div>
  );
};

export default Layout;
