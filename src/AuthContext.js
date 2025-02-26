import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Ensure correct import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        if (token.split(".").length !== 3) {
          throw new Error("Invalid token format");
        }

        const decoded = jwtDecode(token);
        console.log("Valid Token:", decoded);
        setUser({ ...decoded, token });
      } catch (error) {
        console.error("Invalid Token Detected:", error);
        localStorage.removeItem("token"); // ✅ Auto remove invalid token
        setUser(null);
      }
    }
  }, []);

  const login = (userData) => {
    if (!userData.token || userData.token.split(".").length !== 3) {
      console.error("Invalid Token Received:", userData.token);
      return;
    }

    console.log("Storing Valid Token:", userData.token);
    localStorage.setItem("token", userData.token);
    setUser({ ...jwtDecode(userData.token), token: userData.token });
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
