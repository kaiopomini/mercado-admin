import { Routes, Route } from 'react-router-dom';
import { Customers } from '../../pages/Customers';
import { Dashboard } from '../../pages/Dashboard';
import { Home } from '../../pages/Home';
import { Product } from '../../pages/Product';
import { Products } from '../../pages/Products';
import { ProductNew } from '../../pages/ProductNew';
import { Layout } from '../Layout';
import { RequireAuth } from '../RequireAuth';


export function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<RequireAuth ><Layout /></RequireAuth>} >
                <Route index element={<RequireAuth ><Dashboard/></RequireAuth>} />
                <Route path="customers" element={<RequireAuth roles={['admin']}><Customers/></RequireAuth>} />
                <Route path="product" element={<RequireAuth roles={['admin']}><Product/></RequireAuth>} >
                    <Route path=":id" element={<RequireAuth roles={['admin']}><Product/></RequireAuth>} />
                    
                </Route>
                <Route path="products" element={<RequireAuth roles={['admin']}><Products/></RequireAuth>} />
                <Route path="newproduct" element={<RequireAuth roles={['admin']}><ProductNew/></RequireAuth>} />
                <Route path="*" element={<RequireAuth roles={['admin']}><>Não encontrando</></RequireAuth>} />
            </Route>

            <Route path="/login" element={<Home />} />

            <Route path="*" element={<>Não encontrando</>} />
        </Routes>
    );
};
