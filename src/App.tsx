import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root";
import Auth from "./pages/login";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'


const ProtectedRoute = lazy(() => import("./layout/protected-router"));
const DashboardLayout = lazy(() => import("./layout/dashbord-layout"));
const SelersPage = lazy(() => import("./pages/sales"));
const Debts = lazy(() => import("./pages/debts"));
const Products = lazy(() => import("./pages/pruducts"));
const LowProducts = lazy(() => import("./pages/low-products"));
const Customers = lazy(() => import("./pages/customers"));
const Units = lazy(() => import("./pages/units"));
const NotificationsPage = lazy(() => import("./pages/notifications"));
const OrderProducts = lazy(() => import("./pages/order"));
const DashboardMain = lazy(() => import("./pages/dashboard"));
const StoreProfile = lazy(() => import("./pages/profile"));
const OrderNew = lazy(() => import('./pages/order-new'))


const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Suspense wrapper komponenti
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

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
          <SuspenseWrapper>
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
        children: [
          {
            path: "dashboard",
            element: (
              <SuspenseWrapper>
                <DashboardMain />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/orders",
            element: (
              <SuspenseWrapper>
                <OrderProducts />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/order-new",
            element: (
              <SuspenseWrapper>
                <OrderNew />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/selers",
            element: (
              <SuspenseWrapper>
                <SelersPage />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/debts",
            element: (
              <SuspenseWrapper>
                <Debts />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/products",
            element: (
              <SuspenseWrapper>
                <Products />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/low-products",
            element: (
              <SuspenseWrapper>
                <LowProducts />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/customers",
            element: (
              <SuspenseWrapper>
                <Customers />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/units",
            element: (
              <SuspenseWrapper>
                <Units />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/notifications",
            element: (
              <SuspenseWrapper>
                <NotificationsPage />
              </SuspenseWrapper>
            )
          },
          {
            path: "dashboard/profile",
            element: (
              <SuspenseWrapper>
                <StoreProfile />
              </SuspenseWrapper>
            )
          },
        ]
      },
    ]
  }
])


const App = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;