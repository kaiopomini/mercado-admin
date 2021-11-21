import { Routes, Route } from 'react-router-dom';
import { Customers } from '../../pages/Customers';
import { Dashboard } from '../../pages/Dashboard';
import { SignIn } from '../../pages/SignIn';
import { Product } from '../../pages/Product';
import { Products } from '../../pages/Products';
import { NewProduct } from '../../pages/NewProduct';
import { Layout } from '../Layout';
import { RequireAuth } from '../RequireAuth';


export function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<RequireAuth ><Layout /></RequireAuth>} >
                <Route index element={<RequireAuth ><Dashboard /></RequireAuth>} />
                <Route path="customers" element={<RequireAuth roles={['admin']}><Customers /></RequireAuth>} />
                <Route path="products">
                    <Route index element={<RequireAuth roles={['admin']}><Products /></RequireAuth>} />
                    <Route path=":id" element={<RequireAuth roles={['admin']}><Product /></RequireAuth>} />
                    <Route path="new" element={<RequireAuth roles={['admin']}><NewProduct /></RequireAuth>} />

                </Route>
                <Route path="*" element={<RequireAuth roles={['admin']}><>Não encontrando</></RequireAuth>} />
            </Route>

            <Route path="/login" element={<SignIn />} />

            <Route path="*" element={<>Não encontrando</>} />
        </Routes>
    );
};
