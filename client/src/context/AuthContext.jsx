import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (token && role) setUser({ role });
  }, [token, role]);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userId", userData.id);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
