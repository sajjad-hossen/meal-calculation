
import { useEffect, useState, useCallback } from 'react';
import { fetchJson } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Check, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../components/AuthContext';

interface User {
    id: number;
    name: string;
}

interface Meal {
    id: number;
    userId: number;
    user?: { name: string };
    date: string;
    mealCount: number;
}

// A row of meal data for a single date: { [userId]: { id, mealCount } }
interface MealRow {
    date: string;
    meals: Record<number, { id: number; mealCount: number }>;
}

const Meals = () => {
    const { user: authUser, isPaymentActive } = useAuth();
    const isManager = authUser?.role === 'Manager' && isPaymentActive;
    const [members, setMembers] = useState<User[]>([]);
    const [mealRows, setMealRows] = useState<MealRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
    const [savingCells, setSavingCells] = useState<Set<string>>(new Set());
    const [savedCells, setSavedCells] = useState<Set<string>>(new Set());
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [usersData, mealsData] = await Promise.all([
                fetchJson<User[]>('/Users'),
                fetchJson<Meal[]>('/Meals'),
            ]);
            setMembers(usersData);

            // Group meals by date
            const dateMap: Record<string, Record<number, { id: number; mealCount: number }>> = {};
            mealsData.forEach((meal) => {
                const dateKey = meal.date.split('T')[0];
                if (!dateMap[dateKey]) {
                    dateMap[dateKey] = {};
                }
                dateMap[dateKey][meal.userId] = { id: meal.id, mealCount: meal.mealCount };
            });

            // Convert to sorted array of rows (newest first)
            const rows: MealRow[] = Object.entries(dateMap)
                .map(([date, meals]) => ({ date, meals }))
                .sort((a, b) => b.date.localeCompare(a.date));

            setMealRows(rows);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddRow = () => {
        // Check if date row already exists
        if (mealRows.some((row) => row.date === newDate)) {
            alert('A row for this date already exists. Edit it directly in the table.');
            return;
        }
        // Add empty row at correct sorted position
        const newRow: MealRow = { date: newDate, meals: {} };
        const updated = [...mealRows, newRow].sort((a, b) => b.date.localeCompare(a.date));
        setMealRows(updated);
    };

    const handleMealChange = async (date: string, userId: number, value: number) => {
        const cellKey = `${date}-${userId}`;
        setSavingCells((prev) => new Set(prev).add(cellKey));

        try {
            // The backend POST upserts (updates if exists, creates if not)
            await fetchJson('/Meals', {
                method: 'POST',
                body: JSON.stringify({ userId, date, mealCount: value }),
            });

            // Update local state
            setMealRows((prev) =>
                prev.map((row) => {
                    if (row.date === date) {
                        const existingMeal = row.meals[userId];
                        return {
                            ...row,
                            meals: {
                                ...row.meals,
                                [userId]: {
                                    id: existingMeal?.id || 0,
                                    mealCount: value,
                                },
                            },
                        };
                    }
                    return row;
                })
            );

            // Show saved indicator
            setSavedCells((prev) => new Set(prev).add(cellKey));
            setTimeout(() => {
                setSavedCells((prev) => {
                    const next = new Set(prev);
                    next.delete(cellKey);
                    return next;
                });
            }, 1500);
        } catch (error) {
            console.error('Error saving meal:', error);
            alert('Error saving meal');
        } finally {
            setSavingCells((prev) => {
                const next = new Set(prev);
                next.delete(cellKey);
                return next;
            });
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    // Calculate totals per member (column total)
    const memberTotals: Record<number, number> = {};
    members.forEach((m) => {
        memberTotals[m.id] = mealRows.reduce((sum, row) => {
            return sum + (row.meals[m.id]?.mealCount || 0);
        }, 0);
    });

    // Calculate total per date (row total)
    const dateTotals: Record<string, number> = {};
    mealRows.forEach((row) => {
        dateTotals[row.date] = Object.values(row.meals).reduce(
            (sum, m) => sum + m.mealCount,
            0
        );
    });

    const grandTotal = Object.values(memberTotals).reduce((sum, t) => sum + t, 0);

    const handleClearAll = async () => {
        try {
            await fetchJson('/Meals', { method: 'DELETE' });
            setMealRows([]);
            setShowClearConfirm(false);
            toast.success('All meals cleared successfully!');
        } catch (error) {
            console.error('Error clearing meals:', error);
            alert('Error clearing all meals');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daily Meals</h1>
                {isManager && (
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border-color)',
                                background: 'var(--card-bg)',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                            }}
                        />
                        <button className="btn btn-primary" onClick={handleAddRow}>
                            <Plus size={18} />
                            Add Date
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowClearConfirm(true)}
                            style={{ color: '#ef4444', borderColor: '#ef4444' }}
                            disabled={mealRows.length === 0}
                        >
                            <Trash2 size={18} />
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={handleClearAll}
                title="Clear All Meals"
                message="Are you sure you want to delete ALL meal entries? This action cannot be undone."
                confirmText="Clear All"
            />

            <div className="card" style={{ overflow: 'auto' }}>
                {loading ? (
                    <div className="p-4 text-center">Loading meals...</div>
                ) : members.length === 0 ? (
                    <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                        No members found. Add members first.
                    </div>
                ) : (
                    <table style={{ minWidth: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ position: 'sticky', left: 0, background: 'var(--card-bg)', zIndex: 2, minWidth: '120px' }}>
                                    Date
                                </th>
                                {members.map((member) => (
                                    <th key={member.id} style={{ textAlign: 'center', minWidth: '90px' }}>
                                        {member.name}
                                    </th>
                                ))}
                                <th style={{ textAlign: 'center', minWidth: '80px', fontWeight: 700 }}>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mealRows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={members.length + 2}
                                        style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}
                                    >
                                        No meal data yet. Pick a date and click "Add Date" to start.
                                    </td>
                                </tr>
                            ) : (
                                mealRows.map((row) => (
                                    <tr key={row.date}>
                                        <td
                                            style={{
                                                position: 'sticky',
                                                left: 0,
                                                background: 'var(--card-bg)',
                                                zIndex: 1,
                                                fontWeight: 500,
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {formatDate(row.date)}
                                        </td>
                                        {members.map((member) => {
                                            const cellKey = `${row.date}-${member.id}`;
                                            const mealData = row.meals[member.id];
                                            const currentValue = mealData?.mealCount ?? 0;
                                            const isSaving = savingCells.has(cellKey);
                                            const isSaved = savedCells.has(cellKey);

                                            return (
                                                <td key={member.id} style={{ textAlign: 'center', padding: '0.25rem' }}>
                                                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <select
                                                            value={currentValue}
                                                            onChange={(e) =>
                                                                handleMealChange(row.date, member.id, Number(e.target.value))
                                                            }
                                                            disabled={!isManager || isSaving}
                                                            style={(() => {
                                                                // Color coding by meal count
                                                                 const colorMap: Record<number, { bg: string; border: string; color: string }> = {
                                                                    0: { bg: 'var(--card-bg)', border: 'var(--border-color)', color: 'var(--text-secondary)' },
                                                                    1: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.5)', color: 'rgb(59, 130, 246)' },
                                                                    2: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.5)', color: 'rgb(34, 197, 94)' },
                                                                    3: { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.5)', color: 'rgb(249, 115, 22)' },
                                                                    4: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.5)', color: 'rgb(239, 68, 68)' },
                                                                    5: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.5)', color: 'rgb(168, 85, 247)' },
                                                                    6: { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.5)', color: 'rgb(236, 72, 153)' },
                                                                    7: { bg: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.5)', color: 'rgb(14, 165, 233)' },
                                                                    8: { bg: 'rgba(20, 184, 166, 0.15)', border: 'rgba(20, 184, 166, 0.5)', color: 'rgb(20, 184, 166)' },
                                                                    9: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.5)', color: 'rgb(245, 158, 11)' },
                                                                };
                                                                // For values 10 and above, use a shared high-intensity style
                                                                const maxStyle = { bg: 'rgba(220, 38, 38, 0.2)', border: 'rgba(220, 38, 38, 0.6)', color: 'rgb(220, 38, 38)' };
                                                                const scheme = currentValue >= 10 ? maxStyle : (colorMap[currentValue] || colorMap[0]);
                                                                return {
                                                                    padding: '0.35rem 0.5rem',
                                                                    borderRadius: '0.375rem',
                                                                    border: '1px solid',
                                                                    background: isSaved ? 'rgba(34, 197, 94, 0.25)' : scheme.bg,
                                                                    color: scheme.color,
                                                                    fontWeight: currentValue > 0 ? 600 : 400,
                                                                    fontSize: '0.875rem',
                                                                    width: '60px',
                                                                    textAlign: 'center' as const,
                                                                    cursor: isSaving ? 'wait' : 'pointer',
                                                                    transition: 'all 0.3s ease',
                                                                    borderColor: isSaved ? 'rgb(34, 197, 94)' : scheme.border,
                                                                };
                                                            })()}
                                                        >
                                                            {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                                                                <option key={n} value={n}>
                                                                    {n}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {isSaved && (
                                                            <Check
                                                                size={14}
                                                                style={{
                                                                    color: 'rgb(34, 197, 94)',
                                                                    position: 'absolute',
                                                                    right: '-20px',
                                                                    animation: 'fadeIn 0.2s ease-in',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 600,
                                                color: 'var(--primary-color)',
                                            }}
                                        >
                                            {dateTotals[row.date] || 0}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {mealRows.length > 0 && (
                            <tfoot>
                                <tr
                                    style={{
                                        borderTop: '2px solid var(--border-color)',
                                        fontWeight: 700,
                                    }}
                                >
                                    <td
                                        style={{
                                            position: 'sticky',
                                            left: 0,
                                            background: 'var(--card-bg)',
                                            zIndex: 1,
                                        }}
                                    >
                                        Total
                                    </td>
                                    {members.map((member) => (
                                        <td
                                            key={member.id}
                                            style={{
                                                textAlign: 'center',
                                                color: 'var(--primary-color)',
                                            }}
                                        >
                                            {memberTotals[member.id] || 0}
                                        </td>
                                    ))}
                                    <td
                                        style={{
                                            textAlign: 'center',
                                            color: 'var(--primary-color)',
                                            fontSize: '1.05rem',
                                        }}
                                    >
                                        {grandTotal}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                )}
            </div>
        </div>
    );
};

export default Meals;
