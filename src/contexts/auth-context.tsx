"use client";

import { useQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
import { GET_CURRENT_USER } from "../lib/graphql-operations";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const { refetch } = useQuery(GET_CURRENT_USER, {
    skip: !token,
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
      setIsLoading(false);
    },
    onError: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setToken(null);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  const login = (newToken: string, userInfo: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userInfo);
    router.push("/todos");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
