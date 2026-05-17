import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, getUsers } from "../api/usersApi";
import type { User } from "../types/user";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getUsers();

        setUsers(usersData);
      } catch {
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const shouldDelete = confirm("Are you sure you want to delete this user?");

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteUser(id);

      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    } catch {
      setError("Failed to delete user");
    }
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.gender}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <div className="table-actions">
                  <Link className="small-button" to={`/users/${user.id}/edit`}>
                    Edit
                  </Link>

                  <button
                    className="small-danger-button"
                    type="button"
                    onClick={() => handleDelete(user.id)}
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

export default UsersList;
