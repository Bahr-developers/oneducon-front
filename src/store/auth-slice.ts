import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserRole = 'ADMIN' | 'STORE'

interface User {
    id: string
    name: string
    phone: string | null
    email: string
    role: 'ADMIN'
}

interface Store {
    id: string
    name: string
    email: string
    link: string
    usd_rate: number
    is_active: boolean
    user_id: string
}

interface AuthState {
    token: string | null
    role: UserRole | null
    user: User | null
    store: Store | null
}

const getInitialState = (): AuthState => {
    const token = localStorage.getItem('accessToken')
    const role = localStorage.getItem('role') as UserRole | null

    const user = localStorage.getItem('user')
    const store = localStorage.getItem('store')

    return {
        token,
        role,
        user: user ? JSON.parse(user) : null,
        store: store ? JSON.parse(store) : null,
    }
}

const initialState: AuthState = getInitialState()

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        setAuth: (
            state,
            action: PayloadAction<{
                token: string
                role: UserRole
                user?: User | null
                store?: Store | null
            }>
        ) => {
            const { token, role, user, store } = action.payload

            state.token = token
            state.role = role
            state.user = user ?? null
            state.store = store ?? null

            localStorage.setItem('accessToken', token)
            localStorage.setItem('role', role)

            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
            }

            if (store) {
                localStorage.setItem('store', JSON.stringify(store))
            }
        },

        logout: state => {
            state.token = null
            state.role = null
            state.user = null
            state.store = null

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('role')
            localStorage.removeItem('user')
            localStorage.removeItem('store')
        },
    },
})

export const { setAuth, logout } = authSlice.actions

export default authSlice.reducer