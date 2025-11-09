
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Prime Surveys. All rights reserved.</p>
        <p className="text-sm mt-2">A Frontend Demonstration Project</p>
      </div>
    </footer>
  );
};

export default Footer;
