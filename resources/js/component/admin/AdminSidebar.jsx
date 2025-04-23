import React from 'react';
import {
    House,
    FolderCog,
    FileSearch,
    FileChartPie,
    UserCog
} from 'lucide-react';
import '../../../css/styles/admin/AdminSidebar.css';

const AdminSidebar = ({ activeMenu, onMenuSelect, sidebarOpen, onMouseEnter, onMouseLeave }) => {
    const menuItems = [
        { title: "Dashboard", icon: <House size={20} color="#03055B" /> },
        { title: "Document Control", icon: <FolderCog size={20} color="#03055B" /> },
        { title: "Audits & Inspection", icon: <FileChartPie size={20} color="#03055B" /> },
        { title: "CAPA", icon: <FileSearch size={20} color="#03055B" /> },
        { title: "User Management", icon: <UserCog size={20} color="#03055B" /> },
    ];

    return (
        <div
            className={`admin-sidebar ${sidebarOpen ? 'sidebar-expanded' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="sidebar-header">
                <div className="logo-container">
                    <img
                        src="/images/EQMS_LOGO-removebg-preview.png"
                        alt="Logo"
                        className="logo"
                    />
                </div>
            </div>

            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`menu-item ${activeMenu === item.title ? 'active' : ''}`}
                        onClick={() => onMenuSelect(item.title)}
                    >
                        <div className="menu-content">
                            <span className="menu-icon">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="menu-title" style={{ color: '#03055B' }}>{item.title}</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;