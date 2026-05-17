import type { Recipe } from "../types/recipe";
import { API_BASE_URL } from "./config";

export type CreateRecipeData = Omit<Recipe, "createdAt" | "updatedAt">;

export type UpdateRecipeData = Partial<Omit<Recipe, "id" | "createdAt">>;

export const getRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(`${API_BASE_URL}/recipes`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  return response.json();
};

export const createRecipe = async (
  recipe: CreateRecipeData,
): Promise<Recipe> => {
  const now = new Date().toISOString();

  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...recipe,
      createdAt: now,
      updatedAt: now,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create recipe");
  }

  return response.json();
};

export const updateRecipe = async (
  id: string,
  recipe: UpdateRecipeData,
): Promise<Recipe> => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...recipe,
      updatedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update recipe");
  }

  return response.json();
};

export const deleteRecipe = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete recipe");
  }
};
