import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './hooks/auth';

import { Layout } from './components/Layout';
import { Customers } from './pages/Customers';
import { Dashboard } from './pages/Dashboard';
import { Home } from "./pages/Home";
import AppRoutes from './components/AppRoutes';

function App() {

  

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
