// AdminSidebar.jsx
import React, { useState } from 'react';
import {
    House,
    FolderCog,
    FileText,
    FileSearch,
    HardHat,
    FileChartPie,
    UserCog,
    Settings
} from 'lucide-react';
import '../../../css/styles/admin/AdminSidebar.css';

const AdminSidebar = ({ activeMenu, onMenuSelect, sidebarOpen, onMouseEnter, onMouseLeave }) => {
    const [isSettingsHover, setIsSettingsHover] = useState(false);

    const menuItems = [
        { title: "Dashboard", icon: <House size={20} color="#03055B" /> },
        { title: "Document Control", icon: <FolderCog size={20} color="#03055B" /> },
        { title: "Compliance & Standard", icon: <FileText size={20} color="#03055B" /> },
        { title: "Audits & Inspection", icon: <FileText size={20} color="#03055B" /> },
        { title: "CAPA", icon: <FileSearch size={20} color="#03055B" /> },
        { title: "Training Management", icon: <HardHat size={20} color="#03055B" /> },
        { title: "Report & Analytics", icon: <FileChartPie size={20} color="#03055B" /> },
        { title: "User Management", icon: <UserCog size={20} color="#03055B" /> },
        { title: "Settings", icon: <Settings size={20} color="#03055B" /> },
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
                        onMouseEnter={() => {
                            if (item.title === "Settings") {
                                setIsSettingsHover(true);
                            }
                        }}
                        onMouseLeave={() => {
                            if (item.title === "Settings") {
                                setIsSettingsHover(false);
                            }
                        }}
                    >
                        <div className="menu-content">
                            <span className="menu-icon">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="menu-title" style={{ color: '#03055B' }}>{item.title}</span>
                            )}
                            {item.title === "Settings" && sidebarOpen && (
                                <span className="dropdown-arrow" style={{ color: '#03055B' }}>&#9660;</span>
                            )}
                        </div>
                        {isSettingsHover && item.title === "Settings" && sidebarOpen && (
                            <ul className="dropdown-list">
                                <li className="dropdown-item" onClick={(e) => {
                                    e.stopPropagation();
                                    onMenuSelect('Subsetting 1');
                                }}>Subsetting 1</li>
                                <li className="dropdown-item" onClick={(e) => {
                                    e.stopPropagation();
                                    onMenuSelect('Subsetting 2');
                                }}>Subsetting 2</li>
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;
