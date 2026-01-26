import React from 'react';

const ProfileHeader = ({ employee, activeTab, setActiveTab, customTabs = [] }) => {
    const initials = employee?.name ? employee.name.split(' ').map(n => n[0]).join('') : '??';

    const coreTabs = ['Personal', 'Job', 'Time Off'];
    const dynamicTabLabels = customTabs.map(t => t.label);
    const otherTabs = ['Documents', 'Benefits', 'Performance', 'Notes'];

    const profileTabs = [...coreTabs, ...dynamicTabLabels, ...otherTabs];

    return (
        <div className="profile-header">
            <div className="profile-info-row">
                <div className="profile-avatar-container">
                    <div className="profile-avatar large">{initials}</div>
                </div>
                <div className="profile-info-main">
                    <h1 className="employee-name">{employee?.name || 'Loading...'}</h1>
                    <div className="employee-title-line">
                        <span className="job-title">{employee?.job_title}</span>
                        <span className="dot-separator">•</span>
                        <span className="department">{employee?.department}</span>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="btn-primary">Actions</button>
                </div>
            </div>

            <div className="profile-navigation">
                {profileTabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileHeader;
