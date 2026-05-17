import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRecipeById } from "../api/recipesApi";
import { getUserById } from "../api/usersApi";
import type { Recipe } from "../types/recipe";
import type { User } from "../types/user";
import { getAuthUser } from "../utils/authStorage";

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const authUser = getAuthUser();

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) {
        setError("Recipe id is missing");
        setIsLoading(false);
        return;
      }

      try {
        const recipeData = await getRecipeById(id);
        const authorData = await getUserById(recipeData.userId);

        setRecipe(recipeData);
        setAuthor(authorData);
      } catch {
        setError("Failed to load recipe details");
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

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
    <article className="details-card">
      <img className="details-image" src={recipe.imageUrl} alt={recipe.title} />

      <div className="details-content">
        <div className="details-header">
          <div>
            <h1>{recipe.title}</h1>
            <p>{recipe.summary}</p>
          </div>

          {authUser?.id === recipe.userId && (
            <Link className="primary-button" to={`/recipes/${recipe.id}/edit`}>
              Edit recipe
            </Link>
          )}
        </div>

        <div className="details-meta">
          <p>
            <strong>Author:</strong> {author?.name || "Unknown author"}
          </p>

          <p>
            <strong>Preparation time:</strong> {recipe.preparationTime} min
          </p>

          <p>
            <strong>Status:</strong> {recipe.status}
          </p>

          <p>
            <strong>Published:</strong>{" "}
            {new Date(recipe.createdAt).toLocaleString()}
          </p>
        </div>

        <section>
          <h2>Products</h2>

          <ul>
            {recipe.products.map((product) => (
              <li key={product}>{product}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Description</h2>
          <p className="details-description">{recipe.description}</p>
        </section>

        <section>
          <h2>Tags</h2>

          <div className="tags">
            {recipe.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default RecipeDetails;
