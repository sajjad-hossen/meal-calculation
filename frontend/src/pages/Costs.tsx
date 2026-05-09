import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddBazarCostModal from '../components/AddBazarCostModal';
import ConfirmModal from '../components/ConfirmModal';

interface Cost {
  id: number;
  amount: number;
  date: string;
  description?: string;
  buyer?: {
    name: string;
  };
  buyerUserId?: number;
}

const Costs = () => {
  const [bazarCosts, setBazarCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBazarModalOpen, setIsBazarModalOpen] = useState(false);
  const [bazarToDelete, setBazarToDelete] = useState<number | null>(null);
  const [editingCost, setEditingCost] = useState<{ id: number; date: string; amount: number; description: string; buyerUserId: number } | null>(null);

  const fetchCosts = () => {
    fetchJson<Cost[]>('/BazarCosts')
      .then((bazar) => {
        setBazarCosts(bazar);
        setLoading(false);
      })
      .catch(err => {
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

  const handleEditCost = (cost: Cost) => {
    setEditingCost({
      id: cost.id,
      date: cost.date.split('T')[0],
      amount: cost.amount,
      description: cost.description || '',
      buyerUserId: cost.buyerUserId || 0,
    });
    setIsBazarModalOpen(true);
  };

  const handleEditSubmit = async (id: number, data: { id: number; date: string; amount: number; description: string; buyerUserId: number }) => {
    try {
      await fetchJson(`/BazarCosts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      fetchCosts();
      setEditingCost(null);
      setIsBazarModalOpen(false);
    } catch (error) {
      console.error('Error editing bazar cost:', error);
      alert('Error editing bazar cost');
    }
  };

  const handleDeleteBazarCost = async (id: number) => {
    try {
      await fetchJson(`/BazarCosts/${id}`, {
        method: 'DELETE',
      });
      fetchCosts();
      setBazarToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsBazarModalOpen(false);
    setEditingCost(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bazar Costs</h1>
        <button className="btn btn-primary" onClick={() => { setEditingCost(null); setIsBazarModalOpen(true); }}>
          <Plus size={18} /> Add Bazar Cost
        </button>
      </div>
      <AddBazarCostModal
        isOpen={isBazarModalOpen}
        onClose={handleModalClose}
        onAdd={handleAddBazarCost}
        editingCost={editingCost}
        onEdit={handleEditSubmit}
      />
      <ConfirmModal
        isOpen={bazarToDelete !== null}
        onClose={() => setBazarToDelete(null)}
        onConfirm={() => {
          if (bazarToDelete) handleDeleteBazarCost(bazarToDelete);
        }}
        title="Delete Bazar Cost"
        message="Are you sure you want to delete this bazar cost?"
        confirmText="Delete"
      />
      <div className="card">
        {loading ? (
          <div className="p-4 text-center">Loading bazar costs...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bazarCosts.map(c => (
                <tr key={c.id}>
                  <td>{new Date(c.date).toLocaleDateString()}</td>
                  <td>{c.buyer?.name || 'N/A'}</td>
                  <td>{c.amount.toFixed(2)}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditCost(c)}
                        className="text-slate-400 hover:text-primary-color transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setBazarToDelete(c.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default Costs;
