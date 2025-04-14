import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api";
import CustomInput from "../../components/customInput";
import "./signup.css";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(fullname, email, mobile, address, password, role);
    const role_id = localStorage.getItem("role_id");
    try {
      const response = await api.post("/auth/register", {
        fullname,
        email,
        mobile,
        address,
        role,
        role_id: role_id && parseInt(role_id, 10),
        password,
      });
      console.log(response);
      navigate("/dashboard");
      localStorage.setItem("token", response.data.token);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="signup-container">
      <button
        className="back-button"
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </button>
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Signup</h2>
        <div className="form-group">
          <CustomInput
            label="Fullname"
            placeholder="Enter your fullname"
            setValue={setFullname}
          />
          <CustomInput
            label="Email"
            placeholder="Enter your email"
            setValue={setEmail}
          />
          <CustomInput
            label="Role"
            placeholder="Eg- Admin, Seller, User"
            setValue={setRole}
          />
          <CustomInput
            label="Address"
            placeholder="Enter your address"
            setValue={setAddress}
          />
          <CustomInput
            label="Mobile"
            placeholder="Mobile Number"
            setValue={setMobile}
          />
          <CustomInput
            label="Password"
            placeholder="Enter password"
            setValue={setPassword}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-button">
          Signup
        </button>
      </form>
    </div>
  );
};
export default Signup;
