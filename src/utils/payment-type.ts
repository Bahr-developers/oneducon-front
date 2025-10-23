import customAxios from "@/services"


export const paymentUtils = {
    getPayments: async () => {
        const { data } = await customAxios.get('payment-types')
        return data
    }
}