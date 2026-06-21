import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Utensils, Wallet, DollarSign, LogOut, ShieldAlert, Eye, Bell } from 'lucide-react';
import { useAuth } from './AuthContext';
import { fetchJson } from '../services/api';
import PaymentRequestModal from './PaymentRequestModal';
import SystemInfoModal from './SystemInfoModal';
import { Info } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout, isPaymentActive } = useAuth();
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSystemInfoModal, setShowSystemInfoModal] = useState(false);
    const [hasPending, setHasPending] = useState(false);

    // Listen for the custom event fired by UnpaidModePopup's "Go to Payment" button
    useEffect(() => {
        const handler = () => {
            if (user?.role === 'Manager' && !isPaymentActive && !hasPending) {
                setShowPaymentModal(true);
            }
        };
        window.addEventListener('open-payment-modal', handler);
        return () => window.removeEventListener('open-payment-modal', handler);
    }, [user, isPaymentActive, hasPending]);

    // Check if manager already has a pending request
    useEffect(() => {
        if (user?.role === 'Manager' && !isPaymentActive) {
            fetchJson<{ hasPending: boolean }>('/PaymentRequest/my-status')
                .then(data => setHasPending(data.hasPending))
                .catch(() => setHasPending(false));
        } else {
            setHasPending(false);
        }
    }, [user, isPaymentActive]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard', show: isAuthenticated && user?.role !== 'Admin' },
        { to: '/members', icon: Users, label: 'Members', show: isAuthenticated && user?.role !== 'Admin' },
        { to: '/meals', icon: Utensils, label: 'Meals', show: isAuthenticated && user?.role !== 'Admin' },
        { to: '/deposits', icon: Wallet, label: 'Deposits', show: isAuthenticated && user?.role !== 'Admin' },
        { to: '/costs', icon: DollarSign, label: 'Costs', show: isAuthenticated && user?.role !== 'Admin' },
        { to: '/admin', icon: ShieldAlert, label: 'Admin Panel', show: isAuthenticated && user?.role === 'Admin' },
    ];

    return (
        <>
            <nav className="navbar-fixed">
                <div className="navbar-container flex items-center justify-between w-full px-6">
                    <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
                        <div className="navbar-brand flex items-center gap-2">
                            <h1 className="brand-title text-xl font-bold">MessMgr</h1>
                            <span className="brand-subtitle text-sm text-gray-500 hidden lg:inline">Meal Management System</span>
                        </div>
                        {isAuthenticated && user && (
                            <div
                                className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-help transition-colors border ${
                                    user.role === 'Admin'
                                        ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                        : !isPaymentActive
                                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                            : user.role === 'Manager'
                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                }`}
                                title={
                                    user.role === 'Admin'
                                        ? 'Admin Mode: View all registered messes and member details.'
                                        : !isPaymentActive
                                            ? 'Unpaid Mode: Your mess has not paid for the current month. Operations are restricted.'
                                            : user.role === 'Manager'
                                                ? 'Manager Mode: Can add, update, and delete all items.'
                                                : 'Member Mode: View all items without delete, update, or add.'
                                }
                            >
                                {user.role === 'Admin' || user.role === 'Manager' ? <ShieldAlert size={14} /> : <Eye size={14} />}
                                <span className="uppercase tracking-wider hidden md:inline">
                                    {!isPaymentActive && user.role !== 'Admin' ? 'UNPAID MODE' : `${user.role} MODE`}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="navbar-menu flex items-center justify-center gap-1 sm:gap-4 flex-1 px-2 overflow-x-auto">
                        {navItems.filter(item => item.show).map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    `nav-button flex items-center gap-1 p-2 rounded transition-colors whitespace-nowrap ${isActive ? 'nav-button-active bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`
                                }
                            >
                                <item.icon size={20} />
                                <span className="hidden md:inline">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto pl-2 relative z-50">

                        {/* Payment Request Button — only for unpaid Managers */}
                        {isAuthenticated && user?.role === 'Manager' && !isPaymentActive && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowSystemInfoModal(true)}
                                    title="View Payment Instructions"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 cursor-pointer shadow-sm"
                                >
                                    <Info size={13} />
                                    <span className="hidden sm:inline">Instructions</span>
                                </button>
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    disabled={hasPending}
                                    title={hasPending ? 'Payment request already submitted. Awaiting admin approval.' : 'Send payment request to admin'}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                        hasPending
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 cursor-pointer shadow-sm'
                                    }`}
                                >
                                    <Bell size={13} />
                                    <span className="hidden sm:inline">
                                        {hasPending ? 'Request Pending...' : 'Request Payment'}
                                    </span>
                                </button>
                            </div>
                        )}

                        <div className="text-sm hidden sm:block">
                            <span className="font-semibold text-gray-700 whitespace-nowrap">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer flex-shrink-0"
                            title="Logout"
                        >
                            <LogOut size={20} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Payment Request Modal */}
            {showPaymentModal && user && (
                <PaymentRequestModal
                    messName={user.name}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => setHasPending(true)}
                />
            )}

            {/* System Info Modal */}
            {showSystemInfoModal && (
                <SystemInfoModal onClose={() => setShowSystemInfoModal(false)} />
            )}
        </>
    );
};

export default Navbar;
