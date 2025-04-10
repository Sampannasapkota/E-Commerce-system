import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import { api } from "../../api";
import CustomInput from "../../components/customInput.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      console.log("Token:", token);
      console.log(response);
      login(token);
      navigate("/homepage");
    } catch (error: any) {
      console.error(error);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="header">Login</h1>
        <CustomInput
          label="Email"
          placeholder="Enter your email"
          setValue={setEmail}
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          setValue={setPassword}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">login</button>
      </form>
    </div>
  );
}
