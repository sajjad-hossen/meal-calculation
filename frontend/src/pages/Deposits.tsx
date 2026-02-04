
import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import AddDepositModal from '../components/AddDepositModal';

interface Deposit {
    id: number;
    userId: number;
    amount: number;
    date: string;
}

const Deposits = () => {
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (!confirm('Are you sure you want to delete this deposit?')) return;
        try {
            await fetchJson(`/Deposits/${id}`, {
                method: 'DELETE',
            });
            fetchDeposits();
        } catch (error) {
            console.error(error);
            alert('Error deleting deposit');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Deposits</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Deposit
                </button>
            </div>

            <AddDepositModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDeposit}
            />

            <div className="card">
                {loading ? (
                    <div className="p-4 text-center">Loading deposits...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User ID</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deposits.map((d) => (
                                <tr key={d.id}>
                                    <td>{new Date(d.date).toLocaleDateString()}</td>
                                    <td>{d.userId}</td>
                                    <td>{d.amount.toFixed(2)}</td>
                                    <td>
                                        <Dropdown
                                            items={[
                                                {
                                                    label: 'Edit',
                                                    icon: Edit,
                                                    onClick: () => alert('Edit feature coming soon!')
                                                },
                                                {
                                                    label: 'Delete',
                                                    icon: Trash2,
                                                    onClick: () => handleDeleteDeposit(d.id),
                                                    className: 'text-red-500'
                                                }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Deposits;
