import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchJson } from '../services/api';

interface User {
    id: number;
    name: string;
}

interface AddDepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { userId: number; date: string; amount: number }) => void;
}

const AddDepositModal = ({ isOpen, onClose, onAdd }: AddDepositModalProps) => {
    const [userId, setUserId] = useState<number>(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchJson<User[]>('/Users').then(setUsers).catch(console.error);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId && amount > 0) {
            onAdd({ userId, date, amount });
            onClose();
        } else {
            alert('Please select a member and enter a valid amount');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add Deposit</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Member</label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(Number(e.target.value))}
                            required
                        >
                            <option value="">Select Member</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ paddingTop: 0 }}>
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ paddingTop: 0 }}>
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Deposit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepositModal;
