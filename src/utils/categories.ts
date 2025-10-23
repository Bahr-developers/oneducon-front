import customAxios from "@/services"

interface categoryData {
    id?: string
    name: string
    store_id?: number
}

export const categoryUtils = {
    getCategory: async () => {
        const { data } = await customAxios.get('categories')
        return data
    },
    getCategoryByID: async (id: string) => {
        const { data } = await customAxios.get(`categories/${id}`)
        return data
    },
    postCategory: async ({ name, store_id }: categoryData) => {
        const { data } = await customAxios.post('categories', {
            name,
            store_id
        })
        return data
    },
    patchCategory: async ({ id, name }: categoryData) => {
        const { data } = await customAxios.patch(`categories/${id}`, {
            name,
        })
        return data
    },
    deleteCategory: async (id: string) => {
        const { data } = await customAxios.delete(`categories/${id}`)
        return data
    },
}
