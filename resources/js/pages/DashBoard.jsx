import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import '../../css/styles/dash/Dashboard.css';
import AdminSidebar from '../component/admin/AdminSidebar';
import Headerboard from '../component/admin/Headerboard';
import DocumentControl from '../component/admin/DocumentControl';
import AuditSystem from '../component/admin/AuditSystem';
import CAPASystem from '../component/admin/CAPASystem';
import UserManagement from '../component/admin/UserManagement';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Document Control");
  const [isCAPAActive, setIsCAPAActive] = useState(false);
  const [isUserManagementActive, setIsUserManagementActive] = useState(false);

  useEffect(() => {
    setIsCAPAActive(activeMenu === "CAPA");
    setIsUserManagementActive(activeMenu === "User Management");
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

  const renderContent = () => {
    switch (activeMenu) {
      case "Document Control":
        return <DocumentControl />;
      case "Audits & Inspection":
        return <AuditSystem />;
      case "CAPA":
        return <CAPASystem />;
      case "User Management":
        return <UserManagement />;
      default:
        return null;
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
      {isCAPAActive && (
        <link rel="stylesheet" type="text/css" href="../../../css/styles/admin/CAPASystem.css" />
      )}
      {isUserManagementActive && (
        <link rel="stylesheet" type="text/css" href="../../../css/styles/admin/UserManagement.css" />
      )}
    </div>
  );
};

const container = document.getElementById('dashboard-root');
if (container) {
  const root = createRoot(container);
  root.render(<Dashboard />);
}

export default Dashboard;
