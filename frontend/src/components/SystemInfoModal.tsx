import React, { useEffect, useState } from 'react';
import { X, Info, Phone, MessageCircle, Globe } from 'lucide-react';
import { fetchJson } from '../services/api';
import type { SystemSettingsDto } from '../types';
import './SystemInfoModal.css';

interface SystemInfoModalProps {
    onClose: () => void;
}

const content = {
    en: {
        title: 'Payment Instructions',
        subtitle: 'Follow the steps below to activate your mess',
        step1: 'Step 1 — Send Payment',
        step1Desc: 'Send the monthly subscription fee to one of the numbers below using bKash, Nagad, or WhatsApp.',
        step2: 'Step 2 — Submit Request',
        step2Desc: 'Click the "Request Payment" button in the top navbar and fill in your transaction ID and a short note.',
        step3: 'Step 3 — Wait for Approval',
        step3Desc: 'The Admin will verify and approve your request. Your mess will be unlocked automatically.',
        processLabel: 'Process',
        bkash: 'bKash Number',
        nagad: 'Nagad Number',
        whatsapp: 'WhatsApp',
        noInfo: 'No payment instructions have been set up by the admin yet.',
        close: 'Got it, Close',
        langToggle: 'বাংলায় দেখুন',
    },
    bn: {
        title: 'পেমেন্ট নির্দেশিকা',
        subtitle: 'আপনার মেস সক্রিয় করতে নিচের ধাপগুলো অনুসরণ করুন',
        step1: 'ধাপ ১ — পেমেন্ট পাঠান',
        step1Desc: 'নিচের যেকোনো একটি নম্বরে বিকাশ, নগদ বা হোয়াটসঅ্যাপের মাধ্যমে মাসিক ফি পাঠান।',
        step2: 'ধাপ ২ — রিকোয়েস্ট পাঠান',
        step2Desc: 'নেভিগেশন বারে "Request Payment" বাটনে ক্লিক করুন এবং ট্রানজেকশন আইডি ও একটি সংক্ষিপ্ত নোট দিন।',
        step3: 'ধাপ ৩ — অনুমোদনের অপেক্ষা করুন',
        step3Desc: 'অ্যাডমিন যাচাই করে অনুমোদন দিলে আপনার মেস স্বয়ংক্রিয়ভাবে আনলক হয়ে যাবে।',
        processLabel: 'প্রক্রিয়া',
        bkash: 'বিকাশ নম্বর',
        nagad: 'নগদ নম্বর',
        whatsapp: 'হোয়াটসঅ্যাপ',
        noInfo: 'অ্যাডমিন এখনো কোনো পেমেন্ট নির্দেশনা সেট করেননি।',
        close: 'বুঝেছি, বন্ধ করুন',
        langToggle: 'View in English',
    },
};

const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ onClose }) => {
    const [settings, setSettings] = useState<SystemSettingsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<'en' | 'bn'>('en');
    const t = content[lang];

    useEffect(() => {
        fetchJson<SystemSettingsDto>('/Settings')
            .then(data => { setSettings(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const parsedSteps = (() => {
        if (!settings?.process) return [];
        try {
            const parsed = JSON.parse(settings.process);
            if (Array.isArray(parsed)) return parsed;
        } catch { }
        return [{ title: t.processLabel, desc: settings.process }];
    })();

    const stepColors = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'];

    return (
        <div className="sim-overlay" onClick={handleBackdropClick}>
            <div className="sim-card" role="dialog" aria-modal="true">

                {/* ── Header ── */}
                <div className="sim-header">
                    <div className="sim-header-left">
                        <div className="sim-icon-wrap">
                            <Info size={20} color="#ffffff" />
                        </div>
                        <div>
                            <h2 className="sim-title">{t.title}</h2>
                            <p className="sim-subtitle">{t.subtitle}</p>
                        </div>
                    </div>
                    <div className="sim-header-actions">
                        <button
                            className="sim-lang-toggle"
                            onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}
                            title="Switch language"
                        >
                            <Globe size={14} />
                            {t.langToggle}
                        </button>
                        <button className="sim-close-btn" onClick={onClose} aria-label="Close">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="sim-body">
                    {loading ? (
                        <div className="sim-loading">
                            <div className="sim-spinner" />
                            <span>Loading...</span>
                        </div>
                    ) : settings ? (
                        <>
                            {/* Steps */}
                            {parsedSteps.length > 0 && (
                                <div className="sim-steps">
                                    {parsedSteps.map((step, idx) => (
                                        <div className="sim-step" key={idx}>
                                            <div
                                                className="sim-step-num"
                                                style={{ background: stepColors[idx % stepColors.length] }}
                                            >
                                                {idx + 1}
                                            </div>
                                            <div className="sim-step-content">
                                                <div className="sim-step-title">{step.title}</div>
                                                <div className="sim-step-desc" style={{ whiteSpace: 'pre-wrap' }}>{step.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Payment numbers */}
                            <div className="sim-payment-grid">
                                {settings.bkashNumber && (
                                    <div className="sim-payment-card sim-bkash">
                                        <div className="sim-payment-icon">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <div className="sim-payment-label">{t.bkash}</div>
                                            <div className="sim-payment-number">{settings.bkashNumber}</div>
                                        </div>
                                    </div>
                                )}
                                {settings.nagadNumber && (
                                    <div className="sim-payment-card sim-nagad">
                                        <div className="sim-payment-icon">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <div className="sim-payment-label">{t.nagad}</div>
                                            <div className="sim-payment-number">{settings.nagadNumber}</div>
                                        </div>
                                    </div>
                                )}
                                {settings.whatsappNumber && (
                                    <div className="sim-payment-card sim-whatsapp">
                                        <div className="sim-payment-icon">
                                            <MessageCircle size={16} />
                                        </div>
                                        <div>
                                            <div className="sim-payment-label">{t.whatsapp}</div>
                                            <div className="sim-payment-number">{settings.whatsappNumber}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!settings.process && !settings.bkashNumber && !settings.nagadNumber && !settings.whatsappNumber && (
                                <div className="sim-empty">{t.noInfo}</div>
                            )}
                        </>
                    ) : (
                        <div className="sim-error">Failed to load settings. Please try again.</div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="sim-footer">
                    <button className="sim-close-main-btn" onClick={onClose}>
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemInfoModal;
