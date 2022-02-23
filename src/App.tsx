import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./hooks/auth";
import { ApiNotifyProvider } from "./hooks/apiNotify";

import { AppRoutes } from "./components/AppRoutes";
import { ApiNotify } from "./components/ApiNotify";

function App() {
  return (
    <AuthProvider>
      <ApiNotifyProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <ApiNotify/>
      </ApiNotifyProvider>
    </AuthProvider>
  );
}

export default App;
