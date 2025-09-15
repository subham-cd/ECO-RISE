import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import DigitalTwin from './pages/DigitalTwin';
import EcoQuests from './pages/EcoQuests';
import Leaderboard from './pages/Leaderboard';
import Badges from './pages/Badges';
import RippleMap from './pages/RippleMap';

export type PageType = 'landing' | 'digital-twin' | 'quests' | 'leaderboard' | 'badges' | 'ripple-map';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStartJourney={() => setCurrentPage('digital-twin')} />;
      case 'digital-twin':
        return <DigitalTwin />;
      case 'quests':
        return <EcoQuests />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'badges':
        return <Badges />;
      case 'ripple-map':
        return <RippleMap />;
      default:
        return <DigitalTwin />;
    }
  };

  if (currentPage === 'landing') {
    return renderPage();
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;