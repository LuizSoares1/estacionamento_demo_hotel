import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/headerSidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="headerContainer p-3 bg-dark text-white justify-content-between d-flex">
      <div className="menu-container d-flex align-items-center">
        <button 
          id="toggleButton"
          className="navbar-toggler"
          type="button"
          onClick={onToggleSidebar}
        > 
          <i className="bi bi-list" style={{ fontSize: '2em' }}></i> 
        </button>
        <h2 className="my-0 mx-2">LS Park</h2>
      </div>
      <div className="user-container d-flex row mx-1">
        <div className="user-info d-flex align-items-center"
            style={{ cursor: 'pointer' }}>
          <p className="px-2 m-0"><strong>Admin</strong></p>
          <div>
            <i className="bi bi-person-circle" style={{ fontSize: '2rem' }}></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
