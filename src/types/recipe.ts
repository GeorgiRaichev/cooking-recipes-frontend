export type RecipeStatus = "active" | "suspended" | "deactivated";

export type Recipe = {
  id: string;
  userId: string;
  title: string;
  summary: string;
  preparationTime: number;
  products: string[];
  imageUrl: string;
  description: string;
  tags: string[];
  status: RecipeStatus;
  createdAt: string;
  updatedAt: string;
};
