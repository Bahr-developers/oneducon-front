"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    onUpload: (file: File) => void;
    loading?: boolean;
}

export function ProductImportButton({ onUpload, loading }: Props) {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Faqat Excel fayl yuklash mumkin (.xlsx yoki .xls)");
            e.target.value = "";
            return;
        }

        onUpload(file);
    };

    return (
        <>
            <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
            />

            <Button
                variant="default"
                disabled={loading}
                onClick={() => fileRef.current?.click()}
                className="h-10 bg-green-500 hover:bg-green-700 cursor-pointer"
            >
                {loading ? "Yuklanmoqda..." : "Excel Import"}
            </Button>
        </>
    );
}
