import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";

interface NumberInputProps {
    value?: number;
    onChange?: (data: { formatted: string; raw: number }) => void;
    placeholder?: string;
    className?: string;
    readonly?: boolean
}

const NumberInput: React.FC<NumberInputProps> = ({
    value = 0,
    onChange,
    placeholder = "Raqam kiriting",
    className = "",
    readonly = false
}) => {
    const [inputValue, setInputValue] = useState("");

    // tashqi qiymat (prop orqali) o'zgarsa formatlab yangilaydi
    useEffect(() => {
        if (value !== undefined && !isNaN(value)) {
            const formatted = value
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            setInputValue(formatted);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, ""); // faqat raqamlar
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // 1 000, 10 000

        setInputValue(formatted);

        if (onChange) {
            onChange({
                formatted,
                raw: raw === "" ? 0 : Number(raw), // ⚠️ bu joy muhim
            });
        }
    };


    return (
        <Input
            type="text"
            inputMode="numeric"
            defaultValue={inputValue}
            readOnly={readonly}
            onChange={handleChange}
            placeholder={placeholder}
            className={`border rounded-lg px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring transition-all ${className}`}
        />
    );
};

export default NumberInput;
