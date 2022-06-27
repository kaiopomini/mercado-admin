import { createContext, useContext, ReactNode } from "react";

import { useSnackbar } from "notistack";

export enum NotifyTypesEnum {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Success = "success",
  Default = "default",
}
export interface ApiNotifyContextData {
  addNotification: (message: string, type: NotifyTypesEnum) => void;
}

type ApiNotifyProviderProps = {
  children: ReactNode;
};

const ApiNotifyContext = createContext<ApiNotifyContextData>(
  {} as ApiNotifyContextData
);

function ApiNotifyProvider({ children }: ApiNotifyProviderProps) {
  const { enqueueSnackbar } = useSnackbar();

  const addNotification = (message: string, severity?: NotifyTypesEnum) => {
    enqueueSnackbar(message, {
      variant: severity ? severity : NotifyTypesEnum.Default,
      autoHideDuration: 7000,
      anchorOrigin: { vertical: "top", horizontal: "right" },
      preventDuplicate: true,
    });
  };

  const contextValue = {
    addNotification,
  };

  return (
    <ApiNotifyContext.Provider value={{ ...contextValue }}>
      {children}
    </ApiNotifyContext.Provider>
  );
}

function useApiNotify() {
  const context = useContext(ApiNotifyContext);

  return context;
}

export { ApiNotifyProvider, useApiNotify, ApiNotifyContext };
