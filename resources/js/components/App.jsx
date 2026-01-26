import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import ProfileHeader from './ProfileHeader';
import TimeOffRequestModal from './TimeOffRequestModal';
import TimeOffCalculatorModal from './TimeOffCalculatorModal';

// Page Mock Components
const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="glass-panel" style={{ padding: '32px' }}>Loading Dashboard...</div>;

    const vacationBalance = stats.personal_balances.find(b => b.leave_type === 'Vacation') || { total_hours: 0, taken_hours: 0 };
    const sickBalance = stats.personal_balances.find(b => b.leave_type === 'Sick') || { total_hours: 0, taken_hours: 0 };

    const IconCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
    const IconGift = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect width="20" height="5" x="2" y="7" /><line x1="12" x2="12" y1="22" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>;
    const IconAnnounce = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
    const IconTarget = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
    const IconGraduation = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-5" /></svg>;
    const IconChart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>;
    const IconDollar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;

    return (
        <div className="personal-dashboard">
            {/* Profile Hero Section */}
            <div className="profile-hero" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '40px', padding: '0 8px', flexWrap: 'wrap', gap: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '16px', background: '#7e7e7e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div>
                        <h1 className="font-heading" style={{
                            fontSize: '2.4rem', color: 'var(--primary)', fontWeight: '700',
                            margin: 0, letterSpacing: '-0.5px'
                        }}>
                            Hi, {stats.user.name.split(' ')[0].toLowerCase()}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500', margin: '4px 0 0 0' }}>
                            {stats.user.job_title}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        padding: '10px 20px', borderRadius: '24px', border: '1px solid #e2e8f0',
                        background: '#fff', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b',
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                        New... <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>▼</span>
                    </button>
                    <button style={{
                        padding: '10px 20px', borderRadius: '24px', border: '1px solid #e2e8f0',
                        background: '#fff', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b',
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                        Edit
                    </button>
                </div>
            </div>

            <div className="dashboard-rows-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* First Row: 4/12 and 8/12 grid */}
                <div className="dashboard-row">
                    <div className="dashboard-col" style={{ gridColumn: 'span 4' }}>
                        {/* Time Off Card */}
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: 'var(--primary)', fontWeight: '700' }}>
                                <IconCalendar />
                                <span className="font-heading">Time Off</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Vacation</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1.4rem' }}>🌴</span>
                                        <span style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                            {(vacationBalance.total_hours - vacationBalance.taken_hours).toFixed(1)}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>hours available</div>
                                </div>
                                <div style={{ width: '1px', background: 'var(--border-light)', height: '60px', alignSelf: 'center' }}></div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Sick</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1.4rem' }}>🏥</span>
                                        <span style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                            {(sickBalance.total_hours - sickBalance.taken_hours).toFixed(0)}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>hours available</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                <button className="btn-primary" style={{ flex: 1, background: '#fff', color: 'var(--primary)', border: '1.5px solid var(--primary)', padding: '12px', borderRadius: '24px', fontWeight: '700', fontSize: '0.9rem' }}>
                                    Request Time Off
                                </button>
                                <button onClick={() => setIsCalculatorOpen(true)} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-light)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="8" x2="16" y1="14" y2="14" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* My Stuff Card */}
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--primary)', fontWeight: '700' }}>
                                <IconGift />
                                <span className="font-heading">My Stuff</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { icon: <IconTarget />, label: 'Goals', sub: '4 active goals' },
                                    { icon: <IconGraduation />, label: 'Training', sub: '3 certificates' },
                                    { icon: <IconChart />, label: 'Performance', sub: 'Last review: Dec' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(92, 184, 92, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.label}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Activity Column */}
                    <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', color: 'var(--primary)', fontWeight: '700' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(92, 184, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconAnnounce /></div>
                            <span className="font-heading" style={{ fontSize: '1.4rem' }}>What's happening at {stats.user.name.split(' ')[0]}soft</span>
                        </div>

                        <div className="activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff1f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div style={{ flex: 1, paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>Employee Assessments Overdue</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        Please complete the assessments on the Performance tab for each of your direct reports.
                                        <div style={{ marginTop: '8px' }}>
                                            <span style={{ background: '#fff1f2', color: '#e11d48', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>OVERDUE: NOV 30</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {stats.upcoming_time_off.map((off, i) => (
                                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f8fafc', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                                        <img src={`https://i.pravatar.cc/150?u=${off.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                                        <div style={{ fontSize: '1rem', color: '#1e293b' }}>
                                            <strong>{off.name}</strong> requested <strong>{off.type}</strong> off
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            Requested {i + 1} day ago for upcoming period
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Second Row: Full Width Reports */}
                <div className="dashboard-row">
                    <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', fontWeight: '700' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(92, 184, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                                <span className="font-heading" style={{ fontSize: '1.4rem' }}>My Direct Reports (12)</span>
                            </div>
                            <Link to="/people" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                View Directory <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '32px' }}>
                            {[
                                { name: 'Maja Andev', avatar: 'https://i.pravatar.cc/150?u=maja', out: 'Out Feb 5-6', role: 'UX Designer' },
                                { name: 'Eric Asture', avatar: 'https://i.pravatar.cc/150?u=eric', out: 'Out Jan 30', role: 'Frontend Dev' },
                                { name: 'Cheryl Barnet', avatar: 'https://i.pravatar.cc/150?u=cheryl', out: 'Out Feb 4-5', role: 'Backend Lead' },
                                { name: 'Jake Bryan', avatar: 'https://i.pravatar.cc/150?u=jake', out: 'Out Feb 7-8', role: 'Product Manager' },
                                { name: 'Jennifer Caldwell', avatar: 'https://i.pravatar.cc/150?u=jennifer', out: 'Out Jan 31', role: 'QA Engineer' },
                                { name: 'Dorothy Chou', avatar: 'https://i.pravatar.cc/150?u=dorothy', out: 'Out Feb 8-9', role: 'HR Specialist' }
                            ].map((person, i) => (
                                <div key={i} style={{ textAlign: 'center', padding: '16px', borderRadius: '16px', transition: 'background 0.2s', cursor: 'pointer' }} className="report-card-hover">
                                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 16px', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                                        <img src={person.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{person.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{person.role}</div>
                                    {person.out && (
                                        <div style={{ marginTop: '12px', fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(92, 184, 92, 0.08)', padding: '4px 8px', borderRadius: '12px', display: 'inline-block', fontWeight: '600' }}>
                                            {person.out}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <TimeOffCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} userName={stats.user.name} jobTitle={stats.user.job_title} />
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
                    <div className="content-container">
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
            </div>
        </Router>
    );
};

export default App;
