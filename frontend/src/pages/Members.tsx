
import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import type { UserSummaryDto } from '../types';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import AddMemberModal from '../components/AddMemberModal';
import ConfirmModal from '../components/ConfirmModal';

interface Member extends UserSummaryDto {
    // extending summary for now, but real member model might differ
    id: number;
    status?: string;
}

const Members = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
    const [editingMember, setEditingMember] = useState<{ id: number; name: string } | null>(null);

    const fetchMembers = () => {
        fetchJson<Member[]>('/Users')
            .then(data => {
                setMembers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAddMember = async (name: string) => {
        try {
            await fetchJson('/Users', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
            fetchMembers(); // Refresh the list
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
            fetchMembers();
            setMemberToDelete(null);
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const handleEditMember = (member: Member) => {
        setEditingMember({ id: member.id, name: member.name });
        setIsModalOpen(true);
    };

    const handleEditSubmit = async (id: number, name: string) => {
        try {
            await fetchJson(`/Users/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ id, name }),
            });
            fetchMembers();
            setEditingMember(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error editing member:', error);
            alert('Error editing member');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members</h1>
                <button className="btn btn-primary" onClick={() => { setEditingMember(null); setIsModalOpen(true); }}>
                    <UserPlus size={18} />
                    Add Member
                </button>
            </div>

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onAdd={handleAddMember}
                editingMember={editingMember}
                onEdit={handleEditSubmit}
            />

            <ConfirmModal
                isOpen={memberToDelete !== null}
                onClose={() => setMemberToDelete(null)}
                onConfirm={() => {
                    if (memberToDelete) handleDeleteMember(memberToDelete);
                }}
                title="Delete Member"
                message="Are you sure you want to delete this member? They will be removed from the list, but their past data will remain for historical calculation."
                confirmText="Delete"
            />

            <div className="card">
                {loading ? (
                    <div className="text-center p-4">Loading members...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="font-medium">{member.name}</div>
                                    </td>
                                    <td>
                                        <span className="text-sm px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEditMember(member)}
                                                className="text-slate-400 hover:text-primary-color transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => setMemberToDelete(member.id)}
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

export default Members;
