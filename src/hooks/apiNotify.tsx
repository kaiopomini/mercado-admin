import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { ApiNotify } from "../components/ApiNotify";

export enum NotifyTypesEnum {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Success = "success",
}
export interface ApiNotifyContextData {
  removeNotification: () => void;
  addNotification: (message: string, type: NotifyTypesEnum) => void;
  notificationMessage: string;
  severity: NotifyTypesEnum | undefined;
}

type ApiNotifyProviderProps = {
  children: ReactNode;
};

const ApiNotifyContext = createContext<ApiNotifyContextData>(
  {} as ApiNotifyContextData
);

function ApiNotifyProvider({ children }: ApiNotifyProviderProps) {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState<NotifyTypesEnum>();

  const removeNotification = () => {
    setNotificationMessage("");
  };

  const addNotification = (message: string, severity?: NotifyTypesEnum) => {
    setNotificationMessage(message);
    if (severity) {
      setSeverity(severity);
    }
  };

  const contextValue = {
    removeNotification: useCallback(() => removeNotification(), []),
    addNotification: useCallback(
      (message, type) => addNotification(message, type),
      []
    ),
    notificationMessage,
    severity,
  };

  return (
    <ApiNotifyContext.Provider value={{ ...contextValue }}>
      {children}
      <ApiNotify />
    </ApiNotifyContext.Provider>
  );
}

function useApiNotify() {
  const context = useContext(ApiNotifyContext);

  return context;
}

export { ApiNotifyProvider, useApiNotify, ApiNotifyContext };
