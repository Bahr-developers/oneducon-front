import { Input } from "@/components/ui/input";
import { product } from "@/types";
import { productUtils } from "@/utils/products";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


interface SearchSelectProps {
    onSelect: (product: product) => void;
    selectedProduct?: product | null;
}

export default function SearchSelect({ onSelect, selectedProduct }: SearchSelectProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    console.log(selectedProduct);

    const { data: products } = useQuery({
        queryKey: ['get_all_procusts'],
        queryFn: productUtils.getProductsAlls
    })




    const filtered = products?.data?.filter((p: product) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (product: product) => {
        onSelect(product);
        setQuery(product.name);
        setIsOpen(false);
    };

    return (
        <div className="relative w-[550px]">
            <Input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                placeholder="Mahsulot nomi..."
                className="w-full border h-12 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {isOpen && query && (
                <ul className="absolute z-10 w-full bg-white border dark:text-black transition-colors rounded-lg mt-1 max-h-40 overflow-y-auto">
                    {filtered?.length > 0 ? (
                        filtered?.map((product: product) => (
                            <li
                                key={product.id}
                                onClick={() => handleSelect(product)}
                                className="px-3 py-2 hover:bg-[#e2e0e0c0] cursor-pointer transition-colors flex justify-between"
                            >
                                <span>{product.name}</span>
                                <span className="text-gray-500 text-sm">
                                    {product.cost_price.toLocaleString()} so‘m
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-500">Hech narsa topilmadi</li>
                    )}
                </ul>
            )}
        </div>
    );
}
