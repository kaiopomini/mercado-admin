import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Customers } from '../../pages/Customers';
import { Dashboard } from '../../pages/Dashboard';
import { Home } from '../../pages/Home';
import { Layout } from '../Layout';
import { RequireAuth } from '../RequireAuth';
// import Login from './components/oauth/Login';
// import Logout from './components/oauth/Logout';
// import RenewToken from './components/oauth/RenewToken';
// import ProtectedRoute from './components/ProtectedRoute';
// import NotFound from './views/errors/NotFound';
// import Index from './views/Index';
// import MainContainer from './views/MainContainer';
// import ViewUserProfile from './views/user/profile/ViewUserProfile';
// import CreateUserProfile from './views/user/profile/CreateUserProfile';
// import UpdateUserProfile from './views/user/profile/UpdateUserProfile';
// import PartnerProfile from './views/partner/profile/PartnerProfile';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<RequireAuth ><Layout /></RequireAuth>} >
                <Route index element={<RequireAuth ><Dashboard/></RequireAuth>} />
                <Route path="customers" element={<RequireAuth roles={['admin']}><Customers/></RequireAuth>} />
            </Route>

            <Route path="/login" element={<Home />} />

            <Route path="*" element={<>Não encontrando</>} />
        </Routes>
    );
};

export default AppRoutes;