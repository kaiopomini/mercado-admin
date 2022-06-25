import { api } from "./api.service";

export async function signIn(
  email: string,
  password: string
): Promise<string | null> {
  const { data } = await api.post("auth", {
    email: email,
    password: password,
  });
  const { success } = data;
  if (success) {
    return data.payload;
  }

  return null;
}

export const TOKEN_KEY = "@token";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
