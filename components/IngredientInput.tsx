import React, { useState } from 'react';
import { SparklesIcon } from './IconComponents';

interface IngredientInputProps {
    onGetRecipes: (ingredients: string) => void;
    isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onGetRecipes, isLoading }) => {
    const [textInput, setTextInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !textInput.trim()) return;
        onGetRecipes(textInput);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-2xl mx-auto transition-colors duration-300">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="ingredients-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter ingredients you have (e.g., chicken, tomatoes, rice)
                    </label>
                    <textarea
                        id="ingredients-text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="eggs, onion, cheese, bell pepper..."
                    />
                </div>
                 <button
                    type="submit"
                    disabled={isLoading || !textInput.trim()}
                    className="mt-4 w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Thinking...' : 'Find Recipes'}
                </button>
            </form>
        </div>
    );
};

export default IngredientInput;
