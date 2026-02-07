import customAxios from "@/services"
interface getParams {
    limit?: number,
    page?: number,
    search?: string;
    category?: string
}
interface postData{
  name: string 
  quantity: number| null,
}
export const  reminderUtils ={
    getReminder: async ({limit, page}:getParams) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        const {data} = await customAxios.get(`reminder-products?${params.toString()}`)
        return data
    },
     getReminderById: async (id: {id:string}) => {
        const {data} = await customAxios.get(`reminder-products/${id.id}`)
        return data
    },
     getProductExport: async () => {
        const { data } = await customAxios.get(`reminder-products/export`, {
            responseType: "blob"
        });
        return data
    },
    postReminder: async (reqData:postData) => {
        const {data} = await customAxios.post('reminder-products', reqData)
        return data
    },
    editReminder: async ({reqData,id}:{reqData:postData, id:string}) => {
        const {data} = await customAxios.patch(`reminder-products/${id}`, reqData)
        return data
    },
    deleteReminderProduct: async (id: string) => {
        const { data } = await customAxios.delete(`reminder-products/${id}`)
        return data
    },
}