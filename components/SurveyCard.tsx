
import React from 'react';
import type { Survey } from '../types';

interface SurveyCardProps {
  survey: Survey;
  onStart: (survey: Survey) => void;
}

const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
    </svg>
);

const GiftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 5a3 3 0 015.292-2.121C11.16 1.83 12.84 1 15 1a5 5 0 015 5c0 1.936-.784 4.58-2.707 6.957-1.924 2.377-4.591 4.543-6.293 4.543-.362 0-1.09.006-2.04.02-1.391.02-2.92.04-4.5.04a1 1 0 01-1-1V5zM5 3a1 1 0 000 2v.5a.5.5 0 01-1 0V5a3 3 0 013-3c1.657 0 3 1.343 3 3v1.5a.5.5 0 01-1 0V5a2 2 0 00-2-2H5z" clipRule="evenodd" />
    </svg>
);


const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onStart }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200 dark:bg-cyan-700 dark:text-cyan-200">
                {survey.category}
            </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-4">{survey.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{survey.description}</p>
      </div>
      <div className="bg-gray-50 dark:bg-slate-700/50 p-6 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                <ClockIcon />
                <span>{survey.estimatedTime} min</span>
            </div>
            <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
                <GiftIcon/>
                <span>${(survey.reward / 100).toFixed(2)}</span>
            </div>
        </div>
        <button
          onClick={() => onStart(survey)}
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
        >
          Start Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyCard;
