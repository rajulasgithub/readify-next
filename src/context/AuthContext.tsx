"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  role: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  loginUser: (
    token: string,
    role: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string
  ) => void;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = Cookies.get("accessToken");
    const savedRole = Cookies.get("role");
    const savedEmail = Cookies.get("email");
    const savedFirstName = Cookies.get("firstName");
    const savedLastName = Cookies.get("lastName");
    const savedPhone = Cookies.get("phone");

    if (savedToken) setToken(savedToken);
    if (savedRole) setRole(savedRole);
    if (savedEmail) setEmail(savedEmail);
    if (savedFirstName) setFirstName(savedFirstName);
    if (savedLastName) setLastName(savedLastName);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const loginUser = (
    tokenValue: string,
    roleValue: string,
    emailValue: string,
    firstNameValue: string,
    lastNameValue: string,
    phoneValue: string
  ) => {
    setToken(tokenValue);
    setRole(roleValue);
    setEmail(emailValue);
    setFirstName(firstNameValue);
    setLastName(lastNameValue);
    setPhone(phoneValue);

    Cookies.set("accessToken", tokenValue, { expires: 7 });
    Cookies.set("role", roleValue, { expires: 7 });
    Cookies.set("email", emailValue, { expires: 7 });
    Cookies.set("firstName", firstNameValue, { expires: 7 });
    Cookies.set("lastName", lastNameValue, { expires: 7 });
    Cookies.set("phone", phoneValue, { expires: 7 });
  };

  const logoutUser = () => {
    setToken(null);
    setRole(null);
    setEmail(null);
    setFirstName(null);
    setLastName(null);
    setPhone(null);

    Cookies.remove("accessToken");
    Cookies.remove("role");
    Cookies.remove("email");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("phone");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        email,
        firstName,
        lastName,
        phone,
        loginUser,
        logoutUser,
      }}
    >
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
