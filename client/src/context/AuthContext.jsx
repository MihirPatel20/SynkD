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

      if (token) {
        setIsAuthenticated(true);
        try {
          const userData = await fetchUserProfile(token);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle token expiration or other errors
          logout();
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("yt_tokens");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuthenticated: (value) => {
          if (value !== isAuthenticated) {
            setIsAuthenticated(value);
          }
        },
        setUser,
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
