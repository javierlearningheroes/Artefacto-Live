import React, { useState } from 'react';
import Home from './components/Home';
import Day1 from './components/Day1';
import Day2 from './components/Day2';
import Day3 from './components/Day3';
import Day4 from './components/Day4';
import { AppRoute } from './types';

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
        return <Day3 setRoute={setRoute} />;
      case AppRoute.DAY_4:
        return <Day4 setRoute={setRoute} />;
      default:
        return <Home setRoute={setRoute} />;
    }
  };

  return (
    <div className="app-container">
      {renderContent()}
    </div>
  );
};

export default App;
