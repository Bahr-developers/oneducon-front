import customAxios from "@/services"



interface getParams {
    limit: number,
    page: number,
    search?: string;
    category?: string
}


interface debtsInfo {
    id: string
    price: number,
    reminder: string,
    return_time: Date | undefined,
    client_id: number
}

export const debtsUtils = {
    getDebts: async ({ limit, page, search }: getParams) => {
        const { data } = await customAxios.get(`debts?page=${page}&limit=${limit}&search=${search}`)
        return data
    },
    getDebtByClientId: async (id: string) => {
        const { data } = await customAxios.get(`debts/by-client/${id}`)
        return data
    },
    getDebtsAll: async () => {
        const { data } = await customAxios.get(`debts`)
        return data
    },
    editDebts: async ({ client_id, id, price, reminder, return_time }: debtsInfo) => {
        const { data } = await customAxios.patch(`debts/${id}`, {
            client_id, price, reminder, return_time
        })
        return data
    },
    deleteDebts: async (id: string) => {
        const { data } = await customAxios.delete(`debts/${id}`)
        return data
    }
}