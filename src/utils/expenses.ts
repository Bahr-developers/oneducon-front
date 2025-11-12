import customAxios from "@/services"


interface expensesType {
    definition: string,
    price: number,
    expense_type_id: number,
    store_id: number
}

interface editExpenses {
    id: string
    definition: string,
    price: number,
    expense_type_id: number,
}

interface propsRequest {
    page: number,
    limit: number
}

export const expensesUtils = {
    getExpenses: async ({ limit, page }: propsRequest) => {
        const { data } = await customAxios.get(`expenses?page=${page}&limit=${limit}`)
        return data
    },
    getExpensesById: async (id: string) => {
        const { data } = await customAxios.get(`expenses/${id}`)
        return data
    },
    postExpenses: async (expensesData: expensesType) => {
        const { data } = await customAxios.post('expenses', expensesData)
        return data
    },
    editExpenses: async ({ definition, expense_type_id, id, price }: editExpenses) => {
        const { data } = await customAxios.patch(`expenses/${id}`, { definition, expense_type_id, price })
        return data
    },
    deleteExpenses: async (id: string) => {
        const { data } = await customAxios.delete(`expenses/${id}`)
        return data
    },
}