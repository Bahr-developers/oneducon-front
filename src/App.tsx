import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root";
import Auth from "./pages/login";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from "./layout/protected-router";
import DashboardLayout from "./layout/dashbord-layout";
import SelersPage from "./pages/sales";
import Debts from "./pages/debts";
import Products from "./pages/pruducts";
import LowProducts from "./pages/low-products";
import Customers from "./pages/customers";
import Units from "./pages/units";
import NotificationsPage from "./pages/notifications";
import OrderProducts from "./pages/order";
import DashboardMain from "./pages/dashboard";
import StoreProfile from "./pages/profile";



const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Auth />
      },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <DashboardMain /> },
          { path: "dashboard/orders", element: <OrderProducts /> },
          { path: "dashboard/selers", element: <SelersPage /> },
          { path: "dashboard/debts", element: <Debts /> },
          { path: "dashboard/products", element: <Products /> },
          { path: "dashboard/low-products", element: <LowProducts /> },
          { path: "dashboard/customers", element: <Customers /> },
          { path: "dashboard/units", element: <Units /> },
          { path: "dashboard/notifications", element: <NotificationsPage /> },
          { path: "dashboard/profile", element: <StoreProfile /> },
        ]
      },
    ]
  }
])


const App = () => {
  const queryClient = new QueryClient()
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </div>
  );
};

export default App;