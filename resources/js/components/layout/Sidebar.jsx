import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Users, Briefcase, BarChart3, Folder, Settings, Menu } from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const menuItems = [
        {
            icon: <Home size={20} />,
            label: 'Home',
            path: '/home'
        },
        {
            icon: <User size={20} />,
            label: 'My Info',
            path: '/my-info'
        },
        {
            icon: <Users size={20} />,
            label: 'People',
            path: '/people'
        },
        {
            icon: <Briefcase size={20} />,
            label: 'Hiring',
            path: '/hiring'
        },
        {
            icon: <BarChart3 size={20} />,
            label: 'Reports',
            path: '/reports'
        },
        {
            icon: <Folder size={20} />,
            label: 'Files',
            path: '/files'
        },
        {
            icon: <Settings size={20} />,
            label: 'Settings',
            path: '/settings'
        },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-logo">
                Golden Record
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-toggle">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <User size={24} />
                    </div>
                    <button className="toggle-btn" onClick={onToggle} style={{ marginLeft: '-4px' }}>
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
