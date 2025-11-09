import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types';

const EditUserModal: React.FC<{ user: User; onClose: () => void; onSave: (userId: string, updates: Partial<User>) => void }> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [balance, setBalance] = useState((user.balance / 100).toFixed(2));
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        await onSave(user.id, { name, balance: Math.round(parseFloat(balance) * 100) });
        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Edit User: {user.email}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Balance ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="flex justify-end items-center mt-6 space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition" disabled={isLoading}>Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:bg-cyan-400" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const UserManagementPage: React.FC = () => {
    const { adminGetAllUsers, adminUpdateUser, adminDeleteUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [filter, setFilter] = useState('');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const fetchedUsers = await adminGetAllUsers();
            setUsers(fetchedUsers);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    }, [adminGetAllUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSaveUser = async (userId: string, updates: Partial<User>) => {
        try {
            await adminUpdateUser(userId, updates);
            fetchUsers(); // Refresh the list
        } catch (err) {
            alert('Failed to update user.');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await adminDeleteUser(userId);
                fetchUsers(); // Refresh the list
            } catch (err) {
                alert('Failed to delete user.');
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u => u.role !== 'admin' && (
            u.name.toLowerCase().includes(filter.toLowerCase()) || 
            u.email.toLowerCase().includes(filter.toLowerCase())
        ));
    }, [users, filter]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h2>
            
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                 <input
                    type="text"
                    placeholder="Filter by name or email..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Balance</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center p-4">Loading users...</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${(user.balance / 100).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => setEditingUser(user)} className="text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-200">Edit</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
        </div>
    );
};

export default UserManagementPage;
