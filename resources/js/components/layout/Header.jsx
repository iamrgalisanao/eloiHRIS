import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Inbox, HelpCircle, Settings as SettingsIcon, Search, MessageSquare, ChevronDown } from 'lucide-react';

const Header = () => {
    return (
        <header className="top-header">
            <div className="header-left">
                <div className="company-logo-header">
                    <div className="logo-circle">
                        <Sparkles size={18} />
                    </div>
                    <span className="logo-text">COMPANY LOGO HERE</span>
                </div>
            </div>

            <div className="header-right">
                <div className="search-wrapper">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="header-search-input"
                    />
                </div>

                <div className="header-actions">
                    <div className="action-item notification">
                        <Inbox size={20} />
                        <span className="notification-badge">19</span>
                    </div>
                    <div className="action-item">
                        <HelpCircle size={20} />
                    </div>
                    <Link to="/settings" className="action-item settings-trigger">
                        <SettingsIcon size={20} />
                    </Link>
                    <button className="ask-button">
                        <MessageSquare size={16} />
                        <span>Ask</span>
                    </button>
                    <div className="user-profile-trigger">
                        <div className="user-avatar-header">MK</div>
                        <ChevronDown size={14} className="user-dropdown-arrow" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
