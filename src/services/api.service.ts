import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { ApiNotifyContextData, NotifyTypesEnum } from "../hooks/apiNotify";
import { getToken, logout } from "./auth.service";

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

const customIntercept = (
  navigate: NavigateFunction,
  notify: ApiNotifyContextData
) => {
  const { addNotification } = notify;
  api.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      if (
        error.response?.status === 401 &&
        error.response.data?.action === "logout"
      ) {
        logout();
        addNotification(
          "Sessão expirada, faça login novamente.",
          NotifyTypesEnum.Error
        );
        navigate("/login");
      }

      return Promise.reject(error);
    }
  );
};

export { api, customIntercept };
