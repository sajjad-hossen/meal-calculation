
import { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';
import type { UserSummaryDto } from '../types';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import AddMemberModal from '../components/AddMemberModal';

interface Member extends UserSummaryDto {
    // extending summary for now, but real member model might differ
    status?: string;
}

const Members = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (!confirm('Are you sure you want to delete this member? This will also delete their meals and deposits.')) return;

        try {
            await fetchJson(`/Users/${id}`, {
                method: 'DELETE',
            });
            fetchMembers();
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Error deleting member');
        }
    };

    const handleEditMember = (member: Member) => {
        alert(`Edit feature for ${member.name} is coming soon!`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={18} />
                    Add Member
                </button>
            </div>

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddMember}
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
                                <tr key={member.userId}>
                                    <td>
                                        <div className="font-medium">{member.name}</div>
                                    </td>
                                    <td>
                                        <span className="text-sm px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <Dropdown
                                            items={[
                                                {
                                                    label: 'Edit',
                                                    icon: Edit,
                                                    onClick: () => handleEditMember(member)
                                                },
                                                {
                                                    label: 'Delete',
                                                    icon: Trash2,
                                                    onClick: () => handleDeleteMember(member.userId),
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

export default Members;
