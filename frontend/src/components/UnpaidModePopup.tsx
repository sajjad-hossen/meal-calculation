import React, { useState, useEffect } from 'react';
import { X, ShieldOff, Globe, Bell, Info } from 'lucide-react';
import './UnpaidModePopup.css';

interface UnpaidModePopupProps {
    onClose: () => void;
    onGoToPayment: () => void;
}

const content = {
    en: {
        badge: 'UNPAID MODE',
        title: "You don't have permission to perform operations",
        bodyLine1: 'Your mess has not been activated for this month. All Add, Edit, and Delete actions are currently disabled.',
        testTitle: '🧪 Testing the System?',
        testBody: 'You can use the dummy credentials below to explore the system freely for up to 2 months.',
        credLabel1: 'Email',
        credLabel2: 'Password',
        credEmail: 'demo@messmgr.com',
        credPass: 'Demo@1234',
        actionTitle: 'How to activate your mess?',
        actionBody: 'Click the "Request Payment" button in the top navigation bar and submit your transaction details to the admin.',
        actionBtn: '💳 Go to Payment Request',
        close: 'Got it',
        langToggle: 'বাংলায় দেখুন',
    },
    bn: {
        badge: 'আনপেইড মোড',
        title: 'আপনার কোনো অপারেশন করার অনুমতি নেই',
        bodyLine1: 'আপনার মেস এই মাসের জন্য সক্রিয় করা হয়নি। যোগ, সম্পাদনা ও মুছে ফেলার সব কার্যক্রম বর্তমানে অক্ষম আছে।',
        testTitle: '🧪 সিস্টেম পরীক্ষা করতে চান?',
        testBody: 'নিচের ডামি ক্রেডেনশিয়াল ব্যবহার করে আপনি সর্বোচ্চ ২ মাস বিনামূল্যে সিস্টেমটি পরীক্ষা করতে পারবেন।',
        credLabel1: 'ইমেইল',
        credLabel2: 'পাসওয়ার্ড',
        credEmail: 'demo@messmgr.com',
        credPass: 'Demo@1234',
        actionTitle: 'আপনার মেস কীভাবে সক্রিয় করবেন?',
        actionBody: 'উপরের নেভিগেশন বারে "Request Payment" বাটনে ক্লিক করুন এবং আপনার লেনদেনের বিবরণ অ্যাডমিনকে পাঠান।',
        actionBtn: '💳 পেমেন্ট রিকোয়েস্টে যান',
        close: 'বুঝেছি',
        langToggle: 'View in English',
    },
};

const SESSION_KEY = 'unpaid_popup_dismissed';

const UnpaidModePopup: React.FC<UnpaidModePopupProps> = ({ onClose, onGoToPayment }) => {
    const [lang, setLang] = useState<'en' | 'bn'>('en');
    const [visible, setVisible] = useState(false);

    // Animate in
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const t = content[lang];

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
        sessionStorage.setItem(SESSION_KEY, '1');
    };

    const handlePayment = () => {
        handleClose();
        setTimeout(onGoToPayment, 320);
    };

    return (
        <div className={`upm-overlay ${visible ? 'upm-visible' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className={`upm-card ${visible ? 'upm-card-visible' : ''}`} role="alertdialog" aria-modal="true">

                {/* ── Header ── */}
                <div className="upm-header">
                    <div className="upm-icon-ring">
                        <ShieldOff size={22} color="#ffffff" />
                    </div>
                    <div className="upm-header-text">
                        <span className="upm-badge">{t.badge}</span>
                        <h2 className="upm-title">{t.title}</h2>
                    </div>
                    <div className="upm-header-actions">
                        <button
                            className="upm-lang-btn"
                            onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}
                            title="Toggle language"
                        >
                            <Globe size={13} />
                            {t.langToggle}
                        </button>
                        <button className="upm-x-btn" onClick={handleClose} aria-label="Close">
                            <X size={17} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="upm-body">

                    {/* Main warning text */}
                    <p className="upm-warn-text">{t.bodyLine1}</p>

                    {/* Dummy credentials box */}
                    <div className="upm-test-box">
                        <div className="upm-test-title">
                            <Info size={14} />
                            {t.testTitle}
                        </div>
                        <p className="upm-test-body">{t.testBody}</p>
                        <div className="upm-cred-grid">
                            <div className="upm-cred-item">
                                <span className="upm-cred-label">{t.credLabel1}</span>
                                <code className="upm-cred-value">{t.credEmail}</code>
                            </div>
                            <div className="upm-cred-item">
                                <span className="upm-cred-label">{t.credLabel2}</span>
                                <code className="upm-cred-value">{t.credPass}</code>
                            </div>
                        </div>
                    </div>

                    {/* Payment instruction box */}
                    <div className="upm-action-box">
                        <div className="upm-action-title">
                            <Bell size={14} />
                            {t.actionTitle}
                        </div>
                        <p className="upm-action-body">{t.actionBody}</p>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="upm-footer">
                    <button className="upm-close-btn" onClick={handleClose}>
                        {t.close}
                    </button>
                    <button className="upm-pay-btn" onClick={handlePayment}>
                        {t.actionBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};

export { SESSION_KEY };
export default UnpaidModePopup;
