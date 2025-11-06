import React, { useState, useEffect, forwardRef } from "react";
import { Input } from "../ui/input";

interface NumberInputProps {
    value?: number;
    onChange?: (data: { formatted: string; raw: number }) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    readonly?: boolean;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ value, onChange, placeholder = "Raqam kiriting", className = "", readonly = false, onKeyDown, onFocus }, ref) => {
        const [inputValue, setInputValue] = useState("");

        useEffect(() => {
            if (value !== undefined && value !== 0 && !isNaN(value)) {
                const formatted = value
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                setInputValue(formatted);
            } else {
                setInputValue("");
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/\D/g, "");
            const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

            setInputValue(formatted);

            if (onChange) {
                onChange({
                    formatted,
                    raw: raw === "" ? 0 : Number(raw),
                });
            }
        };

        return (
            <Input
                ref={ref}
                type="text"
                inputMode="numeric"
                value={inputValue}
                readOnly={readonly}
                onChange={handleChange}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                placeholder={placeholder}
                autoComplete="off"
                className={`border rounded-lg px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring transition-all ${className}`}
            />
        );
    }
);

NumberInput.displayName = "NumberInput";
export default NumberInput;