'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface Recipe {
    id: string;
    title: string;
    ingredients: string;
}

export default function ClientRecipeList({ initialRecipes }: { initialRecipes: Recipe[] }) {
    const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
    const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: '' });
    const [syncStatus, setSyncStatus] = useState<string>('All changes are synced.');

    useEffect(() => {
        // Listen for real-time updates
        const unsubscribe = onSnapshot(collection(db, 'recipes'), (snapshot) => {
            const updatedRecipes = snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                ingredients: doc.data().ingredients,
            }));
            setRecipes(updatedRecipes);
            setSyncStatus('All changes are synced.');
        }, (error) => {
            console.error('Error fetching recipes: ', error);
            if (error.code === 'unavailable') {
                setSyncStatus('Offline: Changes will sync when back online.');
            }
        });

        return () => unsubscribe();
    }, []);

    const addRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'recipes'), newRecipe);
            setNewRecipe({ title: '', ingredients: '' });
            setSyncStatus('Adding recipe...');
        } catch (error) {
            console.error('Error adding recipe: ', error);
            setSyncStatus('Failed to add recipe.');
        }
    };

    const deleteRecipe = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'recipes', id));
            setSyncStatus('Deleting recipe...');
        } catch (error) {
            console.error('Error deleting recipe: ', error);
            setSyncStatus('Failed to delete recipe.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Recipes</h2>
            <form onSubmit={addRecipe} className="mb-4">
                <input
                    type="text"
                    value={newRecipe.title}
                    onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                    placeholder="Recipe Title"
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="text"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                    placeholder="Ingredients"
                    className="border p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Recipe</button>
            </form>
            <p className="mb-4 text-sm text-gray-600">{syncStatus}</p>
            <div>
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="border p-2 mb-2 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{recipe.title}</h3>
                            <p>{recipe.ingredients}</p>
                        </div>
                        <button 
                            onClick={() => deleteRecipe(recipe.id)} 
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}