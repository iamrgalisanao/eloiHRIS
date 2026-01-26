import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import ProfileHeader from './ProfileHeader';
import TimeOffRequestModal from './TimeOffRequestModal';

// Page Mock Components
const Home = () => (
    <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 className="font-heading">Home Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Welcome to the HRIS landing page.</p>
    </div>
);

const People = () => (
    <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 className="font-heading">People Directory</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Browse and manage your organization's employees.</p>
    </div>
);

const MyInfo = () => {
    const [activeTab, setActiveTab] = useState('Job');
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOffData, setTimeOffData] = useState(null);
    const [customTabs, setCustomTabs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshData = () => {
        // Fetch Employee Basic Info
        fetch('/api/me')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setEmployee(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch employee", err);
                setLoading(false);
            });

        // Fetch Time Off Data
        fetch('/api/time-off/balance')
            .then(res => res.json())
            .then(data => setTimeOffData(data))
            .catch(err => console.error("Failed to fetch time off", err));

        // Fetch Custom Tabs
        fetch('/api/custom-tabs')
            .then(res => res.json())
            .then(data => setCustomTabs(data))
            .catch(err => console.error("Failed to fetch custom tabs", err));
    };

    React.useEffect(() => {
        refreshData();
    }, []);

    const renderTabContent = () => {
        if (loading) return <p>Loading employee data...</p>;
        // Check if dynamic tab
        const dynamicTab = customTabs.find(t => t.label === activeTab);
        if (dynamicTab) {
            return (
                <div className="dynamic-module">
                    <h2 className="font-heading" style={{ marginBottom: '24px' }}>{dynamicTab.label}</h2>
                    <div className="field-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {dynamicTab.fields.map((f, i) => (
                            <div key={i} className="field-item">
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>{f.label}</label>
                                <div style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                    {f.values?.[0]?.value || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Not set</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'Personal': return <p>Personal Information for {employee.name}. Email: {employee.email}</p>;
            case 'Job': return (
                <>
                    <h2 className="font-heading" style={{ marginBottom: '16px' }}>Job Information</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Title: {employee.job_title}</p>
                    <p style={{ color: 'var(--text-muted)' }}>Department: {employee.department}</p>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Employee ID: {employee.employee_number}</p>
                </>
            );
            case 'Time Off': return (
                <div className="time-off-viewer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 className="font-heading">Time Off Balances</h2>
                        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Request Time Off</button>
                    </div>
                    <div className="balance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {timeOffData?.balances.map((b, i) => (
                            <div key={i} className="balance-card glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>{b.leave_type}</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>{parseFloat(b.accrued_hours) - parseFloat(b.taken_hours)}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hours Available</div>
                                <div style={{ marginTop: '16px', fontSize: '0.8rem', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                                    {b.accrued_hours} accrued • {b.taken_hours} taken
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            default: return <p>Content for {activeTab} is currently under construction.</p>;
        }
    };

    return (
        <div className="page-content">
            <ProfileHeader
                employee={employee}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                customTabs={customTabs}
            />
            <div className="module-content glass-panel" style={{ marginTop: '24px', padding: '32px' }}>
                {renderTabContent()}
            </div>

            <TimeOffRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={refreshData}
            />
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/people" element={<People />} />
                        <Route path="/my-info" element={<MyInfo />} />
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
