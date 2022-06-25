import { Routes, Route } from "react-router-dom";
import { Customers } from "../../pages/Customers";
import { Dashboard } from "../../pages/Dashboard";
import { SignIn } from "../../pages/SignIn";
import { Products } from "../../pages/Products";
import { CreateOrEditProduct } from "../../pages/Products/CreateOrEditProduct";
import { Layout } from "../Layout";
import { RequireAuth } from "../RequireAuth";
import { CreateOrEditCustomers } from "../../pages/Customers/CreateOrEditCustomer";
import { Categories } from "../../pages/Categories";
import { CreateOrEditCategory } from "../../pages/Categories/CreateOrEditCategory";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route
          index
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route path="categorias">
          <Route
            index
            element={
              <RequireAuth roles={["admin"]}>
                <Categories />
              </RequireAuth>
            }
          />
          <Route
            path=":categoryId"
            element={
              <RequireAuth roles={["admin"]}>
                <CreateOrEditCategory />
              </RequireAuth>
            }
          />
          <Route
            path="novo"
            element={
              <RequireAuth roles={["admin"]}>
                <CreateOrEditCategory />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="usuarios">
          <Route
            index
            element={
              <RequireAuth roles={["admin"]}>
                <Customers />
              </RequireAuth>
            }
          />
          <Route
            path=":userId"
            element={
              <RequireAuth roles={["admin"]}>
                <CreateOrEditCustomers />
              </RequireAuth>
            }
          />
          <Route
            path="novo"
            element={
              <RequireAuth roles={["admin"]}>
                <CreateOrEditCustomers />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="produtos">
          <Route
            index
            element={
              <RequireAuth roles={["admin"]}>
                <Products />
              </RequireAuth>
            }
          />
          <Route
            path=":productId"
            element={
              <RequireAuth roles={["admin"]}>
                <CreateOrEditProduct />
              </RequireAuth>
            }
          />
          <Route
            path="novo"
            element={
              <RequireAuth roles={["admin"]}>
                <CreateOrEditProduct />
              </RequireAuth>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <RequireAuth roles={["admin"]}>
              <>Não encontrando</>
            </RequireAuth>
          }
        />
      </Route>

      <Route path="/login" element={<SignIn />} />

      <Route path="*" element={<>Não encontrando</>} />
    </Routes>
  );
}
