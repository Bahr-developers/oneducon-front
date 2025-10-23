import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import SearchSelect from "./search-select";
import NumberInput from "@/components/_components/number-input";
import { useAppDispatch } from "@/store/hooks";
import { updateOrderItem, removeOrderItem, setProductToItem } from "@/store/order-slice";
import { product } from "@/types";

interface OrderItemProps {
    item: {
        id: string;
        product: product | null;
        count: number;
        discount: number;
        price: number;
    };
}

const OrderItem = ({ item }: OrderItemProps) => {
    const dispatch = useAppDispatch();

    const handleSelectProduct = (product: product) => {
        dispatch(setProductToItem({ id: item.id, product }));
    };

    const handleCountChange = (value: string) => {
        let num = Number(value);
        if (isNaN(num) || num < 1) num = 1;

        if (item.product?.quantity && num > item.product.quantity) {
            num = item.product.quantity;
        }

        dispatch(updateOrderItem({
            id: item.id,
            updates: { count: num },
        }));
    };

    const handleDiscountChange = (val: { raw: number }) => {
        dispatch(updateOrderItem({
            id: item.id,
            updates: { discount: val.raw },
        }));
    };

    const handleRemove = () => {
        dispatch(removeOrderItem(item.id));
    };

    const totalPrice = item.product
        ? (item.price - item.discount) * item.count
        : 0;

    return (
        <div className="w-full border rounded-lg p-3 flex flex-wrap gap-3 bg-[#f0f0f0] dark:bg-[#2d2d2d] items-center pb-10">
            <div className="w-full flex justify-end py-2 border-b">
                <Button className="cursor-pointer" variant="destructive" onClick={handleRemove}>
                    <Trash2 />
                </Button>
            </div>

            <label>
                <span className="my-1 block">Mahsulot *</span>
                <SearchSelect onSelect={handleSelectProduct} selectedProduct={item.product} />
            </label>

            <label className="w-52">
                <span className="my-1 block">Sotuv narxi</span>
                <NumberInput
                    className="w-full h-12"
                    placeholder="0"
                    value={item.product?.sale_price || 0}
                    readonly={true}
                />
            </label>

            <label className="w-52 relative">
                <span className="my-1 block">Miqdori *</span>
                <Input
                    className="w-full h-12"
                    type="number"
                    placeholder="0"
                    value={item.count}
                    min={1}
                    max={item.product?.quantity || undefined}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleCountChange(e.target.value)}
                />
                {item.product && (
                    <span className="absolute -bottom-6 left-0 text-sm">
                        Mavjud: {item.product.quantity}
                    </span>
                )}
            </label>

            <label className="w-52">
                <span className="my-1 block">Chegirma UZS</span>
                <NumberInput
                    value={item.discount}
                    onChange={handleDiscountChange}
                    placeholder="0"
                    className="w-full h-12"
                />
            </label>

            <label className="w-56">
                <span className="my-1 block">Umumiy narxi</span>
                <NumberInput
                    className="w-full h-12"
                    placeholder="0"
                    readonly={true}
                    value={totalPrice}
                />
            </label>
        </div>
    );
};

export default OrderItem;