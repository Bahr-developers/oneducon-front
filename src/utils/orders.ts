import customAxios from "@/services"

interface OrderItem {
    product_id: number
    count: number
    discount: number
    price: number
}

interface PaymentItem {
    payment_type_id: number
    price: number
}

interface DebtItem {
    price: number
    return_time: string
    reminder: string
    client_id: number
}

interface OrderData {
    id?: string
    store_id: number
    client_id: number
    items: OrderItem[]
    payments: PaymentItem[]
    debts: DebtItem[]
}
interface getParams {
    limit: number,
    page: number
}

export const orderUtils = {
    getOrders: async ({ limit, page }: getParams) => {
        const { data } = await customAxios.get(`orders?page=${page}&limit=${limit}`)
        return data
    },

    getOrderByID: async (id: string) => {
        const { data } = await customAxios.get(`orders/${id}`)
        return data
    },

    postOrder: async (order: OrderData) => {
        const formattedOrder = {
            ...order,
            items: order.items.map(item => ({
                ...item,
                discount: item.discount > 0 ? item.discount : 1, // discount musbat bo‘lsin
            })),
            payments: order.payments.map(p => ({
                ...p,
                payment_type_id: Number(p.payment_type_id), // raqamga aylantiramiz
            })),
            debts: order.debts.map(d => ({
                ...d,
                return_time: d.return_time,
            })),
        }
        console.log(order);

        const { data } = await customAxios.post('orders', formattedOrder)
        return data
    },

    deleteOrder: async (id: string) => {
        const { data } = await customAxios.delete(`orders/${id}`)
        return data
    },
}
