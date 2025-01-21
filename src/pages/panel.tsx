import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import Dashboard from '../components/dashboard';
import RegisterVehicle from '../components/registerVehicle';
import Diarists from '../components/diarists';
import Mensalistas from '../components/mensalists';
import LavaJato from '../components/lavaJato';
import '../styles/headerSidebar.css';
import '../styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';

const Panel: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(window.innerWidth >= 768);
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);
  const [activePanel, setActivePanel] = useState<string>('dashboard');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
    setIsOverlayActive(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setIsOverlayActive(false);
  };

  const handleSidebarClick = (panel: string) => {
    setActivePanel(panel);
  };

  useEffect(() => {
    if (!activePanel) {
      setActivePanel('dashboard');
    }
  }, [activePanel]);

  return (
    <div>
      <Header onToggleSidebar={toggleSidebar}/>
      <main id="mainContent" className="main-content d-flex" style={{ width: '100%' }}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isOverlayActive={isOverlayActive}
          closeSidebar={closeSidebar}
          onSidebarClick={handleSidebarClick}
          activePanel={activePanel}
        />
        
        {activePanel === 'dashboard' && <Dashboard />}
        {activePanel === 'registerVehicle' && <RegisterVehicle />}
        {activePanel === 'diarists' && <Diarists />}
        {activePanel === 'mensalistas' && <Mensalistas />}
        {activePanel === 'lavaJato' && <LavaJato />}
      </main>
    </div>
  );
};

export default Panel;
