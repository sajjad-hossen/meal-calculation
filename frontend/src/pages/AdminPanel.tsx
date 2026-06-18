import { useEffect, useState, useCallback } from 'react';
import { fetchJson } from '../services/api';
import type { AdminSummaryDto, PaymentRequestDto, SystemSettingsDto } from '../types';
import {
    Home, Users, Calendar, ShieldAlert, CheckCircle, XCircle,
    Bell, CreditCard, Mail, FileText, Clock, Check, X, Settings, Activity
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const mealData = [
    { name: 'Mon', meals: 120 }, { name: 'Tue', meals: 132 }, { name: 'Wed', meals: 101 },
    { name: 'Thu', meals: 143 }, { name: 'Fri', meals: 90 }, { name: 'Sat', meals: 110 }, { name: 'Sun', meals: 150 }
];
const requestData = [
    { name: 'Mon', requests: 4 }, { name: 'Tue', requests: 3 }, { name: 'Wed', requests: 7 },
    { name: 'Thu', requests: 2 }, { name: 'Fri', requests: 8 }, { name: 'Sat', requests: 5 }, { name: 'Sun', requests: 9 }
];
const perfData = [
    { time: '00:00', ms: 45 }, { time: '04:00', ms: 52 }, { time: '08:00', ms: 38 },
    { time: '12:00', ms: 65 }, { time: '16:00', ms: 48 }, { time: '20:00', ms: 55 }
];
const pieData = [
    { name: 'Managers', value: 9 }, { name: 'Members', value: 21 }, { name: 'Admins', value: 1 }
];
const PIE_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b'];

const ttStyle = { backgroundColor: '#16161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', fontSize: '12px' };

const AdminPanel = () => {
    const [summary, setSummary] = useState<AdminSummaryDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentRequests, setPaymentRequests] = useState<PaymentRequestDto[]>([]);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [settings, setSettings] = useState<SystemSettingsDto | null>(null);
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'requests' | 'settings' | 'messes'>('dashboard');

    const fetchSummary = useCallback(() => {
        setLoading(true);
        fetchJson<AdminSummaryDto>('/Admin/messes-summary')
            .then(data => { setSummary(data); setLoading(false); })
            .catch(err => { setError(err.message || 'Failed to load.'); setLoading(false); });
    }, []);
    const fetchPaymentRequests = useCallback(() => {
        fetchJson<PaymentRequestDto[]>('/Admin/payment-requests')
            .then(data => setPaymentRequests(data)).catch(() => setPaymentRequests([]));
    }, []);
    const fetchSettings = useCallback(() => {
        fetchJson<SystemSettingsDto>('/Settings')
            .then(data => setSettings(data)).catch(() => setSettings(null));
    }, []);
    useEffect(() => { fetchSummary(); fetchPaymentRequests(); fetchSettings(); }, [fetchSummary, fetchPaymentRequests, fetchSettings]);

    const handleApprove = async (id: number) => {
        setActionLoading(id);
        try { await fetchJson(`/Admin/payment-requests/${id}/approve`, { method: 'POST' }); fetchPaymentRequests(); fetchSummary(); }
        catch (err: any) { alert('Failed to approve: ' + err.message); }
        finally { setActionLoading(null); }
    };
    const handleReject = async (id: number) => {
        setActionLoading(id);
        try { await fetchJson(`/Admin/payment-requests/${id}/reject`, { method: 'POST' }); fetchPaymentRequests(); }
        catch (err: any) { alert('Failed to reject: ' + err.message); }
        finally { setActionLoading(null); }
    };
    const togglePayment = async (id: number) => {
        try { await fetchJson(`/Admin/toggle-payment/${id}`, { method: 'POST' }); fetchSummary(); }
        catch (err: any) { alert('Failed to toggle: ' + err.message); }
    };
    const handleSaveSettings = async () => {
        if (!settings) return;
        setSettingsSaving(true);
        try {
            const updated = await fetchJson<SystemSettingsDto>('/Settings', { method: 'PUT', body: JSON.stringify(settings) });
            setSettings(updated); alert('Settings saved!');
        } catch (err: any) { alert('Failed to save: ' + err.message); }
        finally { setSettingsSaving(false); }
    };

    if (loading && !summary) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400 animate-fade-in">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" style={{ boxShadow: '0 0 20px rgba(168,85,247,0.5)' }}></div>
            <span className="text-sm font-semibold uppercase tracking-widest">Initializing System...</span>
        </div>
    );
    if (error) return (
        <div className="p-8 text-center text-red-400 max-w-md mx-auto mt-8 animate-fade-in rounded-2xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
            <ShieldAlert size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Access Denied</h3>
            <p>{error}</p>
        </div>
    );
    if (!summary) return null;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const navItems = [
        { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
        { id: 'requests' as const, label: 'Requests', icon: Bell, badge: paymentRequests.length },
        { id: 'settings' as const, label: 'Settings', icon: Settings },
        { id: 'messes' as const, label: 'Messes', icon: Users },
    ];

    return (
        <div style={{ margin: '-2rem -1rem', padding: '2rem 1rem', minHeight: '100vh', background: '#0a0a0d', color: '#f3f4f6', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient glows */}
            <div style={{ position: 'absolute', top: 0, left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: 0, right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

            <div style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto' }} className="animate-fade-in">

                {/* ── Sidebar ── */}
                <div style={{ width: '240px', flexShrink: 0 }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem 1rem', position: 'sticky', top: '100px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
                            <div style={{ padding: '0.5rem', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', borderRadius: '10px', boxShadow: '0 0 15px rgba(139,92,246,0.4)' }}>
                                <ShieldAlert size={20} color="white" />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(to right,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Portal</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {navItems.map(item => {
                                const active = activeTab === item.id;
                                return (
                                    <button key={item.id} onClick={() => setActiveTab(item.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', border: active ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent', background: active ? 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.15))' : 'transparent', color: active ? '#d8b4fe' : '#9ca3af', boxShadow: active ? '0 0 20px rgba(139,92,246,0.2)' : 'none', width: '100%', textAlign: 'left' }}
                                        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#e5e7eb'; } }}
                                        onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#9ca3af'; } }}
                                    >
                                        <item.icon size={17} />
                                        {item.label}
                                        {'badge' in item && (item as any).badge > 0 && (
                                            <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#f59e0b,#ec4899)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', boxShadow: '0 0 10px rgba(236,72,153,0.5)' }}>{(item as any).badge}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div style={{ flex: 1, minWidth: 0 }}>

                    {/* PAGE 1: DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }} className="animate-fade-in">
                            {/* Charts grid */}
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                {/* Chart 1: Meals */}
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <Activity size={16} color="#a78bfa" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db' }}>Daily Meal Consumption</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <AreaChart data={mealData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gMeals" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                                            <RTooltip contentStyle={ttStyle} />
                                            <Area type="monotone" dataKey="meals" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gMeals)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Chart 2: Requests */}
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <Bell size={16} color="#f472b6" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db' }}>Active Requests</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={requestData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                                            <RTooltip contentStyle={ttStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                            <Bar dataKey="requests" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Chart 3: Performance */}
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <Clock size={16} color="#fbbf24" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db' }}>System Performance (ms)</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={perfData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                                            <RTooltip contentStyle={ttStyle} />
                                            <Line type="monotone" dataKey="ms" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#0a0a0d', strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: '#f59e0b' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Chart 4: Demographics */}
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <Users size={16} color="#60a5fa" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db' }}>Member Demographics</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                                                {pieData.map((_entry, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                            </Pie>
                                            <RTooltip contentStyle={ttStyle} />
                                            <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Stats sidebar */}
                            <div style={{ width: '280px', flexShrink: 0 }}>
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 0 40px rgba(139,92,246,0.15)', position: 'sticky', top: '100px' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#f9fafb', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>System Dashboard</h3>
                                    {[
                                        { label: 'Total Messes', value: summary.totalMesses, from: '#a78bfa', to: '#f472b6', icon: Home },
                                        { label: 'Total Members', value: summary.totalMembers, from: '#f472b6', to: '#fbbf24', icon: Users },
                                        { label: 'Meals Today', value: '2,543', from: '#fbbf24', to: '#34d399', icon: CheckCircle, note: '↑ 12% yesterday' },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.1rem', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                                                <s.icon size={12} /> {s.label}
                                            </div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: 900, background: `linear-gradient(to right, ${s.from}, ${s.to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                                            {'note' in s && <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '0.25rem', fontWeight: 600 }}>{s.note}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAGE 2: PAYMENT REQUESTS */}
                    {activeTab === 'requests' && (
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }} className="animate-fade-in">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '0.5rem', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '10px' }}>
                                    <Bell size={20} color="#fbbf24" />
                                </div>
                                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f9fafb', margin: 0 }}>Pending Payment Requests</h2>
                                {paymentRequests.length > 0 && (
                                    <span style={{ marginLeft: '0.5rem', background: 'linear-gradient(135deg,#f59e0b,#ec4899)', color: 'white', fontSize: '11px', fontWeight: 700, width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 0 12px rgba(236,72,153,0.5)' }} className="animate-pulse">{paymentRequests.length}</span>
                                )}
                            </div>
                            {paymentRequests.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '50%' }}>
                                        <CheckCircle size={40} color="#34d399" />
                                    </div>
                                    <p style={{ color: '#9ca3af', fontWeight: 500, margin: 0 }}>All caught up! No pending requests.</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                                {['Mess Name','Email','Transaction ID','Note','Submitted','Actions'].map(h => (
                                                    <th key={h} style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paymentRequests.map(req => (
                                                <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: '#f9fafb' }}>{req.messName}</td>
                                                    <td style={{ padding: '0.9rem 1.25rem', color: '#c084fc', fontSize: '0.85rem' }}>{req.managerEmail}</td>
                                                    <td style={{ padding: '0.9rem 1.25rem' }}>
                                                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '0.25rem 0.6rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e5e7eb' }}>{req.transactionId}</span>
                                                    </td>
                                                    <td style={{ padding: '0.9rem 1.25rem', color: '#6b7280', fontSize: '0.85rem' }}>{req.note || '—'}</td>
                                                    <td style={{ padding: '0.9rem 1.25rem', color: '#4b5563', fontSize: '0.75rem' }}>{new Date(req.createdAt).toLocaleString()}</td>
                                                    <td style={{ padding: '0.9rem 1.25rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                            <button onClick={() => handleApprove(req.id)} disabled={actionLoading === req.id}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', transition: 'all 0.2s', opacity: actionLoading === req.id ? 0.5 : 1 }}>
                                                                <Check size={13} /> Approve
                                                            </button>
                                                            <button onClick={() => handleReject(req.id)} disabled={actionLoading === req.id}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', transition: 'all 0.2s', opacity: actionLoading === req.id ? 0.5 : 1 }}>
                                                                <X size={13} /> Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PAGE 3: SETTINGS */}
                    {activeTab === 'settings' && settings && (
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem', backdropFilter: 'blur(12px)', maxWidth: '780px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }} className="animate-fade-in">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '0.5rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px' }}>
                                    <Settings size={20} color="#a78bfa" />
                                </div>
                                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f9fafb', margin: 0 }}>System Payment Settings</h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Payment Process / Instructions</label>
                                    <textarea value={settings.process || ''} onChange={e => setSettings({ ...settings, process: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', fontSize: '0.875rem', color: '#e5e7eb', height: '120px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border 0.2s' }}
                                        placeholder="Enter payment instructions for managers..." />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    {[
                                        { label: 'bKash Number', key: 'bkashNumber' as const, placeholder: '01700000000', color: '#e879f9' },
                                        { label: 'Nagad Number', key: 'nagadNumber' as const, placeholder: '01700000000', color: '#fbbf24' },
                                        { label: 'WhatsApp Number', key: 'whatsappNumber' as const, placeholder: '+8801700000000', color: '#34d399' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{f.label}</label>
                                            <input type="text" value={(settings as any)[f.key] || ''} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                                                style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.875rem', fontFamily: 'monospace', color: f.color, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                                                placeholder={f.placeholder} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <button onClick={handleSaveSettings} disabled={settingsSaving}
                                    style={{ padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: 'white', border: 'none', boxShadow: '0 0 25px rgba(139,92,246,0.4)', transition: 'all 0.2s', opacity: settingsSaving ? 0.7 : 1 }}>
                                    {settingsSaving ? 'Saving...' : 'Save Configuration'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PAGE 4: MESSES */}
                    {activeTab === 'messes' && (
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }} className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ padding: '0.5rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px' }}>
                                        <Users size={20} color="#34d399" />
                                    </div>
                                    <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f9fafb', margin: 0 }}>Registered Messes</h2>
                                </div>
                                <div style={{ padding: '0.4rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Month: </span>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#34d399', fontSize: '0.85rem' }}>{currentMonth}</span>
                                </div>
                            </div>
                            <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                            {['Mess Name','Code','Manager Email','Registered','Members','Status','Action'].map(h => (
                                                <th key={h} style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.messes.map(mess => {
                                            const isPaid = mess.lastPaidMonth === currentMonth;
                                            return (
                                                <tr key={mess.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: '#f9fafb' }}>{mess.name}</td>
                                                    <td style={{ padding: '0.9rem 1.25rem' }}>
                                                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '6px', color: '#c084fc', fontWeight: 700, letterSpacing: '0.05em' }}>{mess.uniqueCode}</span>
                                                    </td>
                                                    <td style={{ padding: '0.9rem 1.25rem', color: '#9ca3af', fontSize: '0.85rem' }}>{mess.managerEmail ?? <span style={{ fontStyle: 'italic', color: '#4b5563' }}>N/A</span>}</td>
                                                    <td style={{ padding: '0.9rem 1.25rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', fontSize: '0.8rem' }}>
                                                            <Calendar size={13} />{new Date(mess.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                                                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: '#d1d5db' }}>{mess.memberCount}</span>
                                                    </td>
                                                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                                                        {isPaid ? (
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', boxShadow: '0 0 10px rgba(16,185,129,0.15)' }}>
                                                                <CheckCircle size={12} /> Paid
                                                            </span>
                                                        ) : (
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: '#f87171', boxShadow: '0 0 10px rgba(239,68,68,0.15)' }}>
                                                                <XCircle size={12} /> Unpaid
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                                                        <button onClick={() => togglePayment(mess.id)}
                                                            style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', border: isPaid ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(16,185,129,0.3)', background: isPaid ? 'transparent' : 'rgba(16,185,129,0.15)', color: isPaid ? '#6b7280' : '#34d399', boxShadow: isPaid ? 'none' : '0 0 12px rgba(16,185,129,0.2)' }}>
                                                            {isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {summary.messes.length === 0 && (
                                            <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#4b5563' }}>No messes registered yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
