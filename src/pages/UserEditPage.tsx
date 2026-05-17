import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import { getUserById } from "../api/usersApi";
import type { User } from "../types/user";

const UserEditPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setError("User id is missing");
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getUserById(id);

        setUser(userData);
      } catch {
        setError("Failed to load user");
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [id]);

  if (isLoading) {
    return <p>Loading user...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <section className="page-card">
      <h1>Edit User</h1>
      <UserForm user={user} />
    </section>
  );
};

export default UserEditPage;
