import React, { useEffect, useState } from 'react';
import { X, Info, Phone, MessageCircle } from 'lucide-react';
import { fetchJson } from '../services/api';
import type { SystemSettingsDto } from '../types';

interface SystemInfoModalProps {
    onClose: () => void;
}

const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ onClose }) => {
    const [settings, setSettings] = useState<SystemSettingsDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJson<SystemSettingsDto>('/Settings')
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Info size={20} />
                        <h2 className="text-lg font-bold">Payment Instructions</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : settings ? (
                        <div className="space-y-6">
                            {settings.process && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Process</h3>
                                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                                        {settings.process}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {settings.bkashNumber && (
                                    <div className="flex items-center gap-3 p-3 border border-pink-100 bg-pink-50 rounded-lg">
                                        <div className="p-2 bg-pink-100 text-pink-600 rounded-full">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-pink-600 font-semibold uppercase">bKash Number</div>
                                            <div className="font-mono text-gray-800 font-bold">{settings.bkashNumber}</div>
                                        </div>
                                    </div>
                                )}
                                
                                {settings.nagadNumber && (
                                    <div className="flex items-center gap-3 p-3 border border-orange-100 bg-orange-50 rounded-lg">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-orange-600 font-semibold uppercase">Nagad Number</div>
                                            <div className="font-mono text-gray-800 font-bold">{settings.nagadNumber}</div>
                                        </div>
                                    </div>
                                )}

                                {settings.whatsappNumber && (
                                    <div className="flex items-center gap-3 p-3 border border-emerald-100 bg-emerald-50 rounded-lg">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                            <MessageCircle size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-emerald-600 font-semibold uppercase">WhatsApp</div>
                                            <div className="font-mono text-gray-800 font-bold">{settings.whatsappNumber}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {!settings.process && !settings.bkashNumber && !settings.nagadNumber && !settings.whatsappNumber && (
                                <div className="text-center text-gray-500 py-4">
                                    No payment instructions have been set up by the admin yet.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-red-500 py-4">Failed to load settings.</div>
                    )}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemInfoModal;
