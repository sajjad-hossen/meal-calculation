import { useState } from 'react';
import { X } from 'lucide-react';

interface AddExtraCostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { month: string; amount: number; title: string }) => void;
}

const AddExtraCostModal = ({ isOpen, onClose, onAdd }: AddExtraCostModalProps) => {
    const [month, setMonth] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState<number>(0);
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount > 0 && title.trim()) {
            onAdd({ month, amount, title });
            onClose();
        } else {
            alert('Please enter a valid amount and title');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add Extra Cost</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. House Rent, Wifi, Gas"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ paddingTop: 0 }}>
                        <label className="form-label">Month</label>
                        <input
                            type="date"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
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
                            Save Cost
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExtraCostModal;
