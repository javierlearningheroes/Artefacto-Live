import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Home from './components/Home';
import Day1 from './components/Day1';
import Day2 from './components/Day2';
import Day4 from './components/Day4';
import AgentCatalog from './components/AgentCatalog';

import BackgroundGradient from './components/BackgroundGradient';
import { AppRoute } from './types';
import { AdminProvider } from './contexts/AdminContext';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.HOME);

  const renderContent = () => {
    switch (route) {
      case AppRoute.HOME:
        return <Home setRoute={setRoute} />;
      case AppRoute.DAY_1:
        return <Day1 setRoute={setRoute} />;
      case AppRoute.DAY_2:
        return <Day2 setRoute={setRoute} />;
      case AppRoute.DAY_3:
        // Day 3 is a redirect to HubSpot — handled in Home.tsx onClick
        window.open('https://programas.learningheroes.com/ia-heroes/reserva-llamada?utm_campaign=IAH14&utm_source=Live&utm_medium=artefacto&utm_content=day3', '_blank');
        setRoute(AppRoute.HOME);
        return <Home setRoute={setRoute} />;
      case AppRoute.DAY_4:
        return <Day4 setRoute={setRoute} />;
      case AppRoute.AGENTS:
        return <AgentCatalog setRoute={setRoute} />;
      default:
        return <Home setRoute={setRoute} />;
    }
  };

  return (
    <AdminProvider>
      <div className="app-container relative min-h-screen">
        <BackgroundGradient />
        <div className="relative" style={{ zIndex: 1 }}>
          {renderContent()}
        </div>

        <Analytics />
        <SpeedInsights />
      </div>
    </AdminProvider>
  );
};

export default App;
