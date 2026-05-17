import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUsers } from "../api/usersApi";
import { generateId } from "../utils/generateId";
import type { UserGender, UserRole, UserStatus } from "../types/user";

type RegisterFormData = {
  name: string;
  username: string;
  password: string;
  gender: UserGender;
  role: UserRole;
  avatarUrl: string;
  shortDescription: string;
  status: UserStatus;
};

const initialFormData: RegisterFormData = {
  name: "",
  username: "",
  password: "",
  gender: "male",
  role: "user",
  avatarUrl: "",
  shortDescription: "",
  status: "active",
};

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
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

  const validateForm = async (): Promise<string | null> => {
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

    const users = await getUsers();
    const usernameExists = users.some(
      (user) => user.username === formData.username,
    );

    if (usernameExists) {
      return "Username already exists";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const validationError = await validateForm();

      if (validationError) {
        setError(validationError);
        return;
      }

      await createUser({
        id: generateId(),
        ...formData,
      });

      navigate("/login");
    } catch {
      setError("Registration failed");
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
          {isSubmitting ? "Creating..." : "Register"}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
