import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/usersApi";
import type { User, UserGender, UserRole, UserStatus } from "../types/user";

type UserFormProps = {
  user: User;
};

type UserFormData = {
  name: string;
  username: string;
  password: string;
  gender: UserGender;
  role: UserRole;
  avatarUrl: string;
  shortDescription: string;
  status: UserStatus;
};

const getInitialFormData = (user: User): UserFormData => {
  return {
    name: user.name,
    username: user.username,
    password: user.password,
    gender: user.gender,
    role: user.role,
    avatarUrl: user.avatarUrl,
    shortDescription: user.shortDescription,
    status: user.status,
  };
};

const UserForm = ({ user }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>(() =>
    getInitialFormData(user),
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
    if (!formData.name.trim()) {
      return "Name is required";
    }

    if (!/^\w{1,15}$/.test(formData.username)) {
      return "Username must be up to 15 word characters";
    }

    if (!/^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(formData.password)) {
      return "Password must be at least 8 characters and contain one digit and one special character";
    }

    if (formData.shortDescription.length > 512) {
      return "Short description must be up to 512 characters";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const validationError = validateForm();

      if (validationError) {
        setError(validationError);
        return;
      }

      await updateUser(user.id, {
        name: formData.name.trim(),
        username: formData.username.trim(),
        password: formData.password,
        gender: formData.gender,
        role: formData.role,
        avatarUrl: formData.avatarUrl.trim(),
        shortDescription: formData.shortDescription.trim(),
        status: formData.status,
      });

      navigate("/users");
    } catch {
      setError("User update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </label>

        <label>
          Username
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </label>

        <label>
          Gender
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          Role
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label>
          Avatar URL
          <input
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="Enter avatar URL"
          />
        </label>

        <label>
          Short description
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Enter short description"
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
          {isSubmitting ? "Saving..." : "Save User"}
        </button>
      </form>
    </>
  );
};

export default UserForm;
