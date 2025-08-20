import React from 'react';
import { ChefHatIcon, MoonIcon, SunIcon } from './IconComponents';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300 relative z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <ChefHatIcon className="w-10 h-10 text-green-500 dark:text-green-400" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 ml-3">
                        CookMate AI
                    </h1>
                </div>
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                    {theme === 'light' ? (
                        <MoonIcon className="w-6 h-6" />
                    ) : (
                        <SunIcon className="w-6 h-6 text-yellow-400" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
