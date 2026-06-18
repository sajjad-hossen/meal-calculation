
import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import type { UserAccount } from '../types';
import { UserPlus, Edit, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import AddMemberModal from '../components/AddMemberModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../components/AuthContext';

const Members = () => {
    const { user: authUser, isPaymentActive } = useAuth();
    const isManager = authUser?.role === 'Manager' && isPaymentActive;
    const [members, setMembers] = useState<UserAccount[]>([]);
    const [accounts, setAccounts] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'members' | 'accounts'>('members');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
    const [editingMember, setEditingMember] = useState<{ id: number; name: string } | null>(null);

    const fetchMembers = () => {
        setLoading(true);
        fetchJson<UserAccount[]>('/Users')
            .then(data => {
                setMembers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const fetchAccounts = () => {
        setLoading(true);
        fetchJson<UserAccount[]>('/Users/accounts')
            .then(data => {
                setAccounts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (activeTab === 'members') {
            fetchMembers();
        } else {
            fetchAccounts();
        }
    }, [activeTab]);

    const handleAddMember = async (name: string) => {
        try {
            await fetchJson('/Users', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
            fetchMembers();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Error adding member');
        }
    };

    const handleDeleteMember = async (id: number) => {
        try {
            await fetchJson(`/Users/${id}`, {
                method: 'DELETE',
            });
            if (activeTab === 'members') fetchMembers(); else fetchAccounts();
            setMemberToDelete(null);
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const handleEditSubmit = async (id: number, name: string) => {
        try {
            // Fetch the full object first or just send what we have
            const target = (activeTab === 'members' ? members : accounts).find(a => a.id === id);
            if (!target) return;

            await fetchJson(`/Users/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...target, name }),
            });
            if (activeTab === 'members') fetchMembers(); else fetchAccounts();
            setEditingMember(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error editing member:', error);
            alert('Error editing member');
        }
    };

    const toggleMembership = async (user: UserAccount) => {
        try {
            await fetchJson(`/Users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...user, isCalculationMember: !user.isCalculationMember }),
            });
            fetchAccounts();
        } catch (error) {
            console.error('Error toggling membership:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">People Management</h1>
                {isManager && activeTab === 'members' && (
                    <button className="btn btn-primary" onClick={() => { setEditingMember(null); setIsModalOpen(true); }}>
                        <UserPlus size={18} />
                        Add Member
                    </button>
                )}
            </div>

            {isManager && (
                <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                    <button 
                        className={`pb-2 px-1 transition-colors relative ${activeTab === 'members' ? 'text-primary-color font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('members')}
                    >
                        Calculation Members
                        {activeTab === 'members' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-color"></div>}
                    </button>
                    <button 
                        className={`pb-2 px-1 transition-colors relative ${activeTab === 'accounts' ? 'text-primary-color font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('accounts')}
                    >
                        Access Accounts
                        {activeTab === 'accounts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-color"></div>}
                    </button>
                </div>
            )}

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingMember(null); }}
                onAdd={handleAddMember}
                editingMember={editingMember}
                onEdit={handleEditSubmit}
            />

            <ConfirmModal
                isOpen={memberToDelete !== null}
                onClose={() => setMemberToDelete(null)}
                onConfirm={() => memberToDelete && handleDeleteMember(memberToDelete)}
                title="Delete Person"
                message="Are you sure? This will remove them from the system."
                confirmText="Delete"
            />

            <div className="card">
                {loading ? (
                    <div className="text-center p-8 text-slate-500">Loading...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                {activeTab === 'accounts' && <th>Email / Role</th>}
                                <th>Status</th>
                                {isManager && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'members' ? members : accounts).map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="font-medium flex items-center gap-2">
                                            {item.name}
                                            {item.isCalculationMember && activeTab === 'accounts' && (
                                                <span title="Is Mess Member">
                                                    <UserCheck size={14} className="text-emerald-500" />
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    {activeTab === 'accounts' && (
                                        <td>
                                            <div className="text-sm">{item.email || <span className="text-slate-400 italic">No account</span>}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <Shield size={10} /> {item.role}
                                            </div>
                                        </td>
                                    )}
                                    <td>
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    {isManager && (
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {activeTab === 'accounts' && (
                                                    <button 
                                                        onClick={() => toggleMembership(item)}
                                                        className={`p-1.5 rounded transition-colors ${item.isCalculationMember ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                        title={item.isCalculationMember ? "Remove from Mess" : "Add to Mess"}
                                                    >
                                                        {item.isCalculationMember ? <UserX size={18} /> : <UserCheck size={18} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { setEditingMember({ id: item.id, name: item.name }); setIsModalOpen(true); }}
                                                    className="p-1.5 text-slate-400 hover:text-primary-color transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setMemberToDelete(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {(activeTab === 'members' ? members : accounts).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-slate-400">
                                        No {activeTab} found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Members;
