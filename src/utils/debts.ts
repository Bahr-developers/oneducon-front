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
    client_id: number,
    status: 'PAID' | 'UNPAID' | ''
}

interface paymentINfo {
    debts_id:string,
    amount: number,
    note: string
}

export const debtsUtils = {
    getDebts: async ({ limit, page, search }: getParams) => {
        const params = new URLSearchParams()
        params.append('limit', limit.toString())
        params.append('page', page.toString())
        if (search) {
            params.append('search', search)
        }
        const { data } = await customAxios.get(`debts?${params.toString()}`)
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
    paymentDebts: async ({amount,debts_id,note}:paymentINfo) => {
        const {data} = await customAxios.post(`debts/${debts_id}/payments`, {
            amount,
            note
        })
        return data
    },
    editDebts: async ({ client_id, id, price, reminder, return_time, status }: debtsInfo) => {
        const { data } = await customAxios.patch(`debts/${id}`, {
            client_id, price, reminder, return_time, status
        })
        return data
    },
    deleteDebts: async (id: string) => {
        const { data } = await customAxios.delete(`debts/${id}`)
        return data
    }
}