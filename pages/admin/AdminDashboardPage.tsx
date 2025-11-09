import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement, linkTo: string }> = ({ title, value, icon, linkTo }) => (
    <Link to={linkTo} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-500 flex items-center justify-center">
            {icon}
        </div>
    </Link>
);

const AdminDashboardPage: React.FC = () => {
    // FIX: Replaced `getAllUsers` with `adminGetAllUsers` and added `adminGetAllWithdrawals`.
    // The component has been refactored to handle asynchronous data fetching correctly.
    const { adminGetAllUsers, adminGetAllWithdrawals } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingWithdrawals: 0,
        totalBalance: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            setError('');
            try {
                const [users, withdrawals] = await Promise.all([
                    adminGetAllUsers(),
                    adminGetAllWithdrawals(),
                ]);

                const totalUsers = users.length;
                const totalBalance = users.reduce((acc, user) => acc + user.balance, 0);
                const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending').length;

                setStats({ totalUsers, totalBalance, pendingWithdrawals });
            } catch (err) {
                setError('Failed to fetch dashboard statistics.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [adminGetAllUsers, adminGetAllWithdrawals]);

    if (isLoading) {
        return (
             <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
                <p>Loading statistics...</p>
            </div>
        )
    }

    if (error) {
        return (
             <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Total Users" 
                    value={stats.totalUsers}
                    linkTo="/admin/users"
                    icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                 <StatCard 
                    title="Pending Withdrawals" 
                    value={stats.pendingWithdrawals}
                    linkTo="/admin/withdrawals"
                    icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                 <StatCard 
                    title="Total Platform Balance" 
                    value={`$${(stats.totalBalance/100).toFixed(2)}`}
                    linkTo="#"
                    icon={<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
