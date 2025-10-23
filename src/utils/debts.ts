import customAxios from "@/services"



interface getParams {
    limit: number,
    page: number,
    search?: string;
    category?: string
}

export const debtsUtils = {
    getDebts: async ({ limit, page, search }: getParams) => {
        const { data } = await customAxios.get(`debts?page=${page}&limit=${limit}&search=${search}`)
        return data
    }
}