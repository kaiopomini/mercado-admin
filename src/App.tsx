import { BrowserRouter, useNavigate } from "react-router-dom";

import { AuthProvider } from "./hooks/auth";
import { ApiNotifyProvider, useApiNotify } from "./hooks/apiNotify";

import { AppRoutes } from "./components/AppRoutes";

import { customIntercept } from "./services/api.service";

function AxiosNavigateSetup() {
  const navigate = useNavigate();
  customIntercept(navigate, useApiNotify());
  return <></>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiNotifyProvider>
          <AppRoutes />
          {/* <ApiNotify /> */}
          <AxiosNavigateSetup />
        </ApiNotifyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
