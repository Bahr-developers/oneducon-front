import customAxios from "@/services"

interface productData {
    id?: string
    name: string
    quantity: number
    reminder_quantity: number
    usd_rate: number
    cost_price: number
    cost_price_usd: number
    sale_price: number
    sale_price_usd: number
    unit_id: number
    category_id: number
    store_id?: number
}

export const productUtils = {
    getProducts: async () => {
        const { data } = await customAxios.get('products')
        return data
    },
    getProductByID: async (id: string) => {
        const { data } = await customAxios.get(`products/${id}`)
        return data
    },
    postProduct: async (product: productData) => {
        const { data } = await customAxios.post('products', product)
        return data
    },
    patchProduct: async (product: productData) => {
        const { id, ...rest } = product
        const { data } = await customAxios.patch(`products/${id}`, rest)
        return data
    },
    deleteProduct: async (id: string) => {
        const { data } = await customAxios.delete(`products/${id}`)
        return data
    },
}
