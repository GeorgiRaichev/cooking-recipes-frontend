# Cooking Recipes Frontend

React TypeScript SPA application for managing cooking recipes and users.  
The project uses React Router for client-side routing and json-server as a mock REST API backend.

## Features

### Users

- Register new user
- Login user
- Logout user
- Store authenticated user in `sessionStorage`
- View all users
- Edit user
- Delete user
- Admin-only access to users management page

### Recipes

- Create recipe from the currently logged-in user
- View latest published recipes
- Filter recipes by tag
- Filter recipes by author
- Sort recipes by publish date
- View recipe details
- Edit recipe
- Delete recipe
- Manage all recipes from a separate management page

### Access Rules

- Guest users can view home, recipes, login and register pages
- Logged-in users can create recipes
- Logged-in users can manage their own recipes
- Admin users can manage all recipes and users
- Normal users cannot access the users management page

## Technologies

- React
- TypeScript
- React Router
- Vite
- json-server
- Fetch API
- CSS

## Project Structure

```txt
src/
  api/
    config.ts
    usersApi.ts
    recipesApi.ts

  components/
    Layout.tsx
    ProtectedRoute.tsx
    AdminRoute.tsx
    LoginForm.tsx
    RegisterForm.tsx
    RecipeForm.tsx
    RecipesList.tsx
    RecipeDetails.tsx
    AllRecipesList.tsx
    UsersList.tsx
    UserForm.tsx

  pages/
    HomePage.tsx
    LoginPage.tsx
    RegisterPage.tsx
    RecipesPage.tsx
    RecipeCreatePage.tsx
    RecipeDetailsPage.tsx
    RecipeEditPage.tsx
    RecipesManagePage.tsx
    UsersPage.tsx
    UserEditPage.tsx
    NotFoundPage.tsx

  routes/
    AppRoutes.tsx

  types/
    user.ts
    recipe.ts

  utils/
    authStorage.ts
    generateId.ts
