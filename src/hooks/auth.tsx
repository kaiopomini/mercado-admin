import { createContext, useContext, useState, ReactNode } from "react";
import { api } from "../services/api.service";
import {
  login,
  logout,
  signIn as signInService,
  isAuthenticated as isAuthenticatedService,
} from "../services/auth.service";

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  roles: any[];
  permissions: any[];
};

export type LoginResponse = {
  message: string;
  success: boolean;
};

interface AuthContextData {
  loading: boolean;
  user: User;
  signIn: (email: string, password: string) => Promise<LoginResponse>;
  signOut: () => Promise<void>;
  isAuthenticated: () => boolean;
  updateUser: () => void;
}

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({} as User);

  const [loading, setLoading] = useState(false);

  async function updateUser() {
    try {
      const dataUser = (await api.get("me")).data;
      if (dataUser.success) {
        setUser({
          ...dataUser.payload,
        } as User);
      }
    } catch (error) {}
  }

  async function signIn(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      setLoading(true);

      const token = await signInService(email, password);

      if (token) {
        login(token);
      }
      return { message: "Login realizado com sucesso.", success: true };
    } catch (error: any) {
      const response = {
        message:
          error?.response?.data?.message ||
          "Não foi possível realizar o login.",
        success: false,
      };
      return response;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    api.defaults.headers.common.Authorization = "";
    logout();
  }

  function isAuthenticated() {
    return isAuthenticatedService();
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, loading, isAuthenticated, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth, AuthContext };
