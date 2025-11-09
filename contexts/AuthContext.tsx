import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { User, WithdrawalRecord } from '../types';

// The base URL for your backend API.
// For local development, it will be 'http://localhost:3001'.
// When you deploy your backend to Render, you will change this to your Render service URL.
const API_BASE_URL = 'https://prime-surveys-backend.onrender.com';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{success: boolean, message: string}>;
  register: (name: string, email: string, password?: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addWithdrawalRequest: (optionName: string, amount: number) => Promise<{success: boolean, message: string}>;
  fetchUser: () => Promise<void>; // Manually trigger user data refresh
  // Admin functions
  adminGetAllUsers: () => Promise<User[]>;
  adminUpdateUser: (userId: string, updates: Partial<User>) => Promise<User>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminGetAllWithdrawals: () => Promise<(WithdrawalRecord & { userName: string; userId: string; email: string; })[]>;
  adminUpdateWithdrawal: (userId: string, withdrawalId: string, status: WithdrawalRecord['status']) => Promise<WithdrawalRecord>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'prime-surveys-auth-token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'An API error occurred');
    }

    return response.json();
  }, [token]);

  const fetchUser = useCallback(async () => {
    if (token) {
        try {
            const userData = await fetchWithAuth('/api/users/me');
            setUser(userData);
        } catch (error) {
            console.error("Session expired or invalid. Logging out.", error);
            logout();
        }
    }
    setIsLoading(false);
  }, [token, fetchWithAuth]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password?: string): Promise<{success: boolean, message: string}> => {
    try {
        const data = await fetchWithAuth('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        setUser(data.user);
        return { success: true, message: 'Login successful!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<{success: boolean, message: string}> => {
    try {
        const data = await fetchWithAuth('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        setToken(data.token);
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        setUser(data.user);
        return { success: true, message: 'Registration successful!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const updateBalance = (amount: number) => {
    if (!user) return;
    const optimisticUser = { ...user, balance: user.balance + amount };
    setUser(optimisticUser);
    // Note: In a real app, this might be confirmed with the backend later
  };
  
  const addWithdrawalRequest = async (optionName: string, amount: number): Promise<{success: boolean, message: string}> => {
      if (!user) return { success: false, message: 'You must be logged in.'};
      
      try {
        await fetchWithAuth('/api/withdrawals', {
            method: 'POST',
            body: JSON.stringify({ optionName, amount })
        });
        await fetchUser(); // Refresh user data to get new balance and history
        return { success: true, message: 'Withdrawal request submitted successfully.' };
      } catch (error) {
        return { success: false, message: (error as Error).message };
      }
  }

  // --- ADMIN FUNCTIONS ---
  const adminGetAllUsers = (): Promise<User[]> => fetchWithAuth('/api/admin/users');
  const adminUpdateUser = (userId: string, updates: Partial<User>): Promise<User> => fetchWithAuth(`/api/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  const adminDeleteUser = (userId: string): Promise<void> => fetchWithAuth(`/api/admin/users/${userId}`, { method: 'DELETE' });
  const adminGetAllWithdrawals = (): Promise<(WithdrawalRecord & { userName: string; userId: string; email: string; })[]> => fetchWithAuth('/api/admin/withdrawals');
  const adminUpdateWithdrawal = (userId: string, withdrawalId: string, status: WithdrawalRecord['status']): Promise<WithdrawalRecord> => fetchWithAuth(`/api/admin/withdrawals/${withdrawalId}`, {
      method: 'PUT',
      body: JSON.stringify({ userId, status }),
  });


  const value = { 
      user, token, isLoading, login, register, logout, 
      updateBalance, addWithdrawalRequest, fetchUser,
      adminGetAllUsers, adminUpdateUser, adminDeleteUser,
      adminGetAllWithdrawals, adminUpdateWithdrawal
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 text-cyan-500">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
