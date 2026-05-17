import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../api/recipesApi";
import { getUsers } from "../api/usersApi";
import type { Recipe } from "../types/recipe";
import type { User } from "../types/user";

type SortOrder = "asc" | "desc";

const RecipesList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tagFilter, setTagFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
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

    loadData();
  }, []);

  const getAuthorName = (userId: string): string => {
    const user = users.find((currentUser) => currentUser.id === userId);

    return user?.name || "Unknown author";
  };

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => recipe.status === "active")
      .filter((recipe) => {
        if (!tagFilter.trim()) {
          return true;
        }

        return recipe.tags.some((tag) =>
          tag.toLowerCase().includes(tagFilter.trim().toLowerCase()),
        );
      })
      .filter((recipe) => {
        if (!authorFilter.trim()) {
          return true;
        }

        const authorName = getAuthorName(recipe.userId);

        return authorName
          .toLowerCase()
          .includes(authorFilter.trim().toLowerCase());
      })
      .sort((firstRecipe, secondRecipe) => {
        const firstDate = new Date(firstRecipe.createdAt).getTime();
        const secondDate = new Date(secondRecipe.createdAt).getTime();

        return sortOrder === "asc"
          ? firstDate - secondDate
          : secondDate - firstDate;
      })
      .slice(0, 10);
  }, [recipes, users, tagFilter, authorFilter, sortOrder]);

  const handleTagFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagFilter(event.target.value);
  };

  const handleAuthorFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthorFilter(event.target.value);
  };

  const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as SortOrder);
  };

  if (isLoading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <div className="filters">
        <label>
          Filter by tag
          <input
            value={tagFilter}
            onChange={handleTagFilterChange}
            placeholder="Example: breakfast"
          />
        </label>

        <label>
          Filter by author
          <input
            value={authorFilter}
            onChange={handleAuthorFilterChange}
            placeholder="Example: Ivan"
          />
        </label>

        <label>
          Sort by publish date
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </label>
      </div>

      {filteredRecipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => (
            <article className="recipe-card" key={recipe.id}>
              <img src={recipe.imageUrl} alt={recipe.title} />

              <div className="recipe-card-content">
                <h2>{recipe.title}</h2>
                <p>{recipe.summary}</p>

                <p>
                  <strong>Author:</strong> {getAuthorName(recipe.userId)}
                </p>

                <p>
                  <strong>Time:</strong> {recipe.preparationTime} min
                </p>

                <div className="tags">
                  {recipe.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <Link className="primary-button" to={`/recipes/${recipe.id}`}>
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesList;
