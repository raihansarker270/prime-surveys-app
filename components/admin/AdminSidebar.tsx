import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem: React.FC<{ to: string; icon: React.ReactElement; label: string }> = ({ to, icon, label }) => {
    const commonClasses = "flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-200 transform rounded-md";
    const activeClasses = "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200";
    const inactiveClasses = "hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-gray-200";
    
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="mx-4 font-medium">{label}</span>
        </NavLink>
    );
};

const AdminSidebar: React.FC = () => {
    return (
        <div className="flex flex-col w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700">
            <div className="flex items-center justify-center h-16 border-b dark:border-slate-700">
                <h1 className="text-2xl font-bold text-cyan-500">Prime Surveys</h1>
            </div>
            <div className="flex flex-col flex-1 p-2">
                <nav>
                    <NavItem 
                        to="/admin" 
                        label="Dashboard" 
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    />
                    <NavItem 
                        to="/admin/users" 
                        label="Users" 
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11ZM17 8C18.6569 8 20 6.65685 20 5C20 3.34315 18.6569 2 17 2C15.3431 2 14 3.34315 14 5C14 6.65685 15.3431 8 17 8ZM23 21V19C22.9995 17.5103 22.1448 16.1911 20.819 15.44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    />
                     <NavItem 
                        to="/admin/withdrawals" 
                        label="Withdrawals" 
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10H21M7 15H8M11 15H12M15 15H16M21 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H21C22.1046 19 23 18.1046 23 17V7C23 5.89543 22.1046 5 21 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    />
                </nav>
            </div>
        </div>
    );
};

export default AdminSidebar;
