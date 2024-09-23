import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ClientRecipeList from '../client/ClientRecipeList';
import { Recipe } from '../../types/Recipe';

async function getRecipes(): Promise<Recipe[]> {
    const recipesCol = collection(db, 'recipes');
    const recipeSnapshot = await getDocs(recipesCol);
    return recipeSnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        ingredients: doc.data().ingredients,
        ...doc.data()
    }));
}

export default async function RecipeList() {
    const recipes = await getRecipes();

    return <ClientRecipeList initialRecipes={recipes} />;
}