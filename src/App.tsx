import { lazy, Suspense } from 'react'
import {
	createBrowserRouter, Outlet,
	RouterProvider,
} from 'react-router-dom'

import Root from './layout/Root'
import Auth from './pages/login'

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'

import { Toaster } from 'react-hot-toast'

const ProtectedRoute = lazy(
	() => import('./layout/protected-router')
)

const RoleRoute = lazy(
	() => import('./layout/role-route')
)

const StoreLayout = lazy(
	() => import('./layout/dashbord-layout')
)

const UserLayout = lazy(
	() => import('./layout/admin-layout')
)

// Store pages
const DashboardMain = lazy(
	() => import('./pages/dashboard')
)

const OrderProducts = lazy(
	() => import('./pages/order')
)

const SelersPage = lazy(
	() => import('./pages/sales')
)

const Expenses = lazy(
	() => import('./pages/expenses')
)

const Debts = lazy(
	() => import('./pages/debts')
)

const DebtsHistore = lazy(
	() => import('./pages/debts/debts-histore')
)

const Products = lazy(
	() => import('./pages/pruducts')
)

const LowProducts = lazy(
	() => import('./pages/low-products')
)

const Customers = lazy(
	() => import('./pages/customers')
)

const Units = lazy(
	() => import('./pages/units')
)

const NotificationsPage = lazy(
	() => import('./pages/notifications')
)

const StoreProfile = lazy(
	() => import('./pages/profile')
)

// User pages
const UserDashboard = lazy(
	() => import('./pages/users/user.tsx')
)

const StoreDashboard = lazy(
	() => import('./pages/stores/stores.tsx')
)

const ErrorPage = lazy(
	() => import('./pages/error-page')
)

const LoadingSpinner = () => (
	<div className='flex min-h-screen items-center justify-center'>
		<div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
	</div>
)

const SuspenseWrapper = ({
							 children,
						 }: {
	children: React.ReactNode
}) => (
	<Suspense fallback={<LoadingSpinner />}>
		{children}
	</Suspense>
)

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,

		errorElement: (
			<SuspenseWrapper>
				<ErrorPage />
			</SuspenseWrapper>
		),

		children: [
			{
				index: true,
				element: <Auth />,
			},
			{
				element: (
					<SuspenseWrapper>
						<ProtectedRoute>
							<Outlet />
						</ProtectedRoute>
					</SuspenseWrapper>
				),

				children: [
					{
						element: (
							<SuspenseWrapper>
								<RoleRoute
									allowedRoles={['STORE']}
								>
									<StoreLayout />
								</RoleRoute>
							</SuspenseWrapper>
						),

						children: [
							{
								path: 'dashboard',
								element: (
									<SuspenseWrapper>
										<DashboardMain />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/orders',
								element: (
									<SuspenseWrapper>
										<OrderProducts />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/selers',
								element: (
									<SuspenseWrapper>
										<SelersPage />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/expenses',
								element: (
									<SuspenseWrapper>
										<Expenses />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/debts',
								element: (
									<SuspenseWrapper>
										<Debts />
									</SuspenseWrapper>
								),
							},

							{
								path: 'debts-histore/:id',
								element: (
									<SuspenseWrapper>
										<DebtsHistore />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/products',
								element: (
									<SuspenseWrapper>
										<Products />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/low-products',
								element: (
									<SuspenseWrapper>
										<LowProducts />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/customers',
								element: (
									<SuspenseWrapper>
										<Customers />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/units',
								element: (
									<SuspenseWrapper>
										<Units />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/notifications',
								element: (
									<SuspenseWrapper>
										<NotificationsPage />
									</SuspenseWrapper>
								),
							},

							{
								path: 'dashboard/profile',
								element: (
									<SuspenseWrapper>
										<StoreProfile />
									</SuspenseWrapper>
								),
							},
						],
					},
					{
						element: (
							<SuspenseWrapper>
								<RoleRoute
									allowedRoles={['ADMIN']}
								>
									<UserLayout />
								</RoleRoute>
							</SuspenseWrapper>
						),

						children: [
							{
								path: 'users',
								element: (
									<SuspenseWrapper>
										<UserDashboard />
									</SuspenseWrapper>
								),
							},
							{
								path: 'stores',
								element: (
									<SuspenseWrapper>
										<StoreDashboard />
									</SuspenseWrapper>
								),
							}
						],
					},
				],
			},
		],
	},
])

const queryClient = new QueryClient()

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster />
		</QueryClientProvider>
	)
}

export default App