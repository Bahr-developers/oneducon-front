import { useQuery } from "@tanstack/react-query";
import ChartsMain from "./charts";
import Statistics from "./statistics";
import { storeUtils } from "@/utils/store";
import { useEffect, useState } from "react";
import { USDRateDialog } from "@/components/_components/usd-rate-worning";
import Loader from "@/components/_components/loader";

const DashboardMain = () => {
    const storeId = localStorage.getItem('storeId') || '1'
    const { data: store, isLoading } = useQuery({
        queryKey: ['get_store'],
        queryFn: () => storeUtils.getStoreByID(storeId)
    })
    const [productData, setProductData] = useState(store?.data);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    useEffect(() => {
        if (store?.data) {
            setProductData(store.data);
        }
    }, [store?.data]);

    useEffect(() => {
        if (store?.data && !store.data.usd_rate) {
            const timer = setTimeout(() => {
                setIsDialogOpen(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [store?.data]);

    if (isLoading) {
        return <Loader />;
    }


    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Asosiy Panel</h2>
            </div>
            <Statistics />
            <ChartsMain />
            <USDRateDialog
                data={productData || {}}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
};

export default DashboardMain;