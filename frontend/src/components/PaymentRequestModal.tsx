import React, { useState } from 'react';
import { fetchJson } from '../services/api';
import { CheckCircle } from 'lucide-react';

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
        <div className="modal-backdrop" onClick={onClose} style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
                className="modal-box animate-slide-up"
                style={{ 
                    backgroundColor: '#1a202c', 
                    padding: '1.5rem', 
                    borderRadius: '1rem', 
                    width: '100%', 
                    maxWidth: '32rem', 
                    color: 'white', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: 'none'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <span>💳</span> Request Payment Approval
                    </h2>
                    <button onClick={onClose} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }} className="hover:text-white">✕</button>
                </div>

                {success ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', textAlign: 'center', gap: '0.75rem' }}>
                        <CheckCircle size={48} color="#10b981" />
                        <p style={{ fontWeight: '600', color: '#10b981', margin: 0 }}>Request submitted successfully!</p>
                        <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>The admin will review your payment and approve shortly.</p>
                    </div>
                ) : (
                    <>
                        <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '1.5rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
                            Mess: <span style={{ fontWeight: '600', color: 'white' }}>{messName}</span> <br />
                            After completing your payment, fill in the details below. The admin will verify and unlock your mess operations.
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {error && (
                                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.875rem' }}>
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#e5e7eb' }}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={managerEmail}
                                    onChange={e => setManagerEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', backgroundColor: '#2d3748', border: '1px solid #4b5563', borderRadius: '0.5rem', padding: '0.625rem', color: 'white', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Transaction ID */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#e5e7eb' }}>Transaction ID</label>
                                <input
                                    type="text"
                                    placeholder="TX-..."
                                    value={transactionId}
                                    onChange={e => setTransactionId(e.target.value)}
                                    required
                                    style={{ width: '100%', backgroundColor: '#2d3748', border: '1px solid #4b5563', borderRadius: '0.5rem', padding: '0.625rem', color: 'white', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Note */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#e5e7eb' }}>Note (optional)</label>
                                <textarea
                                    placeholder="Any additional details..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    style={{ width: '100%', backgroundColor: '#2d3748', border: '1px solid #4b5563', borderRadius: '0.5rem', padding: '0.625rem', color: 'white', height: '6rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    backgroundColor: loading ? '#4f46e5' : '#4f46e5',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s',
                                    marginTop: '0.5rem',
                                    opacity: loading ? 0.7 : 1
                                }}
                                onMouseOver={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#4338ca'; }}
                                onMouseOut={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#4f46e5'; }}
                            >
                                {loading ? 'SUBMITTING...' : 'SUBMIT PAYMENT REQUEST ↗'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentRequestModal;
