import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { getRecipeById } from "../api/recipesApi";
import type { Recipe } from "../types/recipe";
import { getAuthUser } from "../utils/authStorage";

const RecipeEditPage = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) {
        setError("Recipe id is missing");
        setIsLoading(false);
        return;
      }

      try {
        const recipeData = await getRecipeById(id);
        const authUser = getAuthUser();

        if (!authUser || authUser.id !== recipeData.userId) {
          navigate("/recipes");
          return;
        }

        setRecipe(recipeData);
      } catch {
        setError("Failed to load recipe");
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id, navigate]);

  if (isLoading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <section className="page-card">
      <h1>Edit Recipe</h1>
      <RecipeForm recipe={recipe} mode="edit" />
    </section>
  );
};

export default RecipeEditPage;
