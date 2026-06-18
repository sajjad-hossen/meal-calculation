import React, { useState } from 'react';
import { fetchJson } from '../services/api';
import { X, Send, CreditCard, Mail, FileText, CheckCircle } from 'lucide-react';

interface PaymentRequestModalProps {
    messName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentRequestModal: React.FC<PaymentRequestModalProps> = ({ messName, onClose, onSuccess }) => {
    const [managerEmail, setManagerEmail] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await fetchJson('/PaymentRequest', {
                method: 'POST',
                body: JSON.stringify({ managerEmail, transactionId, note }),
                headers: { 'Content-Type': 'application/json' },
            });
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-box"
                style={{ maxWidth: '480px' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-100">
                            <CreditCard size={22} className="text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Request Payment Approval</h2>
                            <p className="text-sm text-muted">Mess: <span className="font-semibold">{messName}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                        <CheckCircle size={48} className="text-green-500" />
                        <p className="font-semibold text-green-700">Request submitted successfully!</p>
                        <p className="text-sm text-muted">The admin will review your payment and approve shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="info-banner">
                            <p className="text-sm text-amber-800">
                                After completing your payment, fill in the details below. The admin will verify and unlock your mess operations.
                            </p>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-1.5">
                                <Mail size={14} /> Gmail / Email
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="your@gmail.com"
                                value={managerEmail}
                                onChange={e => setManagerEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Transaction ID */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-1.5">
                                <CreditCard size={14} /> Transaction ID
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. TXN123456789"
                                value={transactionId}
                                onChange={e => setTransactionId(e.target.value)}
                                required
                            />
                        </div>

                        {/* Note */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-1.5">
                                <FileText size={14} /> Note (optional)
                            </label>
                            <textarea
                                className="form-input"
                                rows={3}
                                placeholder="Any additional information..."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center justify-center gap-2 mt-2"
                        >
                            <Send size={16} />
                            {loading ? 'Submitting...' : 'Submit Payment Request'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PaymentRequestModal;
