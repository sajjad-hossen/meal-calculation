
import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
