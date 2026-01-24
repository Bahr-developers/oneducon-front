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
    client_id?: number | null
    items: OrderItem[]
    payments: PaymentItem[]
    debts: DebtItem[]
}
interface getParams {
    limit: number,
    page: number,
    search?: string,
    client?: string,
    payment_type?: string,
    from?: Date | undefined,
    to?: Date | undefined
}
interface GetOrdersParams {
  limit?: number;
  page?: number;
  search?: string;
  client?: string;
  payment_type?: string;
  from?: Date;
  to?: Date;
}

export const orderUtils = {
  getOrders: async ({
    limit,
    page,
    search,
    client,
    payment_type,
    from,
    to,
  }: getParams) => {
    const params = new URLSearchParams();

    params.append("limit", String(limit));
    params.append("page", String(page));

    if (search) params.append("search", search);
    if (client) params.append("client", client);
    if (payment_type) params.append("payment_type", payment_type);
    if (from) params.append("from", from.toISOString());
    if (to) params.append("to", to.toISOString());

    const { data } = await customAxios.get(`orders?${params.toString()}`);
    return data;
  },

  getOrders2: async (params?: GetOrdersParams) => {
    const sp = new URLSearchParams();

    // limit/page faqat berilsa qo‘shiladi
    if (params?.limit != null) sp.append("limit", String(params.limit));
    if (params?.page != null) sp.append("page", String(params.page));

    if (params?.search) sp.append("search", params.search);
    if (params?.client) sp.append("client", params.client);
    if (params?.payment_type) sp.append("payment_type", params.payment_type);
    if (params?.from) sp.append("from", params.from.toISOString());
    if (params?.to) sp.append("to", params.to.toISOString());

    const qs = sp.toString();
    const { data } = await customAxios.get(qs ? `orders?${qs}` : "orders");
    return data;
  },

  getOrderByID: async (id: string) => {
    const { data } = await customAxios.get(`orders/${id}`);
    return data;
  },
  getOrderStats: async () => {
    const { data } = await customAxios.get(`orders/stats`);
    return data;
  },
  postOrder: async (order: OrderData) => {
    const formattedOrder = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        discount: item.discount > 0 ? item.discount : 0, // discount musbat bo‘lsin
      })),
      payments: order.payments.map((p) => ({
        ...p,
        payment_type_id: Number(p.payment_type_id), // raqamga aylantiramiz
      })),
      debts: order.debts.map((d) => ({
        ...d,
        return_time: d.return_time,
      })),
    };
    const { data } = await customAxios.post("orders", formattedOrder);
    return data;
  },

  deleteOrder: async (id: string) => {
    const { data } = await customAxios.delete(`orders/${id}`);
    return data;
  },
};
