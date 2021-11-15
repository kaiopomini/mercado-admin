import { api } from "./api"

export async function signIn(email: string, password: string) : Promise<string | null>{

    const { data } = await api.post('auth', {
        email: email,
        password: password,
      });
      const { success } = data;
      if (success) {
        return data.payload; 
    }
    
    return null
}