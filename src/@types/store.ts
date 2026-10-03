export interface Store {
    id: string
    name: string
    email: string
    password: string
    link: any
    usd_rate: any
    is_active: boolean
    user_id: string
    created_at: string
    updated_at: string
    user: User
}

export interface User {
    id: string
    name: string
    phone: any
    email: string
    password: string
    role: string
    created_at: string
    updated_at: string
}
