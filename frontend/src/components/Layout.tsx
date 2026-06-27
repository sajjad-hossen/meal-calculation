
import { useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import UnpaidModePopup, { SESSION_KEY } from './UnpaidModePopup';
import { useAuth } from './AuthContext';

interface LayoutProps {
    children: ReactNode;
}

const AUTH_ROUTES = ['/login', '/register', '/'];

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const { user, isPaymentActive } = useAuth();
    const isAuthPage = AUTH_ROUTES.includes(location.pathname);

    // Show unpaid popup once per session for managers in unpaid mode
    const [showUnpaidPopup, setShowUnpaidPopup] = useState(false);

    useEffect(() => {
        const isUnpaidManager =
            user?.role === 'Manager' &&
            !isPaymentActive &&
            !isAuthPage;

        if (isUnpaidManager && !sessionStorage.getItem(SESSION_KEY)) {
            // Small delay so the page renders first
            const t = setTimeout(() => setShowUnpaidPopup(true), 800);
            return () => clearTimeout(t);
        }
    }, [user, isPaymentActive, isAuthPage]);

    // Trigger Navbar's payment modal via a custom event
    const handleGoToPayment = () => {
        window.dispatchEvent(new CustomEvent('open-payment-modal'));
    };

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

            {/* Unpaid mode popup — shown once per session */}
            {showUnpaidPopup && (
                <UnpaidModePopup
                    onClose={() => setShowUnpaidPopup(false)}
                    onGoToPayment={handleGoToPayment}
                />
            )}
        </div>
    );
};

export default Layout;
