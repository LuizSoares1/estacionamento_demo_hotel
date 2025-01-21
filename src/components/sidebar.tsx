import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/headerSidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface SidebarProps {
  isSidebarOpen: boolean;
  isOverlayActive: boolean;
  closeSidebar: () => void;
  onSidebarClick: (panel: string) => void;
  activePanel: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, isOverlayActive, closeSidebar, onSidebarClick, activePanel }) => {
  return (
    <>
      <div
        id="overlay"
        className={`content-overlay ${isOverlayActive ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      <section
        id="sidebar"
        className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-hidden'}`}
      >
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ height: '100%' }}>
          <button
            id="closeButton"
            className="close-button"
            style={{
              alignSelf: 'flex-end',
              fontSize: '1.5em',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={closeSidebar}
          >
            <i className="bi bi-x"></i>
          </button>

          {/* Menu */}
          <ul className="nav nav-pills flex-column mb-auto">
            <li className={`nav-item ${activePanel === 'dashboard' ? 'active' : ''}`}>
              <a
                href="#"
                className={`nav-link ${activePanel === 'dashboard' ? 'active' : ''} text-white`}
                onClick={() => onSidebarClick('dashboard')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </a>
            </li>
            <li className={`nav-item ${activePanel === 'registerVehicle' ? 'active' : ''}`}>
              <a
                href="#"
                className={`nav-link ${activePanel === 'registerVehicle' ? 'active' : ''} text-white`}
                onClick={() => onSidebarClick('registerVehicle')}
              >
                <i className="bi bi-person-vcard me-2"></i>
                Registrar
              </a>
            </li>
            <li className={`nav-item ${activePanel === 'diarists' ? 'active' : ''}`}>
              <a
                href="#"
                className={`nav-link ${activePanel === 'diarists' ? 'active' : ''} text-white`}
                onClick={() => onSidebarClick('diarists')}
              >
                <i className="bi bi-car-front me-2"></i>
                Diárias e Pernoites
              </a>
            </li>
            <li className={`nav-item ${activePanel === 'mensalistas' ? 'active' : ''}`}>
              <a
                href="#"
                className={`nav-link ${activePanel === 'mensalistas' ? 'active' : ''} text-white`}
                onClick={() => onSidebarClick('mensalistas')}
              >
                <i className="bi bi-people me-2"></i>
                Mensalistas
              </a>
            </li>
            <li className={`nav-item ${activePanel === 'lavaJato' ? 'active' : ''}`}>
              <a
                href="#"
                className={`nav-link ${activePanel === 'lavaJato' ? 'active' : ''} text-white`}
                onClick={() => onSidebarClick('lavaJato')}
              >
                <i className="bi bi-water me-2"></i>
                Lava Jato
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
