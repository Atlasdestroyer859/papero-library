import React from 'react';
import { Home, BookOpen, Library, Clock, Info, LogOut, Book } from 'lucide-react';

const Sidebar = ({ activeView, setView, onLogout }) => {
  const menu = [
    { id: 'home', icon: <Home size={24} color="white" />, label: 'Home' },
    { id: 'products', icon: <BookOpen size={24} color="white" />, label: 'Store' },
    { id: 'library', icon: <Library size={24} color="white" />, label: 'Library' },
    { id: 'focus', icon: <Clock size={24} color="white" />, label: 'Focus' },
    { id: 'profile', icon: <span style={{ fontSize: '24px' }}>👤</span>, label: 'Profile' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoBox}>
        <Book color="white" size={32} />
      </div>

      <div style={styles.navGroup}>
        {menu.map((item) => (
          <div
            key={item.id}
            className="nav-item"
            onClick={() => setView(item.id)}
            style={{
              backgroundColor: activeView === item.id ? 'rgba(255,255,255,0.25)' : 'transparent',
              border: activeView === item.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
            }}
          >
            {item.icon}
            <span className="tooltip">{item.label}</span>
          </div>
        ))}
      </div>

      <div onClick={onLogout} className="nav-item" style={{ marginTop: 'auto' }}>
        <LogOut size={24} color="rgba(255,255,255,0.8)" />
        <span className="tooltip">Logout</span>
      </div>

      <style>{`
        .nav-item {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .tooltip {
          position: absolute;
          left: 65px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, transform 0.2s;
          transform: translateX(-10px);
          white-space: nowrap;
          pointer-events: none;
          z-index: 2000;
        }

        .nav-item:hover .tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
};

const styles = {
  sidebar: {
    height: '100%',
    width: '90px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 10px',
    backgroundColor: '#FF6B6B',
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
    zIndex: 1001,
    overflow: 'visible' // Allow tooltips to pop out
  },
  logoBox: {
    marginBottom: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    width: '50px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    backdropFilter: 'blur(5px)'
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
    width: '100%'
  }
};

export default Sidebar;