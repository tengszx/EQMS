import React, { useState } from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import '../../../css/styles/admin/Headerboard.css';

const Headerboard = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [logoutTimeout, setLogoutTimeout] = useState(null);
  const [notificationTimeout, setNotificationTimeout] = useState(null);

  const handleMouseEnterLogout = () => {
    if (logoutTimeout) clearTimeout(logoutTimeout);
    setShowLogout(true);
  };

  const handleMouseLeaveLogout = () => {
    const timeout = setTimeout(() => {
      setShowLogout(false);
    }, 2000); // 2 seconds timeout
    setLogoutTimeout(timeout);
  };

  const handleMouseEnterNotifications = () => {
    if (notificationTimeout) clearTimeout(notificationTimeout);
    setShowNotifications(true);
  };

  const handleMouseLeaveNotifications = () => {
    const timeout = setTimeout(() => {
      setShowNotifications(false);
    }, 2000); // 2 seconds timeout
    setNotificationTimeout(timeout);
  };

  return (
    <div className="header-container">
      <div className="dashboard-header">
        <div className="header-left">
          {/* Removed the Main Board heading */}
        </div>
        <div className="header-right">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="notification-container"
               onMouseEnter={handleMouseEnterNotifications}
               onMouseLeave={handleMouseLeaveNotifications}>
            <Bell className="notification-icon" size={20} />
            <span className="notification-badge">2</span>
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-item">Seen</div>
                <div className="notification-item">Not Seen</div>
              </div>
            )}
          </div>
          <div className="profile-container"
               onMouseEnter={handleMouseEnterLogout}
               onMouseLeave={handleMouseLeaveLogout}>
            <img src="/images/profile.png" alt="Profile" className="profile-image" />
            <div 
              className={`notification-dropdown logout-dropdown ${showLogout ? 'visible' : ''}`} // Changed class
              onMouseEnter={handleMouseEnterLogout} 
              onMouseLeave={handleMouseLeaveLogout}
            >
              <LogOut className="logout-icon" size={16} />
              <span className="logout-text">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Headerboard;