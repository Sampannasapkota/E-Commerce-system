import { Navigate } from "react-router";
import { useAuth } from "./context/authContext";
import { Route, Routes } from "react-router";
import Login from "./pages/loginandsignup/login.tsx";
import AppLayout from "./components/appLayout";
import Signup from "./pages/loginandsignup/signup.tsx";
import Dashboard from "./components/dashboard.tsx";
import Public from "./pages/products/public.tsx";

const ProtectedRoutes = () => {
  const { token } = useAuth();
  console.log({ token });
  return token ? <AppLayout /> : <Navigate to="login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/public" element={<Public />} />

      <Route path="/homepage" element={<ProtectedRoutes />}></Route>
    </Routes>
  );
}

export default App;
