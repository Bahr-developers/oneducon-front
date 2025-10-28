import custimAxios from '@/services'

interface AuthLogin {
    email: string,
    password: string
}

export const authUtils = {
    authStore: async ({ email, password }: AuthLogin) => {
        const { data } = await custimAxios.post('auth/login/store', {
            email,
            password,
        })
        localStorage.setItem("accessToken", data?.data?.token);
        localStorage.setItem("storeId", data?.data?.store?.id);
        localStorage.setItem("usd_rate", data?.data?.store?.usd_rate);
        return data
    },
    authAdmin: async ({ email, password }: AuthLogin) => {
        const { data } = await custimAxios.post('auth/login/user', {
            email,
            password,
        })
        localStorage.setItem("accessToken", data?.data?.token);
        return data
    }
}