import { createContext, useContext, useState } from "react";

interface AuthContextType {
  token?: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout?: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("token");

  const login = (token: string) => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth };
