import { useState } from 'react';
import { X } from 'lucide-react';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string) => void;
}

const AddMemberModal = ({ isOpen, onClose, onAdd }: AddMemberModalProps) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
            setName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add New Member</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="memberName" className="form-label">
                            Member Name
                        </label>
                        <input
                            id="memberName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter member name"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;
