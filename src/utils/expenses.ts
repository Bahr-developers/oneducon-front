import customAxios from "@/services"


interface expensesType {
    definition: string,
    price: number,
    expense_type_id: number,
    store_id: number
    id?: string
}

export const expensesUtils = {
    getExpenses: async () => {
        const { data } = await customAxios.get('expenses')
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
    editExpenses: async (expensesData: expensesType, id: string) => {
        const { data } = await customAxios.patch(`expenses/${id}`, expensesData)
        return data
    },
    deleteExpenses: async (id: string) => {
        const { data } = await customAxios.delete(`expenses/${id}`)
        return data
    },
}