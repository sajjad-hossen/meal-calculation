import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchJson } from '../services/api';

interface User {
    id: number;
    name: string;
}

interface AddMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { userId: number; date: string; mealCount: number }) => void;
}

const AddMealModal = ({ isOpen, onClose, onAdd }: AddMealModalProps) => {
    const [userId, setUserId] = useState<number>(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mealCount, setMealCount] = useState(1);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchJson<User[]>('/Users').then(setUsers).catch(console.error);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId && mealCount > 0) {
            onAdd({ userId, date, mealCount });
            onClose();
        } else {
            alert('Please select a member and enter a valid meal count');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add Meal</h2>
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
                        <label className="form-label">Meal Count</label>
                        <input
                            type="number"
                            step="0.5"
                            value={mealCount}
                            onChange={(e) => setMealCount(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Meal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMealModal;
