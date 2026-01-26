import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import ProfileHeader from './ProfileHeader';
import TimeOffRequestModal from './TimeOffRequestModal';
import TimeOffCalculatorModal from './TimeOffCalculatorModal';
import AdjustBalanceModal from './AdjustBalanceModal';

// --- Dashboard Icons ---
const IconPencil = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);
const IconCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
const IconGift = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect width="20" height="5" x="2" y="7" /><line x1="12" x2="12" y1="22" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>;
const IconAnnounce = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTarget = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
const IconGraduation = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-5" /></svg>;
const IconChart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>;
const IconDollar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const IconParty = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.8 11.3 2 22l10.7-3.8M4 14.8l.7 3.9M13.5 4.4l3 3m-5-2 4 4M15 2l5 5" /><circle cx="17.5" cy="6.5" r="2.5" /></svg>;
const IconUserPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>;
const IconLink = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
const IconBadge = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /></svg>;
const IconClock = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconSliders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" x2="18" y1="16" y2="16" /></svg>;
const IconExpand = ({ isExpanded }) => isExpanded ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6" /><path d="m10 14-6 6" /><path d="M20 10h-6V4" /><path d="m14 10 6-6" /></svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
);
const IconDirectReports = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconAlarm = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="7" />
        <path d="M12 11v3l2 2" />
        <path d="m5 4 3-2" />
        <path d="m19 4-3-2" />
        <path d="m5 20 2-2" />
        <path d="m19 20-2-2" />
    </svg>
);
const IconCalendarClock = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <circle cx="16" cy="16" r="4" />
        <path d="M16 14v2h2" />
    </svg>
);
const IconPalm = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8c0 1.1.9 2 2 2" />
        <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5 0 1.1-.9 2-2 2" />
        <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43" />
        <path d="M18.11 12.71c2.15 2.15 2.3 5.47.35 7.43" />
        <path d="M12 11v10" />
        <path d="M9 21h6" />
    </svg>
);
const IconMegaphone = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
);
const IconCompass = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </svg>
);
const IconProfile = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const IconChevronRight = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);
const IconSignature = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 5 4 4" />
        <path d="M13 7 3.83 16.17a2 2 0 0 0 0 2.83l.83.83" />
        <path d="m6.33 19.33 1.34 1.34a2 2 0 0 0 2.83 0L19.33 11" />
        <path d="m6.33 19.33.67-.67" />
        <path d="m10.5 12.5 1 1" />
    </svg>
);
const IconCheckCircle = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);
const IconCalculator = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="16" x2="16" y1="14" y2="18" />
        <path d="M16 10h.01" />
        <path d="M12 10h.01" />
        <path d="M8 10h.01" />
        <path d="M12 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18h.01" />
        <path d="M8 18h.01" />
    </svg>
);

const IconPlus = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconSettings = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconHistory = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </svg>
);

const IconBandage = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="20" height="8" rx="2" />
        <rect x="8" y="8" width="8" height="8" />
        <line x1="11" x2="11.01" y1="11" y2="11" />
        <line x1="13" x2="13.01" y1="11" y2="11" />
        <line x1="11" x2="11.01" y1="13" y2="13" />
        <line x1="13" x2="13.01" y1="13" y2="13" />
    </svg>
);

const IconBriefcase = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="12" x="2" y="8" rx="2" />
        <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M2 13h20" />
    </svg>
);

const IconFamily = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M4 20v-2a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2" />
        <circle cx="16" cy="11" r="2" />
        <path d="M12 21v-1.5a2.5 2.5 0 0 1 2.5-2.5h1a2.5 2.5 0 0 1 2.5 2.5V21" />
    </svg>
);

const IconChevronLeft = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const IconCalendarPlus = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M19 16v6M16 19h6" />
    </svg>
);

const TimeOffModule = ({ stats, getBalance, isCalculatorOpen, setIsCalculatorOpen, setIsModalOpen, onAdjust }) => {
    const balanceItems = [
        { label: 'Vacation Available', type: 'Vacation', icon: IconPalm, sub: '(8 hours scheduled)', policy: 'Vacation Full-Time' },
        { label: 'Sick Available', type: 'Sick', icon: IconBandage, sub: 'Sick Full-Time' },
        { label: 'Bereavement Used (YTD)', type: 'Bereavement', icon: IconBriefcase, unit: 'Days', sub: 'Bereavement Flexible Policy' },
    ];

    const upcomingLeaves = [
        { date: 'Feb 14', label: '8 hours of Vacation', icon: IconPalm },
        { date: 'Feb 15', label: '8 hours of Sick', icon: IconBandage },
        { date: 'Feb 15 - 16', label: '16 hours of Sick', icon: IconBandage },
        { date: 'Apr 4 - 5', label: '8 hours of Vacation', icon: IconPalm },
    ];

    const SmallActionBtn = ({ icon: Icon, onClick }) => (
        <button
            onClick={onClick}
            style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#2d4a22'
            }}
        >
            <Icon size={14} />
        </button>
    );

    return (
        <div className="time-off-module-container" style={{ animation: 'fadeIn 0.4s ease' }}>
            {/* Module Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d4a22' }}>
                    <IconCalendarPlus size={24} />
                    <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>Time Off</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="glass-panel" style={{ padding: '4px 12px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
                        <IconSettings size={18} color="#64748b" />
                        <span style={{ fontSize: '0.6rem' }}>▼</span>
                    </div>
                </div>
            </div>

            {/* Top Cards Carousel */}
            <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {balanceItems.map((item, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '32px', borderRadius: '20px', border: '1px solid #f1f5f9', background: '#fff' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f8fafc', color: '#2d4a22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <item.icon size={24} />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2d4a22', letterSpacing: '-0.5px', marginBottom: '4px' }}>
                                {getBalance(item.type)} {item.unit || 'Hours'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>{item.label}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.sub}</div>
                            {item.sub2 && <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.sub2}</div>}

                            {/* Card Actions */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                <SmallActionBtn icon={IconCalendarPlus} onClick={() => setIsModalOpen(true)} />
                                <SmallActionBtn icon={IconCalculator} onClick={() => setIsCalculatorOpen(true)} />
                                <SmallActionBtn icon={IconPencil} onClick={() => onAdjust(item.type)} />
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                    <div className="glass-panel" style={{ padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
                                        <IconSettings size={14} color="#64748b" />
                                        <span style={{ fontSize: '0.5rem' }}>▼</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button style={{
                    position: 'absolute', right: '-18px', top: '50%', transform: 'translateY(-50%)',
                    width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0',
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#64748b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <IconChevronRight size={18} />
                </button>
            </div>

            {/* Upcoming Section */}
            <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px', marginBottom: '40px', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#2d4a22' }}>
                    <IconClock size={20} />
                    <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Upcoming Time Off</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    {upcomingLeaves.map((leave, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 0', borderBottom: i < upcomingLeaves.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', color: '#2d4a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <leave.icon size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b' }}>{leave.date}</div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <IconCheckCircle size={14} color="#5cb85c" /> {leave.label}
                                </div>
                            </div>
                            <button className="glass-panel" style={{ padding: '8px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* History Section */}
            <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', color: '#2d4a22' }}>
                    <IconHistory size={20} />
                    <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>History</h3>
                </div>

                {/* History Filters */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <select style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff', fontSize: '0.9rem', color: '#1e293b', minWidth: '150px' }}>
                        <option>Vacation</option>
                    </select>
                    <select style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff', fontSize: '0.9rem', color: '#1e293b', minWidth: '100px' }}>
                        <option>All</option>
                    </select>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', color: '#1e293b', fontWeight: '500' }}>
                            Balance History <span style={{ fontSize: '0.6rem' }}>▼</span>
                        </div>
                    </div>
                </div>

                <div style={{ overflow: 'hidden', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>
                            <tr>
                                <th style={{ padding: '16px 24px' }}>Date ↑</th>
                                <th style={{ padding: '16px 24px' }}>Description</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Used Hours (-)</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Earned Hours (+)</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Balance</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                            <tr style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '24px' }}>10/29/2022</td>
                                <td style={{ padding: '24px' }}>
                                    <div style={{ fontWeight: '600' }}>Moved to a new policy</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Vacation Accrual Policy was set to Vacation Full-Time</div>
                                </td>
                                <td style={{ padding: '24px', textAlign: 'right' }}>-</td>
                                <td style={{ padding: '24px', textAlign: 'right' }}>-</td>
                                <td style={{ padding: '24px', textAlign: 'right', fontWeight: '700' }}>0.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

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
                            <IconSliders />
                        </button>
                        <button onClick={toggleExpand} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-light)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            <IconExpand isExpanded={isExpanded} />
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
        { label: 'Sick', icon: IconBandage, type: 'Sick', unit: 'hours available' },
        { label: 'Vacation', icon: IconPalm, type: 'Vacation', unit: 'hours available' },
        { label: 'Bereavement', icon: IconBriefcase, type: 'Bereavement', unit: 'days used (YTD)', value: '0' },
        { label: 'COVID-19 Related A...', icon: IconCalendarClock, type: 'COVID-19', unit: 'hours used (YTD)', value: '0' },
        { label: 'Comp/In Lieu Time', icon: IconBriefcase, type: 'Comp Time', unit: 'hours used (YTD)', value: '0' },
        { label: 'FMLA', icon: IconFamily, type: 'FMLA', unit: 'hours used (YTD)', value: '0' },
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
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
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
                {/* Row 1: Fixed Layout Grid (Time Off, My Stuff, Activity) */}
                <div className="dashboard-fixed-grid">
                    {/* Card: Time Off */}
                    <DashboardCard id="time-off" title="Time Off" icon={IconCalendar} hideActions padding="0">
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
                                    <IconChevronLeft size={16} />
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
                                    <IconChevronRight size={16} />
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
                                    <IconCalendarPlus size={22} />
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
                                    <IconPencil size={20} />
                                </button>
                                <button
                                    style={{
                                        width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid #2d4a22',
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#2d4a22'
                                    }}
                                    onClick={() => setIsCalculatorOpen(true)}
                                >
                                    <IconCalculator size={22} />
                                </button>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* Card: My Stuff */}
                    <DashboardCard id="my-stuff" title="My Stuff" icon={IconGift} hideActions>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                { label: 'Goals', sub: `${stats.my_stuff?.goals?.count || 0} goals, active is ${stats.my_stuff?.goals?.active || 0}`, icon: <IconCheckCircle /> },
                                { label: 'Training', sub: `${stats.my_stuff?.trainings?.count || 0} active trainings, ${stats.my_stuff?.trainings?.past_due || 0} past due`, icon: <IconGraduation /> },
                                { label: 'Compensation Benchmarks', sub: 'Compare your pay with similar orgs', icon: <IconChart /> },
                                { label: 'Compensation Planning Worksheets', sub: 'Plan out the right combination of salaries, bonuses, and equity', icon: <IconDollar /> }
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
                    <DashboardCard id="activity" title="What's happening at Eloisoft" icon={IconMegaphone} hideActions>
                        <div className="activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {(stats.activities || []).map((item, i) => {
                                const Icon = IconMap[item.icon] || IconMegaphone;
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
                    <DashboardCard id="direct-reports" title={`Direct Reports (${stats.direct_reports?.length || 0})`} icon={IconDirectReports} hideActions>
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
                            <DashboardCard index={0} id="celebrations" title="Celebrations" icon={IconParty} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
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

                            <DashboardCard index={1} id="welcome" title="Welcome" icon={IconUserPlus} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(92, 184, 92, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><IconUserPlus /></div>
                                    <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: '700' }}>{stats.new_hires?.length} New Hires</h3>
                                </div>
                            </DashboardCard>

                            <DashboardCard index={2} id="trainings" title="Trainings" icon={IconGraduation} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
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
                            <DashboardCard index={0} id="company-links" title="Links" icon={IconLink} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {stats.company_links?.[0]?.links.map(link => (
                                        <div key={link} style={{ fontSize: '0.9rem', color: '#64748b' }}>{link}</div>
                                    ))}
                                </div>
                            </DashboardCard>

                            <DashboardCard index={1} id="onboarding" title="Onboarding" icon={IconBadge} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {stats.onboarding?.map((item, i) => (
                                        <div key={i} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                                            <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{item.date}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.on_track} on track</div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardCard>

                            <DashboardCard index={2} id="time-off-requests" title="Time Off Requests" icon={IconCalendarClock} expandedCard={expandedCard} setExpandedCard={setExpandedCard}>
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', padding: '10px 0' }}>
                                    {/* Urgent Section */}
                                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', color: '#71717a' }}>
                                            <IconAlarm size={48} />
                                            <span style={{ fontSize: '3.2rem', fontWeight: '700', fontFamily: 'inherit' }}>5</span>
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#71717a', marginTop: '2px' }}>Urgent Requests</div>
                                    </div>

                                    {/* Separator */}
                                    <div style={{ borderTop: '1px solid #e4e4e7', width: '90%', margin: '15px auto' }}></div>

                                    {/* Other Section */}
                                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', color: '#71717a' }}>
                                            <IconCalendarClock size={42} />
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
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustCategory, setAdjustCategory] = useState('Vacation');
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
                <TimeOffModule
                    stats={timeOffData ? { personal_balances: timeOffData.balances } : null}
                    getBalance={getBalance}
                    isCalculatorOpen={isCalculatorOpen}
                    setIsCalculatorOpen={setIsCalculatorOpen}
                    setIsModalOpen={setIsModalOpen}
                    onAdjust={(cat) => {
                        setAdjustCategory(cat);
                        setIsAdjustModalOpen(true);
                    }}
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
            <div className="module-content glass-panel" style={{ marginTop: '24px', padding: '32px' }}>
                {renderTabContent()}
            </div>

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
        </div>
    );
};

const App = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <Router>
            <div className={`app-container ${isCollapsed ? 'collapsed-sidebar' : ''}`}>
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
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
