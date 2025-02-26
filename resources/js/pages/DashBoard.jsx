import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react'; 
import '../../css/styles/dash/Dashboard.css'; 
import AdminSidebar from '../component/admin/AdminSidebar'; 
import Headerboard from '../component/admin/Headerboard';
import Metrics from '../component/admin/Metrics'; // Import the metrics component
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
    
    return (
        <div className="admin-root-container">
            <AdminSidebar 
                isExpanded={sidebarOpen} 
                onToggle={toggleSidebar} 
                activeMenu={activeMenu}
                onMenuSelect={handleMenuSelect}
            />
            <div className={`admin-container ${sidebarOpen ? '' : 'collapsed'}`}>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    {sidebarOpen ? <ArrowLeft className="toggle-icon" /> : <ArrowRight className="toggle-icon" />}
                </button>
                <Headerboard /> {/* Header is outside main-content */}
                <div className="admin-main-content">
                    <div className="main-content">
                        <Metrics /> {/* Add the metrics component here */}
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