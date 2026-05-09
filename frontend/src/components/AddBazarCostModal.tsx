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
    editingCost?: { id: number; date: string; amount: number; description: string; buyerUserId: number } | null;
    onEdit?: (id: number, data: { id: number; date: string; amount: number; description: string; buyerUserId: number }) => void;
}

const BAZAR_ITEMS = [
    'Rice (চাল)', 'Lentils (ডাল)', 'Oil (তেল)', 'Chicken (মুরগি)', 'Beef (গরু)',
    'Mutton (খাসি)', 'Fish (মাছ)', 'Potato (আলু)', 'Onion (পিঁয়াজ)', 'Garlic (রসুন)',
    'Ginger (আদা)', 'Green Chili (কাঁচা মরিচ)', 'Salt (লবণ)', 'Sugar (চিনি)',
    'Milk (দুধ)', 'Eggs (ডিম)', 'Vegetables (শাক-সবজি)', 'Spices (মসলা)',
    'Flour (আটা/ময়দা)', 'Soap (সাবান)', 'Detergent (ডিটারজেন্ট)'
];

const AddBazarCostModal = ({ isOpen, onClose, onAdd, editingCost, onEdit }: AddBazarCostModalProps) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [buyerUserId, setBuyerUserId] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);

    const isEditMode = !!editingCost;

    useEffect(() => {
        if (isOpen) {
            fetchJson<User[]>('/Users').then(setUsers).catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (editingCost) {
            setDate(editingCost.date.split('T')[0]);
            setAmount(editingCost.amount);
            setDescription(editingCost.description || '');
            // Try to set selected items from description
            if (editingCost.description) {
                const items = editingCost.description.split(', ').filter(i => BAZAR_ITEMS.includes(i));
                setSelectedItems(items);
            } else {
                setSelectedItems([]);
            }
            setBuyerUserId(editingCost.buyerUserId);
        } else {
            setDate(new Date().toISOString().split('T')[0]);
            setAmount(0);
            setDescription('');
            setSelectedItems([]);
            setBuyerUserId(0);
        }
    }, [editingCost, isOpen]);

    const toggleItem = (item: string) => {
        setSelectedItems(prev => {
            const newItems = prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item];
            
            setDescription(newItems.join(', '));
            return newItems;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount > 0 && buyerUserId) {
            if (isEditMode && onEdit && editingCost) {
                onEdit(editingCost.id, { id: editingCost.id, date, amount, description, buyerUserId });
            } else {
                onAdd({ date, amount, description, buyerUserId });
            }
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
                    <h2 className="modal-title">{isEditMode ? 'Edit Bazar Cost' : 'Add Bazar Cost'}</h2>
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
                        <label className="form-label">Select Items</label>
                        <div style={{ position: 'relative' }}>
                            <div 
                                className="input-like"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{ 
                                    minHeight: '45px', 
                                    padding: '8px 12px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--bg-color)'
                                }}
                            >
                                {selectedItems.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Choose items...</span>}
                                {selectedItems.map(item => (
                                    <span key={item} style={{
                                        backgroundColor: 'var(--primary-color)',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {item}
                                        <X size={12} onClick={(e) => { e.stopPropagation(); toggleItem(item); }} style={{ cursor: 'pointer' }} />
                                    </span>
                                ))}
                            </div>
                            
                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    zIndex: 10,
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    marginTop: '4px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    boxShadow: 'var(--shadow-lg)'
                                }}>
                                    {BAZAR_ITEMS.map(item => (
                                        <div 
                                            key={item}
                                            onClick={() => toggleItem(item)}
                                            style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                backgroundColor: selectedItems.includes(item) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                borderBottom: '1px solid var(--border-color)'
                                            }}
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={selectedItems.includes(item)} 
                                                readOnly 
                                                style={{ width: '16px', height: '16px', margin: 0 }}
                                            />
                                            <span style={{ fontSize: '14px' }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group" style={{ paddingTop: 0 }}>
                        <label className="form-label">Description (Manual)</label>
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
                            {isEditMode ? 'Save Changes' : 'Save Cost'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBazarCostModal;
