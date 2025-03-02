import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchUserProfile } from "../services/api/googleApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status and fetch user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");

      if (token) {
        setIsAuthenticated(true);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          try {
            const userData = await fetchUserProfile(token);
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Handle token expiration or other errors
            logout();
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem("access_token", token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        setIsAuthenticated,
        setUser: (userData) => {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        },
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
