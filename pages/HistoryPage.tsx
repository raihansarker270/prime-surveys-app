import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { WithdrawalRecord } from '../types';

const StatusBadge: React.FC<{ status: WithdrawalRecord['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const statusClasses = {
        Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
        Completed: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200",
        Failed: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}


const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  // The user object from context is now always up-to-date from the server
  const history = [...(user.withdrawalHistory || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Withdrawal History</h1>
      
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
        {history.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>You haven't made any withdrawals yet.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {history.map(record => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{new Date(record.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{record.optionName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">${(record.amount / 100).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={record.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
