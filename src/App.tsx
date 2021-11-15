import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './hooks/auth';

import { AppRoutes } from './components/AppRoutes';

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
