import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel' 
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header border-b border-border-color">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle size={20} />
                        <h2 className="modal-title" style={{ color: 'inherit' }}>{title}</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-300">
                        {message}
                    </p>
                </div>

                <div className="modal-actions bg-slate-50 dark:bg-slate-800/50">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button 
                        type="button" 
                        className="btn bg-red-600 hover:bg-red-700 text-white" 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
