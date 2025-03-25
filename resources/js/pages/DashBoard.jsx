import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react'; 
import '../../css/styles/dash/Dashboard.css'; 
import AdminSidebar from '../component/admin/AdminSidebar'; 
import Headerboard from '../component/admin/Headerboard'; 
import Metrics from '../component/admin/Metrics'; 
import DocumentControl from '../component/admin/DocumentControl'; 
import CalendarDashboard from '../component/admin/CalendarDashboard'; 
import EventControl from '../component/admin/EventControl'; 
import { createRoot } from 'react-dom/client';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    
    const handleMenuSelect = (menu) => {
        setActiveMenu(menu);
    };
    
    // Render content based on active menu
    const renderContent = () => {
        switch(activeMenu) {
            case "Dashboard":
                return <Metrics />;
            case "Document Control":
                return <DocumentControl />;
            case "Calendar":
                return <CalendarDashboard />;
            case "Event Control":
                return <EventControl />;
            default:
                return <Metrics />;
        }
    };
    
    return (
        <div className="admin-root-container">
            <AdminSidebar 
                activeMenu={activeMenu}
                onMenuSelect={handleMenuSelect}
            />
            <div className={`admin-container ${sidebarOpen ? '' : 'collapsed'}`}>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    {sidebarOpen ? <ArrowLeft className="toggle-icon" /> : <ArrowRight className="toggle-icon" />}
                </button>
                <Headerboard />
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