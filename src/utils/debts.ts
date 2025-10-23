import customAxios from "@/services"


export const debtsUtils = {
    getDebts: async () => {
        const { data } = await customAxios.get('debts')
        return data
    }
}