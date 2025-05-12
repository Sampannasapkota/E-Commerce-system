import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../api";

interface User {
  id: number;
  fullname: string;
}

interface UserContextType {
  user: User | null;
  fetchUser: () => void;
  clearUser: () => void;
}
const UserContext = createContext<UserContextType>({
  user: null,
  fetchUser: () => {},
  clearUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await api.get(`/users/${userId}`);
      const userData: User = response.data;
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user :", error);
    }
  };
  const clearUser = () => {
    setUser(null);
  };

  useEffect(() => {
    const storedFullname = localStorage.getItem("fullname");
    const storedId = localStorage.getItem("userId");

    if (storedId && storedFullname) {
      setUser({
        id: parseInt(storedId),
        fullname: storedFullname,
      });
    } else {
      fetchUser(); // fallback if no name found
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserProvider, UserContext };
