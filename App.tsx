import React, { useState, useCallback, useEffect } from 'react';
import { Recipe, RecipeDetails } from './types';
import { getRecipesFromIngredients, getRecipeDetails, generateRecipeImages, generateCoverImage } from './services/geminiService';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import RecipeDetailModal from './components/RecipeDetailModal';
import LoadingSpinner from './components/LoadingSpinner';
import { ChefHatIcon } from './components/IconComponents';

const App: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
    const [recipeImages, setRecipeImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme');
            if (storedTheme === 'dark' || storedTheme === 'light') {
                return storedTheme;
            }
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleGetRecipes = useCallback(async (ingredients: string) => {
        setIsLoading(true);
        setError(null);
        setRecipes(null);
        setSelectedRecipe(null);
        setRecipeDetails(null);
        setRecipeImages([]);

        try {
            const fetchedRecipes = await getRecipesFromIngredients(ingredients);

            if (fetchedRecipes && fetchedRecipes.length > 0) {
                const recipesWithImages = await Promise.all(
                    fetchedRecipes.map(async (recipe) => {
                        const imageUrl = await generateCoverImage(recipe.name);
                        return { ...recipe, imageUrl };
                    })
                );
                setRecipes(recipesWithImages);
            } else {
                setError("Could not find any recipes. Try different ingredients.");
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch recipes. Please check your connection and API key.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectRecipe = useCallback(async (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setIsDetailLoading(true);
        setRecipeDetails(null);
        setRecipeImages([]);
        setError(null);

        try {
            const details = await getRecipeDetails(recipe.name);
            setRecipeDetails(details);
            
            const images = await generateRecipeImages(details.instructions);
            setRecipeImages(images);

        } catch (err) {
            console.error(err);
            setError(`Failed to fetch details for ${recipe.name}.`);
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    const handleCloseModal = () => {
        setSelectedRecipe(null);
        setRecipeDetails(null);
        setRecipeImages([]);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="container mx-auto p-4 md:p-8">
                <IngredientInput onGetRecipes={handleGetRecipes} isLoading={isLoading} />

                {isLoading && (
                    <div className="flex flex-col items-center justify-center mt-12">
                        <LoadingSpinner />
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Finding delicious recipes...</p>
                    </div>
                )}

                {error && <p className="text-center text-red-500 mt-8">{error}</p>}
                
                {!isLoading && !recipes && !error && (
                    <div className="text-center mt-16 text-gray-500 dark:text-gray-400">
                         <ChefHatIcon className="w-24 h-24 mx-auto mb-4 text-green-400 dark:text-green-500" />
                         <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Welcome to CookMate AI!</h2>
                         <p className="mt-2 text-lg">Tell me what ingredients you have, and I'll whip up some ideas.</p>
                    </div>
                )}

                {recipes && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Recipe Suggestions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recipes.map((recipe, index) => (
                                <RecipeCard key={index} recipe={recipe} onSelect={handleSelectRecipe} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {selectedRecipe && (
                <RecipeDetailModal
                    recipe={selectedRecipe}
                    details={recipeDetails}
                    images={recipeImages}
                    isLoading={isDetailLoading}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default App;
