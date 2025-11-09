
import React, { useState } from 'react';
import { MOCK_SURVEYS } from '../constants';
import SurveyCard from '../components/SurveyCard';
import type { Survey } from '../types';
import { useAuth } from '../contexts/AuthContext';


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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-2">{survey.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Question {step + 1} of {questions.length}</p>
                
                <div className="my-6 p-4 bg-gray-100 dark:bg-slate-700 rounded-md">
                    <p className="font-semibold">{questions[step]}</p>
                    <div className="mt-4 space-y-2">
                        {['Option A', 'Option B', 'Option C', 'Option D'].map(opt => (
                            <label key={opt} className="flex items-center space-x-2">
                                <input type="radio" name={`q-${step}`} className="form-radio text-cyan-500" />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition">Cancel</button>
                    {step < questions.length - 1 ? (
                         <button onClick={() => setStep(s => s + 1)} className="bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-600 transition">Next</button>
                    ) : (
                        <button onClick={handleComplete} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition">Complete Survey</button>
                    )}
                </div>
            </div>
        </div>
    );
};


const SurveysPage: React.FC = () => {
    const { updateBalance } = useAuth();
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [completionMessage, setCompletionMessage] = useState('');

    const handleStartSurvey = (survey: Survey) => {
        setSelectedSurvey(survey);
    };

    const handleCompleteSurvey = (reward: number) => {
        updateBalance(reward);
        setCompletionMessage(`Congratulations! You've earned $${(reward / 100).toFixed(2)}.`);
        setTimeout(() => setCompletionMessage(''), 4000);
    };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Surveys</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Choose from a variety of surveys and start earning now. New surveys are added daily!
      </p>

      {completionMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Success</p>
            <p>{completionMessage}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SURVEYS.map(survey => (
          <SurveyCard key={survey.id} survey={survey} onStart={handleStartSurvey} />
        ))}
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

export default SurveysPage;
