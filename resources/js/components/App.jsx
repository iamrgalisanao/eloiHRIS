import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link, useLocation } from 'react-router-dom';
import {
    Pencil, Calendar, Gift, Megaphone, Target, GraduationCap, BarChart3,
    DollarSign, PartyPopper, UserPlus, Link as LinkIcon, BadgeCheck, Clock,
    Sliders, Plus, Settings as SettingsIcon, History, ShieldPlus, Palmtree, Briefcase,
    ChevronLeft, ChevronRight, CalendarPlus, CheckCircle2, CalendarClock,
    User, Bell, ArrowRight, Check, Search, Menu, X, Info, HelpCircle,
    UserCheck, Users, Lock, MessageCircle, Building2, Gem, Layout, Mail,
    Smile, Heart, Globe, Rocket, Banknote, TrendingUp, Timer, Trophy, LayoutGrid, Calculator,
    Palette, LogOut, AlarmClock, Maximize2, Minimize2
} from 'lucide-react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import ProfileHeader from './ProfileHeader';
import TimeOffModule from './TimeOffModule';
import TimeOffRequestModal from './TimeOffRequestModal';
import TimeOffCalculatorModal from './TimeOffCalculatorModal';
import AdjustBalanceModal from './AdjustBalanceModal';
import AccrualStartDateModal from './AccrualStartDateModal';
import TimeOffSettings from './TimeOffSettings';
import EmployeeFields from './settings/EmployeeFields';
import PeoplePage from './people/PeoplePage';
import AddEmployeePage from './people/AddEmployeePage';
import { Box } from '@mui/material';

// --- Icons replaced with Lucide ---

// Components moved to separate files
// --- Components ---
const DashboardCard = ({ id, index, title, icon: Icon, children, padding = "24px", colSpan = 4, fullWidth = false, expandedCard, setExpandedCard, hideActions = false }) => {
    const isExpanded = expandedCard === id;
    const toggleExpand = () => setExpandedCard(isExpanded ? null : id);

    return (
        <div
            id={id}
            className={`glass-panel dashboard-card ${isExpanded ? 'is-expanded' : ''} ${fullWidth ? 'full-width-card' : ''}`}
            data-index={index}
            style={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                zIndex: isExpanded ? 50 : 1
            }}
        >
            <div className="card-header">
                <div className="card-title-content">
                    <Icon />
                    <span className="font-heading">{title}</span>
                </div>
                {!hideActions && (
                    <div className="card-actions" style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-light)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            <Sliders size={18} />
                        </button>
                        <button onClick={toggleExpand} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-light)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    </div>
                )}
            </div>
            <div style={{ padding, flex: 1, overflow: isExpanded ? 'auto' : 'hidden' }}>
                {children}
            </div>
        </div>
    );
};

// --- Icon Mapping For Activity Feed ---
const IconMap = {
    'Megaphone': Megaphone,
    'Gift': Gift,
    'GraduationCap': GraduationCap,
    'PartyPopper': PartyPopper,
    'UserPlus': UserPlus,
    'ShieldPlus': ShieldPlus,
    'Calendar': Calendar,
    'Rocket': Rocket,
    'Trophy': Trophy,
    'Target': Target,
    'Bell': Bell,
    'MessageCircle': MessageCircle
};

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustCategory, setAdjustCategory] = useState('Vacation');
    const [expandedCard, setExpandedCard] = useState('activity');
    const [timeOffIndex, setTimeOffIndex] = useState(0);

    const timeOffCategories = [
        { label: 'Sick', icon: ShieldPlus, type: 'Sick', unit: 'hours available' },
        { label: 'Vacation', icon: Palmtree, type: 'Vacation', unit: 'hours available' },
        { label: 'Bereavement', icon: Briefcase, type: 'Bereavement', unit: 'days used (YTD)', value: '0' },
        { label: 'COVID-19 Related A...', icon: CalendarClock, type: 'COVID-19', unit: 'hours used (YTD)', value: '0' },
        { label: 'Comp/In Lieu Time', icon: Briefcase, type: 'Comp Time', unit: 'hours used (YTD)', value: '0' },
        { label: 'FMLA', icon: Users, type: 'FMLA', unit: 'hours used (YTD)', value: '0' },
    ];

    useEffect(() => {
        let isMounted = true;
        fetch('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setStats(data);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Dashboard fetch error:", err);
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, []);

    if (loading || !stats) {
        return <div className="glass-panel" style={{ padding: '32px' }}>Loading Dashboard...</div>;
    }

    const getBalance = (type) => {
        const bal = (stats.personal_balances || []).find(b => b.leave_type === type);
        const total = Number(bal?.total_hours) || 0;
        const taken = Number(bal?.taken_hours) || 0;
        return (total - taken).toFixed(type === 'Vacation' ? 1 : 0);
    };

    const availVacation = getBalance('Vacation');
    const availSick = getBalance('Sick');

    const isGridExpanded = expandedCard && !['direct-reports', 'time-off-requests'].includes(expandedCard);

    return (
        <div className="personal-dashboard">
            {/* Profile Hero Section */}
            <div className="profile-hero" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '40px', padding: '0 8px', flexWrap: 'wrap', gap: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '16px', background: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <User size={40} />
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
                        <Plus size={18} />
                        New... <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>▼</span>
                    </button>
                    <button style={{
                        padding: '10px 20px', borderRadius: '24px', border: '1px solid #e2e8f0',
                        background: '#fff', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b',
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <LayoutGrid size={18} />
                        Edit
                    </button>
                </div>
            </div>

            <div className="dashboard-rows-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Row 1: Fixed Layout Grid (Time Off, My Stuff, Activity) */}
                <div className="dashboard-fixed-grid">
                    {/* Card: Time Off */}
                    <DashboardCard id="time-off" title="Time Off" icon={Calendar} hideActions padding="0">
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
                            {/* Carousel Area - Centered */}
                            <div style={{
                                display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between',
                                position: 'relative'
                            }}>
                                {/* Left Nav */}
                                <button
                                    onClick={() => setTimeOffIndex(prev => (prev > 0 ? prev - 1 : timeOffCategories.length - 1))}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0',
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#64748b', zIndex: 2
                                    }}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Main Content */}
                                <div style={{ textAlign: 'center', flex: 1, padding: '0 10px' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '16px', letterSpacing: '0.2px' }}>
                                        {timeOffCategories[timeOffIndex].label}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                        <div style={{ flexShrink: 0 }}>
                                            {React.createElement(timeOffCategories[timeOffIndex].icon, { size: 48, color: '#2d4a22' })}
                                        </div>
                                        <span style={{
                                            fontSize: '3.4rem', fontWeight: '800', color: '#2d4a22',
                                            letterSpacing: '-2px', lineHeight: '1', borderBottom: '3.5px solid #2d4a22'
                                        }}>
                                            {timeOffCategories[timeOffIndex].type === 'Sick' || timeOffCategories[timeOffIndex].type === 'Vacation'
                                                ? getBalance(timeOffCategories[timeOffIndex].type)
                                                : timeOffCategories[timeOffIndex].value}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.9rem', color: '#2d4a22', fontWeight: '700',
                                        marginTop: '12px', borderBottom: '1.5px solid #2d4a22', display: 'inline-block'
                                    }}>
                                        {timeOffCategories[timeOffIndex].unit}
                                    </div>
                                </div>

                                {/* Right Nav */}
                                <button
                                    onClick={() => setTimeOffIndex(prev => (prev < timeOffCategories.length - 1 ? prev + 1 : 0))}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0',
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#64748b', zIndex: 2
                                    }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Button Area */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', alignItems: 'center', width: '100%' }}>
                                <button
                                    className="btn-primary"
                                    style={{
                                        flex: 1, height: '48px', borderRadius: '24px', background: '#fff',
                                        border: '1.5px solid #2d4a22', color: '#2d4a22', fontSize: '1rem',
                                        fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                    }}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <CalendarPlus size={22} />
                                    Request Time Off
                                </button>
                                <button
                                    style={{
                                        width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid #2d4a22',
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#2d4a22'
                                    }}
                                    onClick={() => {
                                        setAdjustCategory(timeOffCategories[timeOffIndex].type);
                                        setIsAdjustModalOpen(true);
                                    }}
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    style={{
                                        width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid #2d4a22',
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#2d4a22'
                                    }}
                                    onClick={() => setIsCalculatorOpen(true)}
                                >
                                    <Calculator size={22} />
                                </button>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* Card: My Stuff */}
                    <DashboardCard id="my-stuff" title="My Stuff" icon={Gift} hideActions>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                { label: 'Goals', sub: `${stats.my_stuff?.goals?.count || 0} goals, active is ${stats.my_stuff?.goals?.active || 0}`, icon: <CheckCircle2 /> },
                                { label: 'Training', sub: `${stats.my_stuff?.trainings?.count || 0} active trainings, ${stats.my_stuff?.trainings?.past_due || 0} past due`, icon: <GraduationCap /> },
                                { label: 'Compensation Benchmarks', sub: 'Compare your pay with similar orgs', icon: <BarChart3 /> },
                                { label: 'Compensation Planning Worksheets', sub: 'Plan out the right combination of salaries, bonuses, and equity', icon: <DollarSign /> }
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '14px 0', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>{item.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>

                    {/* Card: What's Happening */}
                    <DashboardCard id="activity" title="What's happening at Eloisoft" icon={Megaphone} hideActions>
                        <div className="activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {(stats.activities || []).map((item, i) => {
                                const Icon = IconMap[item.icon] || Megaphone;
                                return (
                                    <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                            {item.avatar ? <img src={item.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon size={32} />}
                                        </div>
                                        <div style={{ flex: 1, fontSize: '0.9rem' }}>
                                            <div style={{ fontWeight: '700', color: '#334155', lineHeight: '1.4' }}>{item.title}</div>
                                            {(item.sub || item.highlight) && (
                                                <div style={{ marginTop: '4px', fontSize: '0.85rem', color: '#64748b' }}>
                                                    {item.sub} {item.highlight && <span style={{ color: '#c2410c', fontWeight: '700' }}>{item.highlight}</span>}
                                                    {item.badge && <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '4px', background: '#fff7ed', color: '#c2410c', fontSize: '0.7rem', fontWeight: '800', border: '1px solid #ffedd5' }}>{item.badge}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </DashboardCard>
                </div>

                {/* Row 2: Fixed Direct Reports Row */}
                <div className="direct-reports-fixed">
                    <DashboardCard id="direct-reports" title={`Direct Reports (${stats.direct_reports?.length || 0})`} icon={Users} hideActions>
                        <div style={{ display: 'flex', gap: '48px', padding: '10px 20px', overflowX: 'auto' }}>
                            {(stats.direct_reports || []).map((person, i) => (
                                <div key={i} className="report-item" style={{ textAlign: 'center', minWidth: '100px' }}>
                                    <div className="report-avatar-container">
                                        <img src={person.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={person.name} />
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>{person.name}</div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>

                {/* Row 3: Celebrations, Welcome, Trainings */}
                {(() => {
                    const row2Ids = ['celebrations', 'welcome', 'trainings'];
                    const expandedIndex = row2Ids.indexOf(expandedCard);
                    return (
                        <div
                            className={`dashboard-row ${expandedIndex !== -1 ? 'has-expanded' : ''}`}
                            data-expanded-index={expandedIndex !== -1 ? expandedIndex : undefined}
                            data-count="3"
                        >
                            <DashboardCard index={0} id="celebrations" title="Celebrations" icon={PartyPopper} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {stats.celebrations?.slice(0, 3).map((celeb, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={celeb.avatar} style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }} alt={celeb.name} />
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{celeb.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{celeb.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardCard>

                            <DashboardCard index={1} id="welcome" title="Welcome" icon={UserPlus} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(92, 184, 92, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><UserPlus /></div>
                                    <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: '700' }}>{stats.new_hires?.length} New Hires</h3>
                                </div>
                            </DashboardCard>

                            <DashboardCard index={2} id="trainings" title="Trainings" icon={GraduationCap} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {(stats.trainings_summary || []).slice(0, 2).map((training, i) => (
                                        <div key={i} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
                                            <div style={{ fontWeight: '700' }}>{training.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardCard>
                        </div>
                    );
                })()}

                {/* Row 3: Links, Onboarding, Time Off Requests */}
                {(() => {
                    const row3Ids = ['company-links', 'onboarding', 'time-off-requests'];
                    const expandedIndex = row3Ids.indexOf(expandedCard);
                    return (
                        <div
                            className={`dashboard-row ${expandedIndex !== -1 ? 'has-expanded' : ''}`}
                            data-expanded-index={expandedIndex !== -1 ? expandedIndex : undefined}
                            data-count="3"
                        >
                            <DashboardCard index={0} id="company-links" title="Links" icon={LinkIcon} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {stats.company_links?.[0]?.links.map(link => (
                                        <div key={link} style={{ fontSize: '0.9rem', color: '#64748b' }}>{link}</div>
                                    ))}
                                </div>
                            </DashboardCard>

                            <DashboardCard index={1} id="onboarding" title="Onboarding" icon={BadgeCheck} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {stats.onboarding?.map((item, i) => (
                                        <div key={i} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                                            <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{item.date}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.on_track} on track</div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardCard>

                            <DashboardCard index={2} id="time-off-requests" title="Time Off Requests" icon={CalendarClock} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', padding: '10px 0' }}>
                                    {/* Urgent Section */}
                                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', color: '#71717a' }}>
                                            <AlarmClock size={48} />
                                            <span style={{ fontSize: '3.2rem', fontWeight: '700', fontFamily: 'inherit' }}>5</span>
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#71717a', marginTop: '2px' }}>Urgent Requests</div>
                                    </div>

                                    {/* Separator */}
                                    <div style={{ borderTop: '1px solid #e4e4e7', width: '90%', margin: '15px auto' }}></div>

                                    {/* Other Section */}
                                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', color: '#71717a' }}>
                                            <CalendarClock size={42} />
                                            <span style={{ fontSize: '3.2rem', fontWeight: '700', fontFamily: 'inherit' }}>2</span>
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#71717a', marginTop: '2px' }}>Other Requests</div>
                                    </div>
                                </div>
                            </DashboardCard>
                        </div>
                    );
                })()}

            </div>

            <TimeOffCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} userName={stats.user.name} jobTitle={stats.user.job_title} />
            <TimeOffRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={() => window.location.reload()}
                employee={stats.user}
            />
            <AdjustBalanceModal
                isOpen={isAdjustModalOpen}
                onClose={() => setIsAdjustModalOpen(false)}
                category={adjustCategory}
                employee={stats.user}
                onRefresh={() => window.location.reload()}
            />
        </div>
    );
};

const People = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const location = useLocation();

    useEffect(() => {
        fetch('/api/employees')
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
                setLoading(false);
            });
    }, []);

    const params = new URLSearchParams(location.search);
    const paramFilters = {
        department: params.get('department') || '',
        division: params.get('division') || '',
        job_title: params.get('job_title') || '',
        location: params.get('location') || '',
    };

    const filtered = employees
        .filter(e => {
            if (paramFilters.department && e.department !== paramFilters.department) return false;
            if (paramFilters.division && e.division !== paramFilters.division) return false;
            if (paramFilters.job_title && e.job_title !== paramFilters.job_title) return false;
            if (paramFilters.location && e.location !== paramFilters.location) return false;
            return true;
        })
        .filter(e => (
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            (e.job_title || '').toLowerCase().includes(search.toLowerCase())
        ));

    return (
        <div className="people-directory">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                <h2 className="font-heading" style={{ margin: 0 }}>People Directory</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {(paramFilters.department || paramFilters.division || paramFilters.job_title || paramFilters.location) && (
                        <div className="glass-panel" style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                            Filters:
                            {paramFilters.department && <span style={{ marginLeft: 6 }}><strong>Department</strong>: {paramFilters.department}</span>}
                            {paramFilters.division && <span style={{ marginLeft: 6 }}><strong>Division</strong>: {paramFilters.division}</span>}
                            {paramFilters.job_title && <span style={{ marginLeft: 6 }}><strong>Job Title</strong>: {paramFilters.job_title}</span>}
                            {paramFilters.location && <span style={{ marginLeft: 6 }}><strong>Location</strong>: {paramFilters.location}</span>}
                        </div>
                    )}
                </div>
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
                <h3 className="font-heading" style={{ fontSize: '14px' }}>Job Openings</h3>
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
                            <h3 className="font-heading" style={{ fontSize: '14px' }}>{selectedReport === 'headcount' ? 'Headcount Trend' : 'Leave Utilization'}</h3>
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
        { icon: <SettingsIcon size={18} />, label: 'Account' },
        { icon: <Lock size={18} />, label: 'Access Levels' },
        { icon: <User size={18} />, label: 'Employee Fields' },
        { icon: <CheckCircle2 size={18} />, label: 'Approvals' },
        { icon: <LayoutGrid size={18} />, label: 'Apps' },
        { icon: <MessageCircle size={18} />, label: 'Ask BambooHR' },
        { icon: <Gift size={18} />, label: 'Benefits' },
        { icon: <Building2 size={18} />, label: 'Company Directory' },
        { icon: <DollarSign size={18} />, label: 'Compensation' },
        { icon: <Gem size={18} />, label: 'Core Values' },
        { icon: <Layout size={18} />, label: 'Custom Fields & Tables' },
        { icon: <Mail size={18} />, label: 'Email Alerts' },
        { icon: <Users size={18} />, label: 'Employee Community' },
        { icon: <Smile size={18} />, label: 'Employee Satisfaction' },
        { icon: <Heart size={18} />, label: 'Employee Wellbeing' },
        { icon: <Globe size={18} />, label: 'Global Employment' },
        { icon: <Briefcase size={18} />, label: 'Hiring' },
        { icon: <Calendar size={18} />, label: 'Holidays' },
        { icon: <Palette size={18} />, label: 'Logo & Color' },
        { icon: <LogOut size={18} />, label: 'Offboarding' },
        { icon: <Rocket size={18} />, label: 'Onboarding' },
        { icon: <Banknote size={18} />, label: 'Payroll' },
        { icon: <TrendingUp size={18} />, label: 'Performance' },
        { icon: <Clock size={18} />, label: 'Time Off' },
        { icon: <Timer size={18} />, label: 'Time Tracking' },
        { icon: <Trophy size={18} />, label: 'Total Rewards' },
        { icon: <GraduationCap size={18} />, label: 'Training' },
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

            <div className="settings-grid-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'stretch' }}>
                {/* Settings Sidebar */}
                <div className="settings-sub-sidebar glass-panel" style={{ padding: '8px', overflow: 'hidden' }}>
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveSubTab(cat.label)}
                            className={`nav-highlight-item ${activeSubTab === cat.label ? 'active' : ''}`}
                        >
                            <span style={{ fontSize: '1.2rem', display: 'flex' }}>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Main Settings Content */}
                <div className="settings-main-area glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
                    {activeSubTab === 'Account' && renderAccountContent()}
                    {activeSubTab === 'Time Off' && <TimeOffSettings />}
                    {activeSubTab === 'Employee Fields' && <EmployeeFields />}
                    {activeSubTab !== 'Account' && activeSubTab !== 'Time Off' && (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                <SettingsIcon size={48} strokeWidth={1.5} />
                            </div>
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
    const [activeTab, setActiveTab] = useState('Job');
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeOffData, setTimeOffData] = useState(null);
    const [customTabs, setCustomTabs] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustCategory, setAdjustCategory] = useState('Vacation');
    const [isAccrualStartModalOpen, setIsAccrualStartModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const getBalance = (type) => {
        if (!timeOffData) return '0.0';
        const bal = (timeOffData.balances || []).find(b => b.leave_type === type);
        if (!bal) return '0.0';
        const total = Number(bal.accrued_hours) || 0;
        const taken = Number(bal.taken_hours) || 0;
        return (total - taken).toFixed(type === 'Vacation' ? 1 : 0);
    };

    const refreshData = () => {
        setLoading(true);
        setError(null);

        const employeeUrl = !id || id === 'me' ? '/api/employees/me' : `/api/employees/${id}`;

        fetch(employeeUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setEmployee(data);
                const realId = data.id;

                fetch(`/api/employees/${realId}/time-off`)
                    .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
                    .then(setTimeOffData)
                    .catch(err => console.error('Failed to fetch time off', err));

                fetch(`/api/employees/${realId}/custom-tabs`)
                    .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
                    .then(setCustomTabs)
                    .catch(err => console.error('Failed to fetch custom tabs', err));

                fetch(`/api/employees/${realId}/documents`)
                    .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
                    .then(setDocuments)
                    .catch(err => console.error('Failed to fetch docs', err));

                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch employee', err);
                setError('Employee not found or unavailable.');
                setEmployee(null);
                setTimeOffData(null);
                setCustomTabs([]);
                setDocuments([]);
                setLoading(false);
            });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        if (!employee?.id) { setUploading(false); return; }
        fetch(`/api/employees/${employee.id}/documents`, {
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
    }, [id]);

    const renderTabContent = () => {
        if (loading) return <p>Loading employee data...</p>;
        if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
        if (!employee) return <p>Employee not found.</p>;

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
                    <p style={{ color: 'var(--text-muted)' }}>Title: {employee?.job_title || 'N/A'}</p>
                    <p style={{ color: 'var(--text-muted)' }}>Department: {employee?.department || 'N/A'}</p>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Employee ID: {employee?.employee_number}</p>
                </>
            );
            case 'Time Off': return (
                <TimeOffModule
                    stats={timeOffData ? { personal_balances: timeOffData.balances } : null}
                    getBalance={getBalance}
                    setIsCalculatorOpen={setIsCalculatorOpen}
                    setIsModalOpen={setIsModalOpen}
                    onAdjust={(cat) => {
                        setAdjustCategory(cat);
                        setIsAdjustModalOpen(true);
                    }}
                    onOpenAccrualModal={() => setIsAccrualStartModalOpen(true)}
                />
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
            <Box sx={{ mt: 3 }}>
                {renderTabContent()}
            </Box>

            <TimeOffRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={refreshData}
                employee={employee}
            />
            <TimeOffCalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
                userName={employee?.name}
                jobTitle={employee?.job_title}
            />
            <AdjustBalanceModal
                isOpen={isAdjustModalOpen}
                onClose={() => setIsAdjustModalOpen(false)}
                category={adjustCategory}
                employee={employee}
                onRefresh={refreshData}
            />
            <AccrualStartDateModal
                isOpen={isAccrualStartModalOpen}
                onClose={() => setIsAccrualStartModalOpen(false)}
                userName={employee?.name}
                jobTitle={employee?.job_title}
            />
        </div>
    );
};

const App = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <Router>
            <div className={`app-container ${isCollapsed ? 'collapsed-sidebar' : ''}`}>
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Header />
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 4, bgcolor: '#f8fafc' }}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/people" element={<PeoplePage />} />
                            <Route path="/people/add" element={<AddEmployeePage />} />
                            <Route path="/hiring" element={<Hiring />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/my-info" element={<Navigate to="/employee/me" replace />} />
                            <Route path="/employee/:id" element={<EmployeeProfile />} />
                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Routes>
                    </Box>
                </Box>
            </div>
        </Router>
    );
};

export default App;
