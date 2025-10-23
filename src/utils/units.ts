import customAxios from "@/services"

interface unitData {
    id?: string
    name: string
    store_id?: number
}

export const unitUtils = {
    getUnit: async () => {
        const { data } = await customAxios.get('units')
        return data
    },
    getUnitByID: async (id: string) => {
        const { data } = await customAxios.get(`units/${id}`)
        return data
    },
    postUnit: async ({ name, store_id }: unitData) => {
        const { data } = await customAxios.post('units', {
            name,
            store_id
        })
        return data
    },
    patchUnit: async ({ id, name }: unitData) => {
        const { data } = await customAxios.patch(`units/${id}`, {
            name,
        })
        return data
    },
    deleteUnit: async (id: string) => {
        const { data } = await customAxios.delete(`units/${id}`)
        return data
    },
}
