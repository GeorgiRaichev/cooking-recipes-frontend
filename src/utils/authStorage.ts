import type { User } from "../types/user";

const AUTH_USER_KEY = "cookingRecipesAuthUser";

export const saveAuthUser = (user: User): void => {
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const getAuthUser = (): User | null => {
  const storedUser = sessionStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    sessionStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const removeAuthUser = (): void => {
  sessionStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAuthUser());
};
