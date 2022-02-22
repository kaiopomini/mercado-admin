import axios from 'axios';
import { getToken, logout } from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
  };
  
  }
  return config;
});

api.interceptors.response.use( async (response) => {
  return response
}, async (error) => {
  if(error.response?.status === 401 && error.response.data?.action === 'logout') {
    logout()
    alert('Sua conexão espirou.')
    window.location.reload()
  }

  return Promise.reject(error);
})

export { api };