import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react'; 
import '../../css/styles/dash/Dashboard.css'; 
import AdminSidebar from '../component/admin/AdminSidebar'; 
import { createRoot } from 'react-dom/client'; // Import createRoot correctly

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

            <div className={`admin-main-content ${sidebarOpen ? '' : 'collapsed'}`}>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    {sidebarOpen ? <ArrowLeft className="toggle-icon" /> : <ArrowRight className="toggle-icon" />}
                </button>

                <div className="main-content">
                    <h2>Main Content Area</h2>
                    {/* Add your dashboard content here */}
                </div>
            </div>
        </div>
    );
};

// Ensure the root element is imported and used correctly
const container = document.getElementById('dashboard-root');
const root = createRoot(container);
root.render(<Dashboard />);