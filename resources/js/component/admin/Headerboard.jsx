// Headerboard.jsx
import React from 'react';
import { Search, Bell } from 'lucide-react';
import '../../../css/styles/admin/Headerboard.css';

const Headerboard = () => {
  return (
    <div className="header-container"> {/* New container for the header */}
      <div className="dashboard-header">
        <div className="header-left">
          {/* Removed the Main Board heading */}
        </div>
        <div className="header-right">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="notification-container">
            <Bell className="notification-icon" size={20} />
            <span className="notification-badge">3</span>
          </div>
          <div className="profile-container">
            <img src="/images/profile.png" alt="Profile" className="profile-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Headerboard;