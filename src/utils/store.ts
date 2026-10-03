import { StatisticsResponse } from "@/@types/dash-stats";
import customAxios from "@/services";

interface storeData {
  id?: string;
  name: string;
  email: string;
  password: string;
  user_id: number;
  usd_rate?: number;
  link?: string;
  is_active?:boolean
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
    link, is_active,
  }: storeData) => {
    const { data } = await customAxios.patch(`stores/${id}`, {
      name,
      email,
      password,
      user_id,
      usd_rate,
      link,
      is_active,
    });
    return data;
  },
  toggleStoreStatus: async ({
                              id,
                              is_active,
                            }: {
    id: string
    is_active: boolean
  }) => {
    const { data } = await customAxios.patch(`stores/${id}`, {
      is_active,
    })

    return data
  },
  deleteStore: async (id: string) => {
    const { data } = await customAxios.delete(`stores/${id}`);
    return data;
  },
};
