import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipeById } from "../api/recipesApi";
import { getUserById } from "../api/usersApi";
import type { Recipe } from "../types/recipe";
import type { User } from "../types/user";
import { getAuthUser } from "../utils/authStorage";

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (!recipe) {
      return;
    }

    const shouldDelete = confirm(
      "Are you sure you want to delete this recipe?",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteRecipe(recipe.id);
      navigate("/recipes");
    } catch {
      setError("Failed to delete recipe");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  const canManageRecipe = authUser?.id === recipe.userId;

  return (
    <article className="details-card">
      <img className="details-image" src={recipe.imageUrl} alt={recipe.title} />

      <div className="details-content">
        <div className="details-header">
          <div>
            <h1>{recipe.title}</h1>
            <p>{recipe.summary}</p>
          </div>

          {canManageRecipe && (
            <div className="actions-row">
              <Link
                className="primary-button"
                to={`/recipes/${recipe.id}/edit`}
              >
                Edit recipe
              </Link>

              <button
                className="danger-button"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete recipe"}
              </button>
            </div>
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
