
import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddDepositModal from '../components/AddDepositModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../components/AuthContext';

interface Deposit {
    id: number;
    userId: number;
    user?: {
        name: string;
    };
    amount: number;
    date: string;
}

const Deposits = () => {
    const { user: authUser, isPaymentActive } = useAuth();
    const isManager = authUser?.role === 'Manager' && isPaymentActive;
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [depositToDelete, setDepositToDelete] = useState<number | null>(null);
    const [editingDeposit, setEditingDeposit] = useState<{ id: number; userId: number; date: string; amount: number } | null>(null);

    const fetchDeposits = () => {
        fetchJson<Deposit[]>('/Deposits')
            .then(data => {
                setDeposits(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const handleAddDeposit = async (data: { userId: number; date: string; amount: number }) => {
        try {
            await fetchJson('/Deposits', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            fetchDeposits();
        } catch (error) {
            console.error(error);
            alert('Error adding deposit');
        }
    };

    const handleDeleteDeposit = async (id: number) => {
        try {
            await fetchJson(`/Deposits/${id}`, {
                method: 'DELETE',
            });
            fetchDeposits();
            setDepositToDelete(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditDeposit = (deposit: Deposit) => {
        setEditingDeposit({
            id: deposit.id,
            userId: deposit.userId,
            date: deposit.date.split('T')[0],
            amount: deposit.amount,
        });
        setIsModalOpen(true);
    };

    const handleEditSubmit = async (id: number, data: { id: number; userId: number; date: string; amount: number }) => {
        try {
            await fetchJson(`/Deposits/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            fetchDeposits();
            setEditingDeposit(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error editing deposit:', error);
            alert('Error editing deposit');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingDeposit(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Deposits</h1>
                {isManager && (
                    <button className="btn btn-primary" onClick={() => { setEditingDeposit(null); setIsModalOpen(true); }}>
                        <Plus size={18} />
                        Add Deposit
                    </button>
                )}
            </div>

            <AddDepositModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onAdd={handleAddDeposit}
                editingDeposit={editingDeposit}
                onEdit={handleEditSubmit}
            />

            <ConfirmModal
                isOpen={depositToDelete !== null}
                onClose={() => setDepositToDelete(null)}
                onConfirm={() => {
                    if (depositToDelete) handleDeleteDeposit(depositToDelete);
                }}
                title="Delete Deposit"
                message="Are you sure you want to delete this deposit?"
                confirmText="Delete"
            />

            <div className="card">
                {loading ? (
                    <div className="p-4 text-center">Loading deposits...</div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Member</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposits.map((d) => (
                                    <tr key={d.id}>
                                        <td className="whitespace-nowrap">{new Date(d.date).toLocaleDateString()}</td>
                                        <td className="whitespace-nowrap">{d.user?.name || d.userId}</td>
                                        <td>{d.amount.toFixed(2)}</td>
                                        <td>
                                            {isManager && (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleEditDeposit(d)}
                                                        className="text-slate-400 hover:text-primary-color transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDepositToDelete(d.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deposits;
