import LowProductTable from "./low-product-table";

const LowProducts = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Kam qolgan mahsulotlar</h2>
            </div>
            <LowProductTable />
        </div>
    );
};

export default LowProducts;