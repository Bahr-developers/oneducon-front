import customAxios from "@/services";

interface storeData {
  id?: string;
  name: string;
  email: string;
  password: string;
  user_id: number;
  usd_rate?: number;
  link?: string;
}

export interface StatisticsResponse {
  totalOrders: number;
  totalPayments: number;
  totalDebts: number;
  totalCashBalance: number,
  cashOnHand: number,
  totalCostPrices: number,
  totalCostPricesUsd: number,
  totalSalePrices: number,
  totalSalePricesUsd: number
}

export const storeUtils = {
  getStore: async () => {
    const { data } = await customAxios.get("stores");
    return data;
  },
  getStats: async (): Promise<StatisticsResponse> => {
    const { data } = await customAxios.get("stores/stats");
    return data;
  },
  getStoreByID: async (id: string) => {
    const { data } = await customAxios.get(`stores/${id}`);
    return data;
  },
  postStore: async ({ name, email, password, user_id }: storeData) => {
    const { data } = await customAxios.post("stores", {
      name,
      email,
      password,
      user_id,
    });
    return data;
  },
  patchStore: async ({
    id,
    name,
    email,
    password,
    user_id,
    usd_rate,
    link,
  }: storeData) => {
    const { data } = await customAxios.patch(`stores/${id}`, {
      name,
      email,
      password,
      user_id,
      usd_rate,
      link,
    });
    return data;
  },
  deleteStore: async (id: string) => {
    const { data } = await customAxios.delete(`stores/${id}`);
    return data;
  },
};
