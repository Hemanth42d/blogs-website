import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@mvhemanth.me",
  password: "admin123",
};

// Context provider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAdmin");
    const savedUser = localStorage.getItem("adminUser");

    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // TODO: Replace with real backend login API
    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const userData = {
        email: email,
        role: "admin",
        loginTime: new Date().toISOString(),
      };

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminUser", JSON.stringify(userData));

      return { success: true };
    } else {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminUser");
    // TODO: Call backend API to invalidate session
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
