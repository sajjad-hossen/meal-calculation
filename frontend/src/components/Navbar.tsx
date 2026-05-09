import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Utensils, Wallet, DollarSign, LogOut, UserPlus, ShieldAlert, Eye } from 'lucide-react';
import { useAuth } from './AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard', show: isAuthenticated },
        { to: '/members', icon: Users, label: 'Members', show: isAuthenticated },
        { to: '/meals', icon: Utensils, label: 'Meals', show: isAuthenticated },
        { to: '/deposits', icon: Wallet, label: 'Deposits', show: isAuthenticated },
        { to: '/costs', icon: DollarSign, label: 'Costs', show: isAuthenticated },
    ];

    return (
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
                                user.role === 'Manager' 
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title={
                                user.role === 'Manager' 
                                    ? 'Manager Mode: Can add, update, and delete all items.' 
                                    : 'Member Mode: View all items without delete, update, or add.'
                            }
                        >
                            {user.role === 'Manager' ? <ShieldAlert size={14} /> : <Eye size={14} />}
                            <span className="uppercase tracking-wider hidden md:inline">{user.role} MODE</span>
                        </div>
                    )}
                </div>

                <div className="navbar-menu flex flex-wrap items-center justify-center gap-1 sm:gap-4 flex-1 px-2 overflow-x-auto">
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

                {isAuthenticated && (
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-auto pl-2 relative z-50">
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
                )}
            </div>
        </nav>
    );
};

export default Navbar;
