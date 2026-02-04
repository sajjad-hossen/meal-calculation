
import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import AddBazarCostModal from '../components/AddBazarCostModal';
import AddExtraCostModal from '../components/AddExtraCostModal';

interface Cost {
    id: number;
    amount: number;
    date: string;
    description?: string; // Assuming maybe description exists or just date/amount
}

const Costs = () => {
    const [bazarCosts, setBazarCosts] = useState<Cost[]>([]);
    const [extraCosts, setExtraCosts] = useState<Cost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBazarModalOpen, setIsBazarModalOpen] = useState(false);
    const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);

    const fetchCosts = () => {
        Promise.all([
            fetchJson<Cost[]>('/BazarCosts'),
            fetchJson<Cost[]>('/ExtraCosts')
        ]).then(([bazar, extra]) => {
            setBazarCosts(bazar);
            setExtraCosts(extra);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchCosts();
    }, []);

    const handleAddBazarCost = async (data: { date: string; amount: number; description: string; buyerUserId: number }) => {
        try {
            await fetchJson('/BazarCosts', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            fetchCosts();
        } catch (error) {
            console.error(error);
            alert('Error adding bazar cost');
        }
    };

    const handleAddExtraCost = async (data: { month: string; amount: number; title: string }) => {
        try {
            await fetchJson('/ExtraCosts', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            fetchCosts();
        } catch (error) {
            console.error(error);
            alert('Error adding extra cost');
        }
    };

    const handleDeleteBazarCost = async (id: number) => {
        if (!confirm('Are you sure you want to delete this bazar cost?')) return;
        try {
            await fetchJson(`/BazarCosts/${id}`, {
                method: 'DELETE',
            });
            fetchCosts();
        } catch (error) {
            console.error(error);
            alert('Error deleting bazar cost');
        }
    };

    const handleDeleteExtraCost = async (id: number) => {
        if (!confirm('Are you sure you want to delete this extra cost?')) return;
        try {
            await fetchJson(`/ExtraCosts/${id}`, {
                method: 'DELETE',
            });
            fetchCosts();
        } catch (error) {
            console.error(error);
            alert('Error deleting extra cost');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Bazar Costs</h1>
                    <button className="btn btn-primary" onClick={() => setIsBazarModalOpen(true)}>
                        <Plus size={18} />
                        Add Cost
                    </button>
                </div>

                <AddBazarCostModal
                    isOpen={isBazarModalOpen}
                    onClose={() => setIsBazarModalOpen(false)}
                    onAdd={handleAddBazarCost}
                />
                <div className="card">
                    {loading ? <div className="p-4">Loading...</div> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bazarCosts.map(c => (
                                    <tr key={c.id}>
                                        <td>{new Date(c.date).toLocaleDateString()}</td>
                                        <td>{c.amount.toFixed(2)}</td>
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
                                                        onClick: () => handleDeleteBazarCost(c.id),
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

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Extra Costs</h1>
                    <button className="btn btn-primary" onClick={() => setIsExtraModalOpen(true)}>
                        <Plus size={18} />
                        Add Extra
                    </button>
                </div>

                <AddExtraCostModal
                    isOpen={isExtraModalOpen}
                    onClose={() => setIsExtraModalOpen(false)}
                    onAdd={handleAddExtraCost}
                />
                <div className="card">
                    {loading ? <div className="p-4">Loading...</div> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {extraCosts.map(c => (
                                    <tr key={c.id}>
                                        <td>{new Date(c.date).toLocaleDateString()}</td>
                                        <td>{c.amount.toFixed(2)}</td>
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
                                                        onClick: () => handleDeleteExtraCost(c.id),
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
        </div>
    );
};

export default Costs;
