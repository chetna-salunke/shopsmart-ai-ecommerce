import { createContext, useContext, useEffect, useState } from "react";

// DEMO ONLY: no server and no real accounts. The signed-in user is just kept in this browser's localStorage.
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });
  useEffect(() => {
    user ? localStorage.setItem("user", JSON.stringify(user)) : localStorage.removeItem("user");
  }, [user]);

  const nameFrom = (email) => {
    const n = email.split("@")[0].replace(/[._-]+/g, " ").trim();
    return n ? n.replace(/\b\w/g, (c) => c.toUpperCase()) : "Shopper";
  };
  const login = (email) => setUser({ name: nameFrom(email), email, provider: "email" });
  const signup = (name, email) => setUser({ name: name.trim(), email, provider: "email" });
  const loginWithGoogle = () => setUser({ name: "Demo User", email: "demo.user@gmail.com", provider: "google" });
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
}
