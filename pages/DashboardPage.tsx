
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_SURVEYS } from '../constants';
import SurveyCard from '../components/SurveyCard';
import { Link } from 'react-router-dom';
import type { Survey } from '../types';

const SurveySimulationModal: React.FC<{ survey: Survey; onClose: () => void; onComplete: (reward: number) => void; }> = ({ survey, onClose, onComplete }) => {
    const [step, setStep] = useState(0);
    const questions = [
        "How satisfied are you with this product category?",
        "How often do you purchase items in this category?",
        "What is the most important factor for you when choosing a product?",
    ];

    const handleComplete = () => {
        onComplete(survey.reward);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-2">{survey.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Question {step + 1} of {questions.length}</p>
                
                <div className="my-6 p-4 bg-gray-100 dark:bg-slate-700 rounded-md">
                    <p className="font-semibold">{questions[step]}</p>
                    <div className="mt-4 space-y-2">
                        {['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied'].map(opt => (
                            <label key={opt} className="flex items-center space-x-2">
                                <input type="radio" name={`q-${step}`} className="form-radio text-cyan-500" />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button onClick={onClose} className="text-gray-500">Cancel</button>
                    {step < questions.length - 1 ? (
                         <button onClick={() => setStep(s => s + 1)} className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg">Next</button>
                    ) : (
                        <button onClick={handleComplete} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">Complete Survey</button>
                    )}
                </div>
            </div>
        </div>
    );
};


const DashboardPage: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleStartSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
  };

  const handleCompleteSurvey = (reward: number) => {
    updateBalance(reward);
    // You could show a notification here
  };
  
  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome back, {user.name}!
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-cyan-400 to-blue-500 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-semibold text-cyan-100">Your Balance</h2>
                <p className="text-4xl font-bold mt-2">${(user.balance / 100).toFixed(2)}</p>
            </div>
            <Link to="/withdraw" className="mt-4 bg-white text-cyan-500 font-bold py-2 px-4 rounded-full text-center hover:bg-cyan-50 transition">
                Withdraw Funds
            </Link>
        </div>
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white">Get Started</h2>
             <p className="text-gray-600 dark:text-gray-400 mt-2">Here are some top surveys picked just for you. Complete them now to boost your earnings!</p>
             <div className="mt-4">
                 <Link to="/surveys" className="text-cyan-500 font-semibold hover:underline">View All Surveys &rarr;</Link>
             </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Featured Surveys</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SURVEYS.slice(0, 3).map(survey => (
            <SurveyCard key={survey.id} survey={survey} onStart={handleStartSurvey} />
          ))}
        </div>
      </div>

      {selectedSurvey && (
        <SurveySimulationModal 
            survey={selectedSurvey} 
            onClose={() => setSelectedSurvey(null)} 
            onComplete={handleCompleteSurvey}
        />
      )}
    </div>
  );
};

export default DashboardPage;
