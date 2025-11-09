import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DollarSignIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-.567-.267C8.07 8.488 8 8.731 8 9c0 .269.07.512.218.682A1.03 1.03 0 019 10a1.03 1.03 0 01.782.318c.148.17.218.413.218.682 0 .269-.07.512-.218.682a1.03 1.03 0 01-.782.318 1.03 1.03 0 01-.782-.318c-.148-.17-.218-.413-.218-.682h-1.5c0 .635.273 1.17.682 1.542.409.372.956.542 1.518.542.562 0 1.109-.17 1.518-.542.409-.372.682-.907.682-1.542 0-.37-.08-.69-.23-1.001a2.5 2.5 0 00-1.08-1.302c.53-.292.86-.683.99-1.211a2.5 2.5 0 00-.23-2.52c-.38-.621-.92-1.04-1.59-1.302V4.5a.75.75 0 00-1.5 0v.758c-.562.11-.984.345-1.22.611a.75.75 0 00.97 1.129z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v.563c-1.037.26-1.5 1.03-1.5 1.688 0 .658.463 1.437 1.5 1.687v.563a.75.75 0 001.5 0v-.563c1.037-.26 1.5-1.03 1.5-1.688 0-.658-.463-1.437-1.5-1.687V6.75z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const formatBalance = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-cyan-500 flex items-center">
              <DollarSignIcon className="h-8 w-8 mr-2 text-cyan-400" />
              Prime Surveys
            </Link>
          </div>

          <div className="hidden md:block">
            {user && user.role === 'user' ? (
              <div className="ml-10 flex items-center space-x-4">
                 <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                 <Link to="/surveys" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium">Surveys</Link>
                 <Link to="/withdraw" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium">Withdraw</Link>
                 <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium">History</Link>
              </div>
            ) : null}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'user' && (
                  <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm font-semibold px-4 py-2 rounded-full flex items-center">
                    <DollarSignIcon className="h-5 w-5 mr-1"/>
                    {formatBalance(user.balance)}
                  </div>
                )}
                 {user.role === 'admin' && (
                  <Link to="/admin" className="bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 text-sm font-semibold px-4 py-2 rounded-full flex items-center">
                    Admin Panel
                  </Link>
                 )}
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="max-w-xs bg-gray-200 dark:bg-slate-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open user menu</span>
                     <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                       {user.name.charAt(0).toUpperCase()}
                     </div>
                  </button>
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5">
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600">Your Profile</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600">
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium">Log In</Link>
                <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-200">Sign Up</Link>
              </div>
            )}
            <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isMenuOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
                    </svg>
                </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
            <div className="md:hidden">
                 <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Admin Panel</Link> }
                            {user.role === 'user' &&
                                <>
                                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                    <Link to="/surveys" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Surveys</Link>
                                    <Link to="/withdraw" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Withdraw</Link>
                                    <Link to="/history" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">History</Link>
                                </>
                            }
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                            <button onClick={handleLogout} className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Log In</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
                        </>
                    )}
                 </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;