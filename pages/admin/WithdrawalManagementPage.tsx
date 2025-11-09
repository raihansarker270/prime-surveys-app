import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { WithdrawalRecord } from '../../types';

type WithdrawalWithUser = WithdrawalRecord & { userName: string; userId: string; email: string; };

const StatusBadge: React.FC<{ status: WithdrawalRecord['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const statusClasses = {
        Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
        Completed: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200",
        Failed: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}

const WithdrawalManagementPage: React.FC = () => {
    const { adminGetAllWithdrawals, adminUpdateWithdrawal } = useAuth();
    const [allWithdrawals, setAllWithdrawals] = useState<WithdrawalWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'Failed'>('Pending');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await adminGetAllWithdrawals();
            setAllWithdrawals(data);
        } catch (err) {
            setError('Failed to fetch withdrawal requests.');
        } finally {
            setIsLoading(false);
        }
    }, [adminGetAllWithdrawals]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredWithdrawals = useMemo(() => {
        if (filter === 'All') return allWithdrawals;
        return allWithdrawals.filter(w => w.status === filter);
    }, [allWithdrawals, filter]);

    const handleUpdateStatus = async (userId: string, withdrawalId: string, status: WithdrawalRecord['status']) => {
        try {
            await adminUpdateWithdrawal(userId, withdrawalId, status);
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Withdrawal Management</h2>
            
            {error && <p className="text-red-500">{error}</p>}

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <div className="flex space-x-2">
                    {(['Pending', 'Completed', 'Failed', 'All'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${filter === f ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                {filter === 'Pending' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center p-4">Loading withdrawals...</td></tr>
                            ) : filteredWithdrawals.map(w => (
                                <tr key={w.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{w.userName} ({w.email})</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(w.date).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${(w.amount / 100).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{w.optionName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={w.status} /></td>
                                    {w.status === 'Pending' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleUpdateStatus(w.userId, w.id, 'Completed')} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200">Approve</button>
                                            <button onClick={() => handleUpdateStatus(w.userId, w.id, 'Failed')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Reject</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredWithdrawals.length === 0 && !isLoading && <p className="p-4 text-center text-gray-500 dark:text-gray-400">No withdrawals found for this filter.</p>}
                </div>
            </div>
        </div>
    );
};

export default WithdrawalManagementPage;
