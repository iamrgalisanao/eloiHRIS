import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { icon: '🏠', label: 'Home', path: '/home' },
        { icon: '👤', label: 'My Info', path: '/my-info' },
        { icon: '👥', label: 'People', path: '/people' },
        { icon: '🏷️', label: 'Hiring', path: '/hiring' },
        { icon: '📊', label: 'Reports', path: '/reports' },
        { icon: '📂', label: 'Files', path: '/files' },
        { icon: '⚙️', label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="sidebar">
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
        </aside>
    );
};

export default Sidebar;
