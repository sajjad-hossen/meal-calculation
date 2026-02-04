
import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import AddMealModal from '../components/AddMealModal';

interface Meal {
    id: number;
    userId: number;
    date: string;
    mealCount: number;
    // We might want to joint this with User name in backend, or fetch users to map names
}

const Meals = () => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMeals = () => {
        fetchJson<Meal[]>('/Meals')
            .then(data => {
                setMeals(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    const handleAddMeal = async (data: { userId: number; date: string; mealCount: number }) => {
        try {
            await fetchJson('/Meals', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            fetchMeals();
        } catch (error) {
            console.error(error);
            alert('Error adding meal');
        }
    };

    const handleDeleteMeal = async (id: number) => {
        if (!confirm('Are you sure you want to delete this meal entry?')) return;
        try {
            await fetchJson(`/Meals/${id}`, {
                method: 'DELETE',
            });
            fetchMeals();
        } catch (error) {
            console.error(error);
            alert('Error deleting meal');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daily Meals</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Meal
                </button>
            </div>

            <AddMealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddMeal}
            />

            <div className="card">
                {loading ? (
                    <div className="p-4 text-center">Loading meals...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User ID</th>
                                <th>Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meals.map((meal) => (
                                <tr key={meal.id}>
                                    <td>{new Date(meal.date).toLocaleDateString()}</td>
                                    <td>{meal.userId}</td>
                                    <td>{meal.mealCount}</td>
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
                                                    onClick: () => handleDeleteMeal(meal.id),
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

export default Meals;
