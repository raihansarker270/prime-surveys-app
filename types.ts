export interface WithdrawalRecord {
    id: string;
    optionName: string;
    amount: number; // in cents
    status: 'Pending' | 'Completed' | 'Failed';
    date: string; // ISO string
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: 'user' | 'admin';
  withdrawalHistory: WithdrawalRecord[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  reward: number; // in cents
  category: string;
}

export interface WithdrawalOption {
    id: string;
    name: string;
    logo: React.ReactElement;
    minAmount: number; // in cents
    description: string;
}