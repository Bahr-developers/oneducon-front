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

interface getParams {
    limit: number,
    page: number,
    search?: string;
    category?: string
}
interface exportFile {
    categoryId?: string | null,
    search?: string
}

export const productUtils = {
    getProducts: async ({ limit, page, search }: getParams) => {
        const { data } = await customAxios.get(`products?page=${page}&limit=${limit}&search=${search}`)
        return data
    },
    getProductsAlls: async () => {
        const { data } = await customAxios.get(`products`)
        return data
    },
    getProductExport: async ({ categoryId, search }: exportFile) => {
        const params = new URLSearchParams();

        if (categoryId) params.append("category_id", String(categoryId));
        if (search) params.append("search", search);

        const { data } = await customAxios.get(`products/export?${params.toString()}`, {
            responseType: "blob"
        });
        return data
    },
    getLowProductExport: async (store_id: string) => {
        const { data } = await customAxios.get(`products/low-stock/export?store_id=${store_id}`, {
            responseType: 'blob'
        })
        return data
    },
    getProductsLows: async ({ limit, page }: getParams) => {
        const { data } = await customAxios.get(`products/low-stock?page=${page}&limit=${limit}`)
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
    postProductImport: async (file: FormData) => {

        const { data } = await customAxios.post(`products/import`, file)
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
