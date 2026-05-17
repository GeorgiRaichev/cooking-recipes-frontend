import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/usersApi";
import { saveAuthUser } from "../utils/authStorage";

type LoginFormData = {
  username: string;
  password: string;
};

const initialFormData: LoginFormData = {
  username: "",
  password: "",
};

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.username.trim()) {
      return "Username is required";
    }

    if (!formData.password.trim()) {
      return "Password is required";
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

      const user = await loginUser(formData.username, formData.password);

      saveAuthUser(user);
      navigate("/recipes");
    } catch {
      setError("Invalid username or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
