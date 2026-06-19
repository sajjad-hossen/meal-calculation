
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const AUTH_ROUTES = ['/login', '/register'];

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isAuthPage = AUTH_ROUTES.includes(location.pathname);

    // Auth pages get a clean full-screen canvas — no navbar, no container
    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
