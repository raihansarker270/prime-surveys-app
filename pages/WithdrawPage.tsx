import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { WITHDRAWAL_OPTIONS } from '../constants';
import type { WithdrawalOption } from '../types';

const WithdrawPage: React.FC = () => {
  const { user, addWithdrawalRequest } = useAuth();
  const [selectedOption, setSelectedOption] = useState<WithdrawalOption | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) return null;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (!selectedOption) {
        setMessage({ type: 'error', text: 'Please select a withdrawal option.' });
        setIsLoading(false);
        return;
    }
    const withdrawAmount = Math.round(parseFloat(amount) * 100); // convert dollars to cents
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        setMessage({ type: 'error', text: 'Please enter a valid amount.' });
        setIsLoading(false);
        return;
    }
    if (withdrawAmount < selectedOption.minAmount) {
        setMessage({ type: 'error', text: `Minimum withdrawal for ${selectedOption.name} is $${(selectedOption.minAmount / 100).toFixed(2)}.` });
        setIsLoading(false);
        return;
    }
    if (withdrawAmount > user.balance) {
        setMessage({ type: 'error', text: 'Insufficient balance.' });
        setIsLoading(false);
        return;
    }

    const result = await addWithdrawalRequest(selectedOption.name, withdrawAmount);

    if (result.success) {
      setMessage({ type: 'success', text: `Your withdrawal request for $${(withdrawAmount / 100).toFixed(2)} via ${selectedOption.name} has been submitted.` });
      setAmount('');
      setSelectedOption(null);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Withdraw Your Earnings</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Current Balance: <span className="font-bold text-green-500">${(user.balance / 100).toFixed(2)}</span>
        </p>
      </div>

        {message && (
            <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4`}>
                <p>{message.text}</p>
            </div>
        )}

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">1. Select a Reward</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {WITHDRAWAL_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option)}
              disabled={isLoading}
              className={`p-4 border-2 rounded-lg text-left transition ${selectedOption?.id === option.id ? 'border-cyan-500 ring-2 ring-cyan-500' : 'border-gray-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-600'} disabled:opacity-50`}
            >
              <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">{option.logo}</div>
                  <div>
                    <p className="font-bold text-lg text-gray-800 dark:text-white">{option.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Min. ${(option.minAmount / 100).toFixed(2)}</p>
                  </div>
              </div>
            </button>
          ))}
        </div>
        
        {selectedOption && (
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">2. Enter Amount</h2>
                <form onSubmit={handleWithdraw}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-7 pr-12 py-3 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-cyan-500 focus:border-cyan-500 text-lg"
                            placeholder="0.00"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!amount || isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Withdrawal Request'}
                    </button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawPage;
