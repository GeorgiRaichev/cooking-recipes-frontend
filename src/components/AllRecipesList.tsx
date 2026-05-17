import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteRecipe, getRecipes } from "../api/recipesApi";
import { getUsers } from "../api/usersApi";
import type { Recipe } from "../types/recipe";
import type { User } from "../types/user";

const AllRecipesList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recipesData, usersData] = await Promise.all([
          getRecipes(),
          getUsers(),
        ]);

        setRecipes(recipesData);
        setUsers(usersData);
      } catch {
        setError("Failed to load recipes");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const getAuthorName = (userId: string): string => {
    const user = users.find((currentUser) => currentUser.id === userId);

    return user?.name || "Unknown author";
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = confirm(
      "Are you sure you want to delete this recipe?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteRecipe(id);

      setRecipes((currentRecipes) =>
        currentRecipes.filter((recipe) => recipe.id !== id),
      );
    } catch {
      setError("Failed to delete recipe");
    }
  };

  if (isLoading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Preparation time</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.title}</td>
              <td>{getAuthorName(recipe.userId)}</td>
              <td>{recipe.status}</td>
              <td>{recipe.preparationTime} min</td>
              <td>{new Date(recipe.createdAt).toLocaleString()}</td>
              <td>
                <div className="table-actions">
                  <Link className="small-button" to={`/recipes/${recipe.id}`}>
                    View
                  </Link>

                  <Link
                    className="small-button"
                    to={`/recipes/${recipe.id}/edit`}
                  >
                    Edit
                  </Link>

                  <button
                    className="small-danger-button"
                    type="button"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllRecipesList;
