import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuthUser, removeAuthUser } from "../utils/authStorage";

const Layout = () => {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const handleLogout = () => {
    removeAuthUser();
    navigate("/login");
  };

  return (
    <div>
      <header className="header">
        <h2>Cooking Recipes</h2>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/recipes/new">Add Recipe</Link>
          <Link to="/users">Users</Link>

          {!authUser && <Link to="/login">Login</Link>}
          {!authUser && <Link to="/register">Register</Link>}

          {authUser && (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
