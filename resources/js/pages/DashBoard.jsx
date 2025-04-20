// Dashboard.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { createRoot } from 'react-dom/client';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import '../../css/styles/dash/Dashboard.css';
import AdminSidebar from '../component/admin/AdminSidebar';
import Headerboard from '../component/admin/Headerboard';
import DocumentControl from '../component/admin/DocumentControl';
import AuditSystem from '../component/admin/AuditSystem';
import CAPASystem from '../component/admin/CAPASystem'; // New import added

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isCAPAActive, setIsCAPAActive] = useState(false); // State to track CAPA menu

  useEffect(() => {
    setIsCAPAActive(activeMenu === "CAPA"); // Update state when activeMenu changes
  }, [activeMenu]);

  const handleSidebarMouseEnter = () => {
    setSidebarOpen(true);
  };

  const handleSidebarMouseLeave = () => {
    setSidebarOpen(false);
  };

  const handleMenuSelect = (menu) => {
    setActiveMenu(menu);
  };

  // Render content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <div>Dashboard Content</div>; // Placeholder for dashboard content
      case "Document Control":
        return <DocumentControl />;
      case "Audits & Inspection": // Added case for Audit System
        return <AuditSystem />;
      case "CAPA": // Added case for CAPA System
        return <CAPASystem />;
      default:
        return null; // Or some default content
    }
  };

  return (
    <div className="admin-root-container">
      <AdminSidebar
        activeMenu={activeMenu}
        onMenuSelect={handleMenuSelect}
        sidebarOpen={sidebarOpen}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      />
      <div className={`admin-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Headerboard sidebarOpen={sidebarOpen} />
        <div className="admin-main-content">
          <div className="main-content">
            {renderContent()}
          </div>
        </div>
      </div>
      {/* Conditionally render the CAPA CSS */}
      {isCAPAActive && (
        <link rel="stylesheet" type="text/css" href="../../../css/styles/admin/CAPASystem.css" />
      )}
    </div>
  );
};

// Ensure the root element is imported and used correctly
const container = document.getElementById('dashboard-root');
if (container) {
  const root = createRoot(container);
  root.render(<Dashboard />);
}

export default Dashboard;
