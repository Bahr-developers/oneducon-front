
import Productstable from "./product-table";
import ProductCreate from "./create-products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productUtils } from "@/utils/products";
import toast from "react-hot-toast";
import { ProductImportButton } from "./product-import";

const Products = () => {
    const queryClient = useQueryClient()
    const importFile = useMutation({
        mutationFn: productUtils.postProductImport,
        onSuccess: () => {
            toast.success('Aefnivjnefivn')
            queryClient.invalidateQueries({ queryKey: ['get_all_procusts'] })
        },
        onError: () => { }
    })


    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Mahsulotlar</h2>

                <ProductCreate />
                <ProductImportButton
                    loading={importFile.isPending}
                    onUpload={(file) => {
                        const formData = new FormData();
                        formData.append("file", file);

                        importFile.mutate(formData);
                    }}
                />
            </div>
            <Productstable />
        </div>
    );
};

export default Products;