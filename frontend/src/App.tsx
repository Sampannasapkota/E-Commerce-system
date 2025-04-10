import { Navigate } from "react-router";
import { useAuth } from "./context/authContext";
import { Route, Routes } from "react-router";
import Login from "./pages/loginandsignup/login.tsx";
import AppLayout from "./components/appLayout";
import Signup from "./pages/loginandsignup/signup.tsx";

const ProtectedRoutes = () => {
  const { token } = useAuth();
  console.log({ token });
  return token ? <AppLayout /> : <Navigate to="login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/homepage" element={<ProtectedRoutes />}></Route>
    </Routes>
  );
}

export default App;
