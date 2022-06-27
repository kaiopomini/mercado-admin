import { BrowserRouter, useNavigate } from "react-router-dom";

import { AuthProvider } from "./hooks/auth";
import { ApiNotifyProvider, useApiNotify } from "./hooks/apiNotify";
import { SnackbarProvider } from "notistack";

import { AppRoutes } from "./components/AppRoutes";

import { customIntercept } from "./services/api.service";

function AxiosNavigateSetup() {
  const navigate = useNavigate();
  customIntercept(navigate, useApiNotify());
  return <></>;
}

function App() {
  return (
    <SnackbarProvider>
      <ApiNotifyProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            {/* <ApiNotify /> */}

            <AxiosNavigateSetup />
          </BrowserRouter>
        </AuthProvider>
      </ApiNotifyProvider>
    </SnackbarProvider>
  );
}

export default App;
