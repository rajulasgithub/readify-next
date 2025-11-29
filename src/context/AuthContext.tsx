"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

// ---------- TYPES ----------
interface AuthContextType {
  token: string | null;
  role: string | null;
  email: string | null;
  loginUser: (token: string, role: string, email: string) => void;
  logoutUser: () => void;
}

// Create context with type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- PROVIDER ----------
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Load from localStorage on first render
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("role");
    const savedEmail = localStorage.getItem("email");

    if (savedToken) setToken(savedToken);
    if (savedRole) setRole(savedRole);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // Save login data
  const loginUser = (tokenValue: string, roleValue: string, emailValue: string) => {
    setToken(tokenValue);
    setRole(roleValue);
    setEmail(emailValue);

    localStorage.setItem("accessToken", tokenValue);
    localStorage.setItem("role", roleValue);
    localStorage.setItem("email", emailValue);
  };

  // Clear login data
  const logoutUser = () => {
    setToken(null);
    setRole(null);
    setEmail(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ token, role, email, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AppProvider");
  }
  return context;
};
