import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';
import useStorage from '../utils/useStorage';

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar:string;
  roles: any[];
  permissions: any[];
};

interface AuthContextData {
  loading: boolean;
  user: User | undefined;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  token: void | ((newValue: any) => void);
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

  const [token, setToken, removeToken] = useStorage('token');
  const [user, setUser, removeUser] = useStorage('user');

  const [loading, setLoading] = useState(false);
  

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      setLoading(true);
      const { data } = await api.post('auth', {
        email: email,
        password: password,
      });
      const { success } = data;
      if (success) {
        await setToken(data.payload);
        api.defaults.headers.common.Authorization = `Bearer ${data.payload}`;
        const { payload }  = (await api.get('me')).data;
        
        setUser({
          ...payload,
        } as User);
        return true;
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
    await removeUser();
    api.defaults.headers.common.Authoization = '';
    await removeToken()
    
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth, AuthContext };