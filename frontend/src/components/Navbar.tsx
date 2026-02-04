import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Utensils, Wallet, DollarSign } from 'lucide-react';

const Navbar = () => {
    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/members', icon: Users, label: 'Members' },
        { to: '/meals', icon: Utensils, label: 'Meals' },
        { to: '/deposits', icon: Wallet, label: 'Deposits' },
        { to: '/costs', icon: DollarSign, label: 'Costs' },
    ];

    return (
        <nav className="navbar-fixed">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h1 className="brand-title">MessMgr</h1>
                    <span className="brand-subtitle">Meal Management System</span>
                </div>

                <div className="navbar-menu">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `nav-button ${isActive ? 'nav-button-active' : ''}`
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
