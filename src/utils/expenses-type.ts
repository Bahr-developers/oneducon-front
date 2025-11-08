import customAxios from "@/services"


export const ExpensesTypeUtils = {
    getExpensesType: async () => {
        const { data } = await customAxios.get('expense-types')
        return data
    },
    posetExpensesType: async (name: string) => {
        const { data } = await customAxios.post('expense-types', { name })
        return data
    },
    editExpensesType: async ({ id, name }: { id: string, name: string }) => {
        const { data } = await customAxios.patch(`expense-types/${id}`, { name })
        return data
    },
    deleteExpensesType: async (id: string) => {
        const { data } = await customAxios.delete(`expense-types/${id}`)
        return data
    },
}