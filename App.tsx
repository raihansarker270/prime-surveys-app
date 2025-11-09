import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SurveysPage from './pages/SurveysPage';
import WithdrawPage from './pages/WithdrawPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import WithdrawalManagementPage from './pages/admin/WithdrawalManagementPage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();
    return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

const AppContent: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200">
            {!user?.role.includes('admin') && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* User Routes */}
                    <Route path="/dashboard" element={<PrivateRoute><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><DashboardPage /></div></PrivateRoute>} />
                    <Route path="/surveys" element={<PrivateRoute><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><SurveysPage /></div></PrivateRoute>} />
                    <Route path="/withdraw" element={<PrivateRoute><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><WithdrawPage /></div></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><ProfilePage /></div></PrivateRoute>} />
                    <Route path="/history" element={<PrivateRoute><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><HistoryPage /></div></PrivateRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminLayout><UserManagementPage /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/withdrawals" element={<AdminRoute><AdminLayout><WithdrawalManagementPage /></AdminLayout></AdminRoute>} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            {!user?.role.includes('admin') && <Footer />}
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;