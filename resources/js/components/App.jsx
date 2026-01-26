import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import ProfileHeader from './ProfileHeader';
import TimeOffRequestModal from './TimeOffRequestModal';

// Page Mock Components
const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="glass-panel" style={{ padding: '32px' }}>Loading Metrics...</div>;

    return (
        <div className="dashboard">
            <h2 className="font-heading" style={{ marginBottom: '32px' }}>Company Overview</h2>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>TOTAL HEADCOUNT</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.headcount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#449d44', marginTop: '8px' }}>↑ 1 this month</div>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>PENDING REQUESTS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: stats.pending_requests > 0 ? '#f0ad4e' : 'var(--text-main)' }}>{stats.pending_requests}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Requires approval</div>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>DEPARTMENTS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.departments.length}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Across Scranton</div>
                </div>
            </div>

            <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Who's Out (Next 14 Days)</h3>
                    {stats.upcoming_time_off.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>Everyone is present!</p>
                    ) : (
                        <div className="event-list">
                            {stats.upcoming_time_off.map((event, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0',
                                    borderBottom: i < stats.upcoming_time_off.length - 1 ? '1px solid var(--border-light)' : 'none'
                                }}>
                                    <div className="profile-avatar small" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
                                        {event.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600' }}>{event.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.type}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                                        <div style={{ fontWeight: '500' }}>{new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>until {new Date(event.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Department Distribution</h3>
                    <div className="dept-list">
                        {stats.departments.map((dept, i) => (
                            <div key={i} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: '500' }}>{dept.department}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{dept.count} {dept.count === 1 ? 'member' : 'members'}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(dept.count / stats.headcount) * 100}%`,
                                        height: '100%',
                                        background: 'var(--primary)',
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const People = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/employees')
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
                setLoading(false);
            });
    }, []);

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.job_title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="people-directory">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="font-heading">People Directory</h2>
                <input
                    type="text"
                    className="glass-input"
                    placeholder="Search employees..."
                    style={{ width: '300px' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.02)', fontSize: '0.85rem' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left' }}>Employee</th>
                            <th style={{ padding: '16px', textAlign: 'left' }}>Job Title</th>
                            <th style={{ padding: '16px', textAlign: 'left' }}>Department</th>
                            <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((emp) => (
                            <tr key={emp.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="profile-avatar small">{emp.name.split(' ').map(n => n[0]).join('')}</div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{emp.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.employee_number}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>{emp.job_title}</td>
                                <td style={{ padding: '16px' }}>{emp.department}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem',
                                        background: 'rgba(92, 184, 92, 0.1)', color: '#449d44'
                                    }}>Active</span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <Link to={`/employee/${emp.id}`} className="link-primary">View Profile</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Hiring = () => {
    const [stats, setStats] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.all([
            fetch('/api/hiring/stats').then(res => res.json()),
            fetch('/api/hiring/jobs').then(res => res.json())
        ]).then(([statsData, jobsData]) => {
            setStats(statsData);
            setJobs(jobsData);
            setLoading(false);
        });
    }, []);

    const filteredJobs = jobs.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="glass-panel" style={{ padding: '32px' }}>Loading Recruitment Data...</div>;

    return (
        <div className="hiring-dashboard">
            <h2 className="font-heading" style={{ marginBottom: '32px' }}>Hiring Dashboard</h2>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>OPEN JOBS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.open_jobs}</div>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>TOTAL CANDIDATES</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.total_candidates}</div>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>INTERVIEWS TODAY</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f0ad4e' }}>{stats.interviews_today}</div>
                </div>
            </div>

            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Job Openings</h3>
                <input
                    type="text"
                    className="glass-input"
                    placeholder="Search jobs..."
                    style={{ width: '300px' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.02)', fontSize: '0.85rem' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left' }}>Position</th>
                            <th style={{ padding: '16px', textAlign: 'left' }}>Department</th>
                            <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Candidates</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredJobs.map((job) => (
                            <tr key={job.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ fontWeight: '600' }}>{job.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted {new Date(job.created_at).toLocaleDateString()}</div>
                                </td>
                                <td style={{ padding: '16px' }}>{job.department}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem',
                                        background: 'rgba(92, 184, 92, 0.1)', color: '#449d44',
                                        textTransform: 'capitalize'
                                    }}>{job.status}</span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{job.candidates_count}</div>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button className="link-primary" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>View Pipeline</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState('headcount');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const endpoint = selectedReport === 'headcount' ? '/api/reports/headcount' : '/api/reports/time-off';
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            });
    }, [selectedReport]);

    const renderChart = () => {
        if (!data) return null;
        if (selectedReport === 'headcount') {
            const max = Math.max(...data.map(d => d.count));
            return (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '300px', borderBottom: '2px solid var(--border-light)', paddingBottom: '10px' }}>
                    {data.map((d, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '100%',
                                background: 'linear-gradient(180deg, var(--primary) 0%, rgba(92, 184, 92, 0.5) 100%)',
                                height: `${(d.count / max) * 100}%`,
                                borderRadius: '4px 4px 0 0',
                                position: 'relative'
                            }}>
                                <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', fontWeight: '600' }}>{d.count}</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.month}</span>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="utilization-bars">
                    {data.map((d, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span style={{ fontWeight: '500' }}>{d.leave_type}</span>
                                <span style={{ fontWeight: '600' }}>{d.total_taken} Hours Taken</span>
                            </div>
                            <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min((d.total_taken / 100) * 100, 100)}%`,
                                    height: '100%',
                                    background: '#f0ad4e',
                                    borderRadius: '6px'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="reports-hub">
            <h2 className="font-heading" style={{ marginBottom: '32px' }}>Reports & Analytics</h2>

            <div className="reports-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
                <div className="reports-sidebar glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '1px' }}>REPORTS</div>
                    <div
                        onClick={() => setSelectedReport('headcount')}
                        style={{
                            padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px',
                            background: selectedReport === 'headcount' ? 'rgba(92, 184, 92, 0.1)' : 'transparent',
                            color: selectedReport === 'headcount' ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: selectedReport === 'headcount' ? '600' : '400'
                        }}
                    >📈 Headcount Trend</div>
                    <div
                        onClick={() => setSelectedReport('time-off')}
                        style={{
                            padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                            background: selectedReport === 'time-off' ? 'rgba(92, 184, 92, 0.1)' : 'transparent',
                            color: selectedReport === 'time-off' ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: selectedReport === 'time-off' ? '600' : '400'
                        }}
                    >⏳ Leave Utilization</div>
                </div>

                <div className="report-content glass-panel" style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <h3 className="font-heading" style={{ fontSize: '1.4rem' }}>{selectedReport === 'headcount' ? 'Headcount Trend' : 'Leave Utilization'}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing data for Acme Corp - Scranton Branch</p>
                        </div>
                        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>Export CSV</button>
                    </div>

                    {loading ? <p>Calculating data...</p> : renderChart()}
                </div>
            </div>
        </div>
    );
};

const Settings = () => {
    const [activeSubTab, setActiveSubTab] = useState('Account');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const categories = [
        { icon: '💼', label: 'Account' },
        { icon: '🔑', label: 'Access Levels' },
        { icon: '📝', label: 'Employee Fields' },
        { icon: '✅', label: 'Approvals' },
        { icon: '📱', label: 'Apps' },
        { icon: '❓', label: 'Ask BambooHR' },
        { icon: '💖', label: 'Benefits' },
        { icon: '📁', label: 'Company Directory' },
        { icon: '⚖️', label: 'Compensation' },
        { icon: '⚙️', label: 'Custom Fields & Tables' },
        { icon: '📧', label: 'Email Alerts' },
        { icon: '🖼️', label: 'Logo & Color' },
    ];

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="glass-panel" style={{ padding: '32px' }}>Loading settings...</div>;

    const renderAccountContent = () => (
        <div className="settings-content-body">
            <div className="settings-section-header" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>Account Info</h3>
            </div>

            <div className="account-info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>{settings.name}</h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <div>Account #745001</div>
                        <div>{settings.slug}.golden-record.com</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="profile-avatar small">MK</div>
                    <div style={{ fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: '600' }}>Michael Scott</div>
                        <div style={{ color: 'var(--text-muted)' }}>Account Owner</div>
                    </div>
                </div>
            </div>

            <div className="usage-banner glass-panel" style={{ background: 'rgba(92, 184, 92, 0.05)', border: '1px solid rgba(92, 184, 92, 0.2)', padding: '16px', borderRadius: '8px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>🚀</span>
                <div style={{ fontSize: '0.9rem' }}>
                    <strong>Your Free Trial ends Feb 1, 2026 (6 days)</strong>
                    <div style={{ color: 'var(--text-muted)' }}>Reach out to your product specialist or give us a call at +1-801-724-6601 to sign up.</div>
                </div>
            </div>

            <div className="settings-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Subscription Card */}
                <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>🚀</span>
                            <span style={{ fontWeight: '700' }}>Elite <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' }}>NEW</span></span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>89 Employees</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>HR Package</div>
                </div>

                {/* Job Postings Card */}
                <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>📍</span>
                            <span style={{ fontWeight: '700' }}>Job Postings</span>
                        </div>
                        <span style={{ fontWeight: '600' }}>5 of 50</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '10%', height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                </div>

                {/* File Storage Card */}
                <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>📄</span>
                            <span style={{ fontWeight: '700' }}>File Storage</span>
                        </div>
                        <span style={{ fontWeight: '600' }}>0 GB of 31.7 GB</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '1%', height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px' }}>Available Upgrades</h3>
                <div className="upgrade-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.2rem' }}>♥</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600' }}>Benefits Administration</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add-On</div>
                    </div>
                    <button className="link-primary" style={{ background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Learn More</button>
                </div>
                <div className="upgrade-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⏱</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600' }}>Time Tracking</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add-On</div>
                    </div>
                    <button className="link-primary" style={{ background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Learn More</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="settings-container">
            <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '32px' }}>Settings</h1>

            <div className="settings-grid-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Settings Sidebar */}
                <div className="settings-sub-sidebar glass-panel" style={{ padding: '8px', overflow: 'hidden' }}>
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveSubTab(cat.label)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
                                background: activeSubTab === cat.label ? 'var(--primary)' : 'transparent',
                                color: activeSubTab === cat.label ? 'white' : 'var(--text-main)',
                                fontWeight: activeSubTab === cat.label ? '700' : '500',
                                marginBottom: '2px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Main Settings Content */}
                <div className="settings-main-area glass-panel" style={{ padding: '40px', minHeight: '600px' }}>
                    {activeSubTab === 'Account' ? renderAccountContent() : (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚙️</div>
                            <h3>{activeSubTab} Configuration</h3>
                            <p>Advanced settings for {activeSubTab} are coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmployeeProfile = () => {
    const { id } = useParams();
    const employeeId = id || 1;
    const [activeTab, setActiveTab] = useState('Job');
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOffData, setTimeOffData] = useState(null);
    const [customTabs, setCustomTabs] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const refreshData = () => {
        setLoading(true);
        // Fetch Employee Basic Info
        fetch(`/api/employees/${employeeId}`)
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
        fetch(`/api/employees/${employeeId}/time-off`)
            .then(res => res.json())
            .then(data => setTimeOffData(data))
            .catch(err => console.error("Failed to fetch time off", err));

        // Fetch Custom Tabs
        fetch(`/api/employees/${employeeId}/custom-tabs`)
            .then(res => res.json())
            .then(data => setCustomTabs(data))
            .catch(err => console.error("Failed to fetch custom tabs", err));

        // Fetch Documents
        fetch(`/api/employees/${employeeId}/documents`)
            .then(res => res.json())
            .then(data => setDocuments(data))
            .catch(err => console.error("Failed to fetch docs", err));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        fetch(`/api/employees/${employeeId}/documents`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
            body: formData
        })
            .then(res => res.json())
            .then(() => {
                refreshData();
                setUploading(false);
            })
            .catch(err => {
                console.error("Upload failed", err);
                setUploading(false);
            });
    };

    useEffect(() => {
        refreshData();
    }, [employeeId]);

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
            case 'Documents': return (
                <div className="documents-viewer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 className="font-heading">Personal Documents</h2>
                        <label className="btn-primary" style={{ cursor: 'pointer' }}>
                            {uploading ? 'Uploading...' : 'Upload Document'}
                            <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
                        </label>
                    </div>
                    {documents.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No documents uploaded yet.
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(0,0,0,0.02)', fontSize: '0.85rem', fontWeight: '600' }}>
                                    <tr>
                                        <th style={{ padding: '16px' }}>Name</th>
                                        <th style={{ padding: '16px' }}>Size</th>
                                        <th style={{ padding: '16px' }}>Type</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc, i) => (
                                        <tr key={i} style={{ borderTop: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '16px' }}>{doc.original_name}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{doc.file_size}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{doc.mime_type?.split('/')[1]?.toUpperCase()}</td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                                <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="link-primary" style={{ fontSize: '0.9rem' }}>View</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
                        <Route path="/hiring" element={<Hiring />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/my-info" element={<Navigate to="/employee/1" replace />} />
                        <Route path="/employee/:id" element={<EmployeeProfile />} />
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
