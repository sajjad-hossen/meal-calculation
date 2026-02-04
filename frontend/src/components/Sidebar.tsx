

import { LayoutDashboard, Users, Utensils, Wallet, DollarSign, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/members', icon: Users, label: 'Members' },
        { to: '/meals', icon: Utensils, label: 'Meals' },
        { to: '/deposits', icon: Wallet, label: 'Deposits' },
        { to: '/costs', icon: DollarSign, label: 'Costs' },
    ];

    return (
        <aside
            className={`sidebar ${isOpen ? 'w-56' : 'w-18'} transition-all duration-300 h-screen bg-card border-r border-border fixed left-0 top-0 z-10 flex flex-col`}
            style={{
                backgroundColor: 'var(--card-bg)',
                borderRight: '1px solid var(--border-color)',
                width: isOpen ? '14rem' : '4.5rem'
            }}
        >
            <div className="p-3 flex items-center justify-between border-b border-border" style={{ borderColor: 'var(--border-color)' }}>
                {isOpen && <h1 className="text-lg font-bold" style={{ color: 'var(--primary-color)' }}>MessMgr</h1>}
                <button onClick={toggle} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                    <Menu size={18} />
                </button>
            </div>

            <nav className="flex-1 p-3 gap-1.5 flex flex-col">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-2.5 rounded-md transition-all ${isActive
                                ? 'bg-primary text-white shadow-md'
                                : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`
                        }
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                            color: isActive ? 'white' : 'var(--text-muted)',
                        })}
                    >
                        <item.icon size={18} />
                        {isOpen && <span className="text-sm font-medium animate-fade-in">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-3 border-t border-border" style={{ borderColor: 'var(--border-color)' }}>
                {isOpen && <div className="text-xs text-muted">v1.0.0</div>}
            </div>
        </aside>
    );
};

export default Sidebar;
