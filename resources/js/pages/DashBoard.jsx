// Dashboard.jsx
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react'; 
import '../../css/styles/dash/Dashboard.css'; 
import AdminSidebar from '../component/admin/AdminSidebar'; 
import Headerboard from '../component/admin/Headerboard'; 
import DocumentControl from '../component/admin/DocumentControl'; 
import { createRoot } from 'react-dom/client';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    
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
        switch(activeMenu) {
            case "Dashboard":
                return <div>Dashboard Content</div>; // Placeholder for dashboard content
            case "Document Control":
                return <DocumentControl />;
            default:
                return <div>Dashboard Content</div>; // Fallback
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