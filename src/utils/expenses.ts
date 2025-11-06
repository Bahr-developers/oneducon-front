import customAxios from "@/services"


export const expensesUtils = {
    getExpenses: async () => {
        const { data } = await customAxios.get('expenses')
        return data
    },
    getExpensesById: async (id: string) => {
        const { data } = await customAxios.get(`expenses/${id}`)
        return data
    }
}