
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-500 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
);

const HomePage: React.FC = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Your Opinion Matters. <span className="text-cyan-500">Get Paid For It.</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join Prime Surveys today and start earning real rewards by sharing your valuable insights on products and services you use every day.
        </p>
        <div className="mt-8">
          <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
            Sign Up & Earn $1.00 Bonus
          </Link>
        </div>
      </section>

      {/* How it works Section */}
      <section>
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                title="1. Sign Up"
                description="Create your free account in minutes and get a sign-up bonus to kickstart your earnings."
              />
               <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                title="2. Take Surveys"
                description="Browse a wide variety of surveys from top brands and choose the ones that interest you the most."
              />
               <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                title="3. Get Paid"
                description="Redeem your earnings for PayPal cash or popular gift cards. It's that simple!"
              />
          </div>
      </section>
    </div>
  );
};

export default HomePage;
