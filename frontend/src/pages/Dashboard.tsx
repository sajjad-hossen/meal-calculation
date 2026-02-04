
import { useEffect, useState } from 'react';
import type { SummaryDto } from '../types';
import { fetchJson } from '../services/api';
import { TrendingUp, Users, DollarSign, Utensils } from 'lucide-react';

const Dashboard = () => {
    const [summary, setSummary] = useState<SummaryDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJson<SummaryDto>('/Summary')
            .then(data => {
                setSummary(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-muted">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!summary) return null;

    const stats = [
        { label: 'Meal Rate', value: summary.mealRate.toFixed(2), icon: TrendingUp, color: 'text-green-500' },
        { label: 'Total Members', value: summary.totalMembers, icon: Users, color: 'text-blue-500' },
        { label: 'Total Meals', value: summary.totalMeal, icon: Utensils, color: 'text-orange-500' },
        { label: 'Total Cost', value: summary.totalCost.toFixed(2), icon: DollarSign, color: 'text-red-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl mb-4">Dashboard</h1>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="card flex items-center gap-4">
                        <div className={`p-3 rounded-full bg-opacity-10 ${stat.color} bg-current`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div>
                            <div className="text-sm text-muted">{stat.label}</div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <h2 className="text-xl mb-4">Member Balances</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Meals</th>
                                <th>Deposit</th>
                                <th>Cost</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.userSummaries.map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.name}</td>
                                    <td>{user.totalMeal}</td>
                                    <td>{user.totalDeposit.toFixed(2)}</td>
                                    <td>{user.mealCost.toFixed(2)}</td>
                                    <td style={{
                                        color: user.balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)',
                                        fontWeight: 'bold'
                                    }}>
                                        {user.balance.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
