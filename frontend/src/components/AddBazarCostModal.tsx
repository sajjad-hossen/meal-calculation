import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchJson } from '../services/api';

interface User {
    id: number;
    name: string;
}

interface AddBazarCostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { date: string; amount: number; description: string; buyerUserId: number }) => void;
}

const AddBazarCostModal = ({ isOpen, onClose, onAdd }: AddBazarCostModalProps) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [buyerUserId, setBuyerUserId] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchJson<User[]>('/Users').then(setUsers).catch(console.error);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount > 0 && buyerUserId) {
            onAdd({ date, amount, description, buyerUserId });
            onClose();
        } else {
            alert('Please enter a valid amount and select a buyer');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add Bazar Cost</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Buyer</label>
                        <select
                            value={buyerUserId}
                            onChange={(e) => setBuyerUserId(Number(e.target.value))}
                            required
                        >
                            <option value="">Select Buyer</option>
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

                    <div className="form-group" style={{ paddingTop: 0 }}>
                        <label className="form-label">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Chicken, Rice"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Cost
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBazarCostModal;
