import { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';
import { login, logout, signIn as signInService, isAuthenticated as isAuthenticatedService } from '../services/authService';


export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  roles: any[];
  permissions: any[];
};

interface AuthContextData {
  loading: boolean;
  user: User | undefined;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: () => boolean;
  validadeLogin: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState({} as User);

  const [loading, setLoading] = useState(false);


  async function validadeLogin(){
    const dataUser = (await api.get('me')).data;
    if (dataUser.success) {
      setUser({
        ...dataUser.payload,
      } as User);
      return true;
    }
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      setLoading(true);

      const token = await signInService(email, password)

      if (token) {
        login(token)
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {

    api.defaults.headers.common.Authoization = '';
    logout()

  }

  function isAuthenticated() {
    return (isAuthenticatedService())
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, isAuthenticated, validadeLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth, AuthContext };