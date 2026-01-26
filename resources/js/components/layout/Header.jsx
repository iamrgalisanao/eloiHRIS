import React from 'react';

const Header = () => {
    return (
        <header className="top-header">
            <div className="search-container">
                <input type="text" placeholder="Search for people, files, etc..." className="glass-input" />
            </div>
            <div className="global-actions">
                <div className="action-icons-group">
                    <span className="action-icon">🔔</span>
                    <span className="action-icon">📂</span>
                    <span className="action-icon">⚙️</span>
                </div>
                <div className="user-profile-trigger">
                    <div className="user-avatar-small">MK</div>
                    <span className="user-dropdown-arrow">▼</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
