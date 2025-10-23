import customAxios from "@/services"

interface userData {
    id?: string
    name: string,
    email: string,
    password: string
}

export const userUtils = {
    getUser: async () => {
        const { data } = await customAxios.get('users')
        return data
    },
    getUserByID: async (id: string) => {
        const { data } = await customAxios.get(`users/${id}`)
        return data
    },
    postUser: async ({ email, name, password }: userData) => {
        const { data } = await customAxios.post('users', {
            email, name, password
        })
        return data
    },
    patchUser: async ({ email, name, password, id }: userData) => {
        const { data } = await customAxios.patch(`users/${id}`, {
            email, name, password
        })
        return data
    },
    deletedUser: async (id: string) => {
        const { data } = await customAxios.delete(`users/${id}`)
        return data
    },
}