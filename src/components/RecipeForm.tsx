import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe, updateRecipe } from "../api/recipesApi";
import { generateId } from "../utils/generateId";
import { getAuthUser } from "../utils/authStorage";
import type { Recipe, RecipeStatus } from "../types/recipe";

type RecipeFormProps = {
  recipe?: Recipe;
  mode?: "create" | "edit";
};

type RecipeFormData = {
  title: string;
  summary: string;
  preparationTime: string;
  products: string;
  imageUrl: string;
  description: string;
  tags: string;
  status: RecipeStatus;
};

const initialFormData: RecipeFormData = {
  title: "",
  summary: "",
  preparationTime: "",
  products: "",
  imageUrl: "",
  description: "",
  tags: "",
  status: "active",
};

const getInitialFormData = (recipe?: Recipe): RecipeFormData => {
  if (!recipe) {
    return initialFormData;
  }

  return {
    title: recipe.title,
    summary: recipe.summary,
    preparationTime: String(recipe.preparationTime),
    products: recipe.products.join(", "),
    imageUrl: recipe.imageUrl,
    description: recipe.description,
    tags: recipe.tags.join(", "),
    status: recipe.status,
  };
};

const RecipeForm = ({ recipe, mode = "create" }: RecipeFormProps) => {
  const [formData, setFormData] = useState<RecipeFormData>(() =>
    getInitialFormData(recipe),
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return "Recipe title is required";
    }

    if (formData.title.length > 80) {
      return "Recipe title must be up to 80 characters";
    }

    if (!formData.summary.trim()) {
      return "Recipe summary is required";
    }

    if (formData.summary.length > 256) {
      return "Recipe summary must be up to 256 characters";
    }

    if (!formData.preparationTime.trim()) {
      return "Preparation time is required";
    }

    if (Number(formData.preparationTime) <= 0) {
      return "Preparation time must be a positive number";
    }

    if (!formData.products.trim()) {
      return "Products are required";
    }

    if (!formData.imageUrl.trim()) {
      return "Image URL is required";
    }

    if (!formData.description.trim()) {
      return "Description is required";
    }

    if (formData.description.length > 2048) {
      return "Description must be up to 2048 characters";
    }

    if (!formData.tags.trim()) {
      return "Tags are required";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const authUser = getAuthUser();

      if (!authUser) {
        navigate("/login");
        return;
      }

      const validationError = validateForm();

      if (validationError) {
        setError(validationError);
        return;
      }

      const products = formData.products
        .split(",")
        .map((product) => product.trim())
        .filter(Boolean);

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (mode === "edit" && recipe) {
        await updateRecipe(recipe.id, {
          title: formData.title.trim(),
          summary: formData.summary.trim(),
          preparationTime: Number(formData.preparationTime),
          products,
          imageUrl: formData.imageUrl.trim(),
          description: formData.description.trim(),
          tags,
          status: formData.status,
        });

        navigate(`/recipes/${recipe.id}`);
        return;
      }

      await createRecipe({
        id: generateId(),
        userId: authUser.id,
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        preparationTime: Number(formData.preparationTime),
        products,
        imageUrl: formData.imageUrl.trim(),
        description: formData.description.trim(),
        tags,
        status: formData.status,
      });

      navigate("/recipes");
    } catch {
      setError(
        mode === "edit" ? "Recipe update failed" : "Recipe creation failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Recipe title
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter recipe title"
          />
        </label>

        <label>
          Summary
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Enter short recipe summary"
          />
        </label>

        <label>
          Preparation time in minutes
          <input
            name="preparationTime"
            type="number"
            value={formData.preparationTime}
            onChange={handleChange}
            placeholder="Enter preparation time"
          />
        </label>

        <label>
          Products
          <input
            name="products"
            value={formData.products}
            onChange={handleChange}
            placeholder="Example: eggs, milk, flour"
          />
        </label>

        <label>
          Image URL
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter recipe image URL"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter full recipe description"
          />
        </label>

        <label>
          Tags
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Example: breakfast, easy, healthy"
          />
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
              ? "Save Recipe"
              : "Create Recipe"}
        </button>
      </form>
    </>
  );
};

export default RecipeForm;
