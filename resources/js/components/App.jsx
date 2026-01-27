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
    Palette, LogOut, AlarmClock, Maximize2, Minimize2, Cake
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
import PersonalTab from './people/PersonalTab';
import ProfileSidebar from './people/ProfileSidebar';
import { Box, Typography, Stack } from '@mui/material';

// --- Shared Components ---

const PageWrapper = ({ children, padding = 4 }) => (
    <Box sx={{ p: padding, height: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {children}
        </Box>
    </Box>
);

const DashboardCard = ({ id, index, title, icon: Icon, children, padding = "24px", colSpan = 4, fullWidth = false, expandedCard, setExpandedCard, hideActions = false, headerAction, style = {} }) => {
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
                zIndex: isExpanded ? 50 : 1,
                background: '#fff',
                position: 'relative',
                ...style
            }}
        >
            <div className="card-header" style={{ borderBottom: '1px solid #edf2f7', padding: '16px 24px' }}>
                <div className="card-title-content" style={{ color: '#2d4a22', gap: '12px' }}>
                    {Icon && <Icon size={20} strokeWidth={2.5} />}
                    <span className="font-heading" style={{ fontSize: '0.95rem', fontWeight: 800 }}>{title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {headerAction}
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
            </div>
            <div style={{ padding, flex: 1, overflow: isExpanded ? 'auto' : 'hidden' }}>
                {children}
            </div>
        </div>
    );
};

const SmoothExpandableRow = ({ children, expandedCard, setExpandedCard, rowIds, gap = 32, standardHeight = 320 }) => {
    const isAnyExpanded = rowIds.some(id => id === expandedCard);
    const expandedIndex = rowIds.indexOf(expandedCard);

    // Total height: if expanded, 2 rows + gap. Otherwise 1 row.
    const containerHeight = isAnyExpanded ? standardHeight * 2 + gap : standardHeight;

    return (
        <Box className="expandable-row" sx={{ height: containerHeight, mb: 4, width: '100%', position: 'relative' }}>
            {React.Children.map(children, (child, index) => {
                const cardId = rowIds[index];
                const isExpanded = cardId === expandedCard;

                let cardStyle = {
                    position: 'absolute',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: isExpanded ? 10 : 1,
                };

                if (!isAnyExpanded) {
                    // Normal 3-column layout
                    const width = `calc(33.333% - ${(gap * 2) / 3}px)`;
                    cardStyle = {
                        ...cardStyle,
                        top: 0,
                        left: `calc(${(100 / 3) * index}% + ${(gap * index) / 3}px)`,
                        width: width,
                        height: standardHeight,
                    };
                } else if (isExpanded) {
                    // Expanded card: 50% width, 100% height (2 rows)
                    cardStyle = {
                        ...cardStyle,
                        top: 0,
                        left: 0,
                        width: `calc(50% - ${gap / 2}px)`,
                        height: '100%',
                    };
                } else {
                    // Other cards: stacked on the right
                    const stackIndex = index < expandedIndex ? index : index - 1;
                    cardStyle = {
                        ...cardStyle,
                        top: stackIndex === 0 ? 0 : `calc(50% + ${gap / 2}px)`,
                        left: `calc(50% + ${gap / 2}px)`,
                        width: `calc(50% - ${gap / 2}px)`,
                        height: `calc(50% - ${gap / 2}px)`,
                    };
                }

                return React.cloneElement(child, {
                    style: { ...child.props.style, ...cardStyle },
                    expandedCard,
                    setExpandedCard,
                });
            })}
        </Box>
    );
};

// --- Page Components ---

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustCategory, setAdjustCategory] = useState('Vacation');
    const [expandedCard, setExpandedCard] = useState(null);

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
        return <PageWrapper><div className="glass-panel" style={{ padding: '32px' }}>Loading Dashboard...</div></PageWrapper>;
    }

    const getBalance = (type) => {
        const bal = (stats.personal_balances || []).find(b => b.leave_type === type);
        const total = Number(bal?.total_hours) || 0;
        const taken = Number(bal?.taken_hours) || 0;
        return (total - taken).toFixed(0);
    };

    return (
        <PageWrapper padding={4}>
            {/* Header: Hi, mel */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: '50%',
                        bgcolor: '#f1f5f9', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#64748b',
                        border: '1.5px solid var(--border-light)'
                    }}>
                        <User size={40} strokeWidth={1.5} />
                    </Box>
                    <Box>
                        <Typography variant="h4" className="font-heading" sx={{ fontWeight: 800, color: 'var(--primary)', mb: 0.2 }}>
                            Hi, {stats.user.name.split(' ')[0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {stats.user.job_title}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <button className="glass-panel" style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} /> Now... <ChevronRight size={14} />
                    </button>
                    <button className="glass-panel" style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutGrid size={16} /> Edit
                    </button>
                </Box>
            </Box>



            {/* Main Content Grid: Match Screenshot Row 1 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4, mb: 4, alignItems: 'stretch' }}>
                {/* Left Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
                    {/* Time Off Card */}
                    <DashboardCard title="Time Off" icon={Calendar} padding="24px" hideActions={true} fullWidth={true} style={{ flex: 1, marginBottom: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                            <Box sx={{ flex: 1, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#000', fontWeight: 700, display: 'block', mb: 1.5, letterSpacing: '0.4px', fontSize: '0.85rem' }}>Sick</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, color: '#2d4a22', mb: 0.5 }}>
                                    <Clock size={22} strokeWidth={2.5} />
                                    <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2.4rem' }}>{getBalance('Sick')}</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#5cb85c', fontWeight: 800, fontSize: '0.85rem' }}>hours available</Typography>
                            </Box>

                            <Box sx={{ flex: 1, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#000', fontWeight: 700, display: 'block', mb: 1.5, letterSpacing: '0.4px', fontSize: '0.85rem' }}>Bereavement</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, color: '#2d4a22', mb: 0.5 }}>
                                    <Briefcase size={22} strokeWidth={2.5} />
                                    <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2.4rem', color: '#2d4a22' }}>0</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#5cb85c', fontWeight: 800, fontSize: '0.85rem' }}>days used (YTD)</Typography>
                            </Box>

                            {/* Slider Arrow */}
                            <Box sx={{
                                width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', bgcolor: '#fff', cursor: 'pointer',
                                flexShrink: 0
                            }}>
                                <ChevronRight size={18} />
                            </Box>
                        </Box>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <button className="glass-panel" style={{ flex: 1, height: '48px', borderRadius: '24px', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#2d4a22', border: '1.5px solid #5cb85c', background: '#fff', boxShadow: 'none' }} onClick={() => setIsModalOpen(true)}>
                                <CalendarPlus size={20} /> Request Time Off
                            </button>
                            <button className="glass-panel" style={{ width: 48, height: 48, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2d4a22', border: '1.5px solid #5cb85c', background: '#fff', boxShadow: 'none' }}>
                                <Calculator size={22} />
                            </button>
                        </Stack>
                    </DashboardCard>

                    {/* My Stuff Card */}
                    <DashboardCard title="My Stuff" icon={LayoutGrid} padding="0" hideActions={true} fullWidth={true} style={{ flex: 1, marginBottom: 0 }}>
                        <Box sx={{ p: 0 }}>
                            {[
                                { icon: <Target size={18} />, label: 'Goals', sub: '4 goals, soonest is due Apr 8', color: '#2d4a22' },
                                { icon: <GraduationCap size={18} />, label: 'Training', sub: '4 active trainings, 3 past due or expired', color: '#2d4a22' },
                                { icon: <BarChart3 size={18} />, label: 'Compensation Benchmarks', sub: 'Compare your pay with similar orgs', color: '#2d4a22' },
                                { icon: <Banknote size={18} />, label: 'Compensation Planning Worksheets', sub: 'Plan out the right combination of salaries, bonuses, and equity', color: '#2d4a22' }
                            ].map((item, i) => (
                                <Box key={i} sx={{
                                    display: 'flex', gap: 2.5, px: 3, py: 1.8, cursor: 'pointer',
                                    borderBottom: i === 3 ? 'none' : '1px solid #f1f5f9',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: 'rgba(92, 184, 92, 0.02)' }
                                }}>
                                    <Box sx={{
                                        width: 40, height: 40, borderRadius: '50%', bgcolor: '#f1f5f9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color,
                                        border: '1px solid #edf2f7'
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155', mb: 0.2 }}>{item.label}</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem' }}>{item.sub}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </DashboardCard>
                </Box>

                {/* Right Column: High card spanning both */}
                <Box sx={{ display: 'flex', height: '100%' }}>
                    <DashboardCard
                        title={`What's happening at ${stats.company?.name || 'Eloisoft'}`}
                        icon={Megaphone}
                        padding="0"
                        hideActions={true}
                        fullWidth={true}
                        headerAction={
                            <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, fontSize: '0.85rem' }}>
                                Announcements
                            </Typography>
                        }
                        style={{ height: '100%', display: 'flex', flexDirection: 'column', marginBottom: 0 }}
                    >
                        <Box sx={{ flex: 1, overflowY: 'auto', p: '0 24px' }}>
                            {[
                                { icon: <ArrowRight size={20} />, title: "Take a moment to complete your Employee Assessments.", meta: "Complete the assessments on the Performance tab on each employee's profile.", subMeta: "Please complete by Nov 30 (58 days ago).", badge: "PAST DUE", color: '#d97706' },
                                { icon: <UserPlus size={20} />, title: "Take a few minutes to complete your Self Assessment.", subMeta: "Please complete your assessment by Dec 1 (57 days ago).", badge: "PAST DUE", color: '#d97706' },
                                { avatar: "CA", title: "Charlotte Abbott requested Friday, Jul 5 off - 40 hours of Vacation", meta: "2 months ago" },
                                { avatar: "OS", title: "Olivia Sterling made a request: Compensation request for Ashley Adams.", meta: "3 months ago" },
                                { icon: <Pencil size={20} />, title: "Background_Check_Auth.pdf is waiting for your signature!", meta: "4 months ago" },
                                { avatar: "JC", title: "Javier Cruz is requesting an update to their personal information.", meta: "4 months ago" },
                                { icon: <Pencil size={20} />, title: "I-9 (2024) is waiting for your signature!", meta: "4 months ago" },
                                { avatar: "MP", title: "Maja Pandev requested Sunday, Feb 3 off - 40 hours of Vacation", meta: "4 months ago" },
                                { icon: <History size={20} />, title: "Benefits Administration is enabled and ready for setup.", meta: "4 months ago" }
                            ].map((item, i) => (
                                <Box key={i} sx={{ py: 2, px: 1, display: 'flex', gap: 3, borderBottom: i === 8 ? 'none' : '1px solid #f1f5f9' }}>
                                    {item.icon ? (
                                        <Box sx={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                                            {item.icon}
                                        </Box>
                                    ) : (
                                        <Box sx={{ width: 44, height: 44, borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                            <Box sx={{ width: '100%', height: '100%', bgcolor: '#cbd5e1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                                                {item.avatar}
                                            </Box>
                                        </Box>
                                    )}
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>{item.title}</Typography>
                                        </Box>
                                        {item.meta && <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, display: 'block', mt: 0.2, fontSize: '0.8rem' }}>{item.meta}</Typography>}
                                        {(item.subMeta || item.badge) && (
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, display: 'block', mt: 0.5, fontSize: '0.8rem' }}>
                                                {item.subMeta} {item.badge && <span style={{ color: '#d97706', bgcolor: '#fffbeb', px: 1, py: 0.5, borderRadius: 10, fontWeight: 800, fontSize: '0.65rem', border: '1px solid #fef3c7', marginLeft: 4 }}>{item.badge}</span>}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </DashboardCard>
                </Box>
            </Box>

            {/* Direct Reports: Full width below Row 1 */}
            <Box sx={{ mb: 4 }}>
                <DashboardCard title="My Direct Reports" icon={Users} padding="24px" fullWidth={true}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 3, flex: 1 }}>
                            {[
                                { name: 'Maja Andov', meta: '' },
                                { name: 'Eric Asture', meta: '1:1 on Mar 19' },
                                { name: 'Cheryl Barnet', meta: '1:1 on Mar 25' },
                                { name: 'Jake Bryan', meta: 'Out Feb 7 - 8' },
                                { name: 'Jennifer Caldwell', meta: '1:1 on Mar 11' },
                                { name: 'Dorothy Chou', meta: '' },
                                { name: 'Jeremy Steel', meta: 'Starts Feb 4 (6 days)' },
                                { name: 'Daniel Vance', meta: '' }
                            ].map((rep, i) => (
                                <Box key={i} sx={{ textAlign: 'center', cursor: 'pointer' }}>
                                    <Box sx={{
                                        width: 84, height: 84, borderRadius: '50%', bgcolor: '#f1f5f9', mb: 1, mx: 'auto',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                                        border: '3px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                                        fontSize: '1.2rem', fontWeight: 800
                                    }}>
                                        {rep.name.split(' ').map(n => n[0]).join('')}
                                    </Box>
                                    <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', lineHeight: 1.2, color: '#334155' }}>{rep.name}</Typography>
                                    {rep.meta && <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{rep.meta}</Typography>}
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ width: 140, pl: 3, borderLeft: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(92, 184, 92, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                                <Users size={14} /> <Typography variant="caption" sx={{ fontWeight: 800 }}>Direct Reports</Typography>
                            </Box>
                            <Box sx={{ p: 1, borderRadius: '8px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                                <BarChart3 size={14} /> <Typography variant="caption" sx={{ fontWeight: 700 }}>Headcount</Typography>
                            </Box>
                            <Box sx={{ p: 1, borderRadius: '8px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                                <History size={14} /> <Typography variant="caption" sx={{ fontWeight: 700 }}>Turnover</Typography>
                            </Box>
                        </Box>
                    </Box>
                </DashboardCard>
            </Box>

            {/* Row 3: Celebrations, Time Off Requests, Who's Out */}
            <SmoothExpandableRow
                rowIds={['celebrations', 'time-off-requests', 'whos-out']}
                expandedCard={expandedCard}
                setExpandedCard={setExpandedCard}
            >
                <DashboardCard id="celebrations" title="Celebrations" icon={PartyPopper}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f1f5f9', overflow: 'hidden' }}>
                                <img src={`https://i.pravatar.cc/150?u=daniel`} alt="Daniel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>Daniel Vance</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>February 27 - Happy Birthday!</Typography>
                            </Box>
                        </Box>
                        <Cake size={20} color="#cbd5e1" strokeWidth={1.5} />
                    </Box>
                </DashboardCard>

                <DashboardCard id="time-off-requests" title="Time Off Requests" icon={CalendarClock}>
                    <Box sx={{ py: 1 }}>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 0.5 }}>
                                <AlarmClock size={42} strokeWidth={1.5} color="#64748b" />
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#64748b', fontSize: '2.5rem' }}>5</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.8rem', letterSpacing: '0.2px' }}>Urgent Requests</Typography>
                        </Box>
                        <Box sx={{ height: '1px', bgcolor: '#f1f5f9', mx: -3, mb: 2 }} />
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 0.5 }}>
                                <CalendarClock size={42} strokeWidth={1.5} color="#64748b" />
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#64748b', fontSize: '2.5rem' }}>2</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.8rem', letterSpacing: '0.2px' }}>Other Requests</Typography>
                        </Box>
                    </Box>
                </DashboardCard>

                <DashboardCard id="whos-out" title="Who's Out" icon={Clock}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: '#2d4a22', fontWeight: 800, mb: 0.5 }}>Tuesday, Jan 27</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
                                Nobody requested time off for Tuesday, Jan 27
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 'auto' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'var(--primary)' }, fontSize: '0.8rem' }}>
                                Full Calendar
                            </Typography>
                        </Box>
                    </Box>
                </DashboardCard>
            </SmoothExpandableRow>

            {/* Row 4: Trainings, Links, Onboarding */}
            <SmoothExpandableRow
                rowIds={['trainings', 'company-links', 'onboarding']}
                expandedCard={expandedCard}
                setExpandedCard={setExpandedCard}
            >
                <DashboardCard id="trainings" title="Incomplete Trainings" icon={GraduationCap}>
                    <Stack spacing={2.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.2 }}>Annual Security Training</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>87 Employees</Typography>
                            </Box>
                            <ChevronRight size={18} color="#cbd5e1" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.2 }}>HR Compliance 2024</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>42 Employees</Typography>
                            </Box>
                            <ChevronRight size={18} color="#cbd5e1" />
                        </Box>
                    </Stack>
                </DashboardCard>

                <DashboardCard id="company-links" title="Company Links" icon={LinkIcon}>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1, textTransform: 'none', fontSize: '0.85rem' }}>Company</Typography>
                            <Typography variant="body2" sx={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Company website</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1, textTransform: 'none', fontSize: '0.85rem' }}>Benefits</Typography>
                            <Stack direction="row" spacing={3}>
                                <Typography variant="body2" sx={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>401k</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Health</Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </DashboardCard>

                <DashboardCard id="onboarding" title="Onboarding at Eloisoft" icon={Rocket}>
                    <Box sx={{
                        p: 3,
                        border: '1.5px solid #f1f5f9',
                        borderRadius: '24px',
                        bgcolor: 'rgba(255,255,255,0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155' }}>Starting Wednesday, Feb 4</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: '50%',
                                bgcolor: '#fef3c7', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Users size={20} color="#d97706" />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>No one has overdue tasks</Typography>
                        </Box>
                    </Box>
                </DashboardCard>
            </SmoothExpandableRow>



            <TimeOffCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} userName={stats.user.name} jobTitle={stats.user.job_title} />
            <TimeOffRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={() => window.location.reload()} employee={stats.user} />
            <AdjustBalanceModal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} category={adjustCategory} employee={stats.user} onRefresh={() => window.location.reload()} />
        </PageWrapper >
    );
};

const Hiring = () => <PageWrapper><div className="glass-panel" style={{ padding: '40px' }}><h1 className="font-heading">Hiring Dashboard</h1><p>Recruitment modules are coming soon.</p></div></PageWrapper>;
const Reports = () => <PageWrapper><div className="glass-panel" style={{ padding: '40px' }}><h1 className="font-heading">Reports & Analytics</h1><p>Analytics dashboards are being generated.</p></div></PageWrapper>;

const Settings = () => {
    const [activeSubTab, setActiveSubTab] = useState('Account');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const categories = [
        { icon: <SettingsIcon size={18} />, label: 'Account' },
        { icon: <User size={18} />, label: 'Employee Fields' },
        { icon: <Clock size={18} />, label: 'Time Off' }
    ];

    useEffect(() => {
        fetch('/api/settings').then(res => res.json()).then(data => {
            setSettings(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <PageWrapper><div className="glass-panel" style={{ padding: '32px' }}>Loading settings...</div></PageWrapper>;

    return (
        <PageWrapper>
            <div className="settings-container">
                <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '32px' }}>Settings</h1>
                <div className="settings-grid-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'stretch' }}>
                    <div className="settings-sub-sidebar glass-panel" style={{ padding: '8px' }}>
                        {categories.map((cat, i) => (
                            <div key={i} onClick={() => setActiveSubTab(cat.label)} className={`nav-highlight-item ${activeSubTab === cat.label ? 'active' : ''}`}>
                                <span style={{ marginRight: '12px', display: 'flex' }}>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="settings-main-area glass-panel" style={{ padding: '40px' }}>
                        {activeSubTab === 'Account' && (
                            <div>
                                <h3 className="font-heading" style={{ marginBottom: '24px' }}>Account Info</h3>
                                <div className="glass-panel" style={{ padding: '24px', background: 'rgba(0,0,0,0.02)' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>{settings?.name}</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>{settings?.slug}.hr-portal.com</p>
                                </div>
                            </div>
                        )}
                        {activeSubTab === 'Time Off' && <TimeOffSettings />}
                        {activeSubTab === 'Employee Fields' && <EmployeeFields />}
                    </div>
                </div>
            </div>
        </PageWrapper>
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
        const employeeUrl = !id || id === 'me' ? '/api/employees/me' : `/api/employees/${id}`;
        fetch(employeeUrl)
            .then(res => res.ok ? res.json() : Promise.reject(new Error("Not found")))
            .then(data => {
                setEmployee(data);
                const realId = data.id;
                fetch(`/api/employees/${realId}/time-off`).then(r => r.json()).then(setTimeOffData);
                fetch(`/api/employees/${realId}/custom-tabs`).then(r => r.json()).then(setCustomTabs);
                fetch(`/api/employees/${realId}/documents`).then(r => r.json()).then(setDocuments);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => { refreshData(); }, [id]);

    const renderTabContent = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;
        if (!employee) return <p>Employee not found.</p>;

        switch (activeTab) {
            case 'Job': return (
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h2 className="font-heading" style={{ marginBottom: '24px' }}>Job Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Job Title</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{employee.job_title}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Department</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{employee.department}</div>
                        </div>
                    </div>
                </div>
            );
            case 'Personal': return <PersonalTab employeeId={employee.id} onUpdate={refreshData} />;
            case 'Time Off': return <TimeOffModule stats={timeOffData ? { personal_balances: timeOffData.balances } : null} getBalance={getBalance} setIsCalculatorOpen={setIsCalculatorOpen} setIsModalOpen={setIsModalOpen} onAdjust={(cat) => { setAdjustCategory(cat); setIsAdjustModalOpen(true); }} onOpenAccrualModal={() => setIsAccrualStartModalOpen(true)} />;
            default: return <p>Content for {activeTab} coming soon.</p>;
        }
    };

    return (
        <div className="page-content" style={{ padding: 0 }}>
            <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
                <ProfileHeader employee={employee} activeTab={activeTab} setActiveTab={setActiveTab} customTabs={customTabs} />
            </Box>
            <Box sx={{ display: 'flex', gap: 4, p: 4, bgcolor: '#f8fafc', maxWidth: 1600, mx: 'auto' }}>
                <Box sx={{ width: 280, flexShrink: 0 }}>
                    <ProfileSidebar employee={employee} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    {renderTabContent()}
                </Box>
            </Box>
            <TimeOffRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={refreshData} employee={employee} />
            <TimeOffCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} userName={employee?.name} jobTitle={employee?.job_title} />
            <AdjustBalanceModal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} category={adjustCategory} employee={employee} onRefresh={refreshData} />
            <AccrualStartDateModal isOpen={isAccrualStartModalOpen} onClose={() => setIsAccrualStartModalOpen(false)} userName={employee?.name} jobTitle={employee?.job_title} />
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
                    <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
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
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Routes>
                    </Box>
                </Box>
            </div>
        </Router>
    );
};

export default App;
