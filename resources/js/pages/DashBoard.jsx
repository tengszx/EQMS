import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ArrowLeft } from 'lucide-react'; // Correct import syntax
import '../../css/styles/dash/DashBoard.css';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleTheme = (isDark) => {
    setDarkMode(isDark);
    // You could also save this preference to localStorage
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/images/EQMS_LOGO-removebg.png" alt="Logo" className="logo" />
        </div>
        
        <div className="sidebar-sections">
          <div className="section-title">MAIN</div>
          <div className="sidebar-item active">
            <div className="icon">
              <i className="home-icon"></i>
            </div>
            <span>Dashboard</span>
          </div>
          
          <div className="sidebar-item">
            <div className="icon">
              <i className="document-icon"></i>
            </div>
            <span>Document Control</span>
          </div>
          
          <div className="sidebar-item">
            <div className="icon">
              <i className="compliance-icon"></i>
            </div>
            <span>Compliance & Standard</span>
          </div>
          
          <div className="sidebar-item">
            <div className="icon">
              <i className="audit-icon"></i>
            </div>
            <span>Audits & Inspection</span>
          </div>
          
          <div className="section-title">SETTINGS</div>
          <div className="sidebar-item">
            <div className="icon">
              <i className="notification-icon"></i>
            </div>
            <span>Notification</span>
          </div>
          
          <div className="sidebar-item">
            <div className="icon">
              <i className="settings-icon"></i>
            </div>
            <span>Settings</span>
          </div>
        </div>
        
        <div className="theme-toggle">
          <button 
            className={`light-btn ${!darkMode ? 'active' : ''}`} 
            onClick={() => toggleTheme(false)}
          >
            <i className="light-icon"></i> Light
          </button>
          <button 
            className={`dark-btn ${darkMode ? 'active' : ''}`} 
            onClick={() => toggleTheme(true)}
          >
            <i className="dark-icon"></i> Dark
          </button>
        </div>
      </div>
      
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? 
          <ArrowLeft className="toggle-icon" /> : 
          <ArrowRight className="toggle-icon" />
        }
      </div>
      
      <div className="main-content">
        {/* Main content area */}
      </div>
    </div>
  );
};

export default Dashboard;

// Mount the application
const container = document.getElementById('dashboard-root');
const root = createRoot(container);
root.render(<Dashboard />);