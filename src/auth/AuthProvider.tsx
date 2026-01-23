import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
        value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
     }}
    >
        {children}
    </AuthContext.Provider>
  );
}
