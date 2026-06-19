
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

const AUTH_ROUTES = ['/login', '/register'];

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isAuthPage = AUTH_ROUTES.includes(location.pathname);

    // Auth pages get a clean full-screen canvas — no navbar/footer
    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="main-content" style={{ flex: 1 }}>
                <div className="container">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
