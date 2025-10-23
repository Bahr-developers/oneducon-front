
import Productstable from "./product-table";
import ProductCreate from "./create-products";

const Products = () => {

    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Mahsulotlar</h2>

                <ProductCreate />
            </div>
            <Productstable />
        </div>
    );
};

export default Products;