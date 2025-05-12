import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import { api } from "../../api";
import CustomInput from "../../components/customInput";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { email, password });

      const token: string = response.data.token;
      const userId: string = response.data.user.id;
      const { fullname } = response.data.user;

      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("fullname", fullname);

      login(token); // authenticate user

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => navigate("/register")}>
        Signup
      </button>

      <div className="login-form">
        <h1 className="header">Login to meroDokan</h1>

        <form onSubmit={handleSubmit}>
          <CustomInput
            label="Email"
            placeholder="Enter your email"
            setValue={setEmail}
            type="email"
          />
          <CustomInput
            label="Password"
            placeholder="Enter your password"
            setValue={setPassword}
            type="password"
          />
          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
