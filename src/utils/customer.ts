import customAxios from "@/services"

export interface customerType {
    id?: string,
    name: string,
    phone: string,
    store_id?: number
}


export const customerUtils = {
    getCustomer: async () => {
        const { data } = await customAxios.get('clients')
        return data
    },
    getCustomerById: async (id: string) => {
        const { data } = await customAxios.get(`clients/${id}`)
        return data
    },
    postCustomer: async ({ name, phone, store_id }: customerType) => {
        const { data } = await customAxios.post('clients', { name, phone, store_id })
        return data
    },
    editCustomer: async ({ name, phone, id }: customerType) => {
        const { data } = await customAxios.patch(`clients/${id}`, { name, phone })
        return data
    },
    deleteCustomer: async (id: string) => {
        const { data } = await customAxios.delete(`clients/${id}`)
        return data
    },
}