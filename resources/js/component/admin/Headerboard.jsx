import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import '../../../css/styles/admin/Headerboard.css';

const HeaderBoard = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    { id: 1, text: "New message received", time: "5 minutes ago", isRead: false },
    { id: 2, text: "Your report is ready", time: "2 hours ago", isRead: true },
    { id: 3, text: "System update completed", time: "Yesterday", isRead: true },
  ];

  return (
    <div className="header-board">
      <div className="header-content">
        <div className="logo">
          {/* Your logo can go here */}
        </div>
        
        <div className="right-icons">
          <div 
            ref={searchRef}
            className={`search-container ${isSearchFocused || searchValue ? 'expanded' : ''}`}
          >
            <Search 
              className="search-icon" 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                if (!searchValue) {
                  setIsSearchFocused(false);
                }
              }}
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
          </div>
          
          <div className="notification-container" ref={notificationRef}>
            <div className="icon-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              {notifications.some(n => !n.isRead) && <span className="notification-badge"></span>}
            </div>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read">Mark all as read</button>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                        <p className="notification-text">{notification.text}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-container" ref={profileRef}>
            <div className="profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <User size={20} />
            </div>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <User size={40} />
                  </div>
                  <div className="profile-info">
                    <h3>Admin User</h3>
                    <p>admin@example.com</p>
                  </div>
                </div>
                <div className="profile-menu">
                  <div className="menu-item">
                    <User size={16} />
                    <span>Profile</span>
                  </div>
                  <div className="menu-item">
                    <Settings size={16} />
                    <span>Settings</span>
                  </div>
                  <div className="menu-item logout">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBoard;