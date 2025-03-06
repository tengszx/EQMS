import React, { useState } from 'react';
import { 
    House, 
    FolderCog, 
    FileText, 
    Calendar, 
    FileSearch,  
    HardHat,     
    FileChartPie, 
    UserCog,     
    Settings 
} from 'lucide-react'; 
import '../../../css/styles/admin/AdminSidebar.css';

const AdminSidebar = ({ activeMenu, onMenuSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSettingsHover, setIsSettingsHover] = useState(false);

    const menuItems = [
        { title: "Dashboard", icon: <House size={20} /> },
        { title: "Document Control", icon: <FolderCog size={20} /> },
        { title: "Calendar", icon: <Calendar size={20} /> }, // Correct Calendar usage
        { title: "Compliance & Standard", icon: <FileText size={20} /> },
        { title: "Audits & Inspection", icon: <Calendar size={20} /> }, // Use Calendar for Audits & Inspection
        { title: "CAPA", icon: <FileSearch size={20} /> },
        { title: "Training Management", icon: <HardHat size={20} /> },
        { title: "Report & Analytics", icon: <FileChartPie size={20} /> },
        { title: "User Management", icon: <UserCog size={20} /> },
        { title: "Settings", icon: <Settings size={20} /> },
    ];

    return (
        <div 
            className={`admin-sidebar ${isExpanded ? 'sidebar-expanded' : ''}`} 
            onMouseEnter={() => setIsExpanded(true)} 
            onMouseLeave={() => {
                setIsExpanded(false);
                setIsSettingsHover(false);
            }}
        >
            <div className="sidebar-header">
                <img src="/images/NewEQMSLOGO.png" alt="Logo" className={`logo ${isExpanded ? 'logo-fall-animation' : ''}`} />
                {isExpanded && <h1 className="sidebar-title">eQMS</h1>}
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
                            {isExpanded && (
                                <span className="menu-title">{item.title}</span>
                            )}
                            {item.title === "Settings" && isExpanded && (
                                <span className="dropdown-arrow">▼</span>
                            )}
                        </div>
                        {isSettingsHover && item.title === "Settings" && isExpanded && (
                            <ul className="dropdown-list">
                                <li className="dropdown-item" onClick={() => onMenuSelect('Subsetting 1')}>Subsetting 1</li>
                                <li className="dropdown-item" onClick={() => onMenuSelect('Subsetting 2')}>Subsetting 2</li>
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;