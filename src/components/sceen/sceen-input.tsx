import { useEffect, useRef } from "react";

export function useBarcodeScanner(onScan: (code: string) => void) {
    const buffer = useRef("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // vaqt chegarasi (ms)
    const SCAN_TIMEOUT = 50; // skaner belgilarini aniqlash uchun

    useEffect(() => {
        function handleKeydown(e: KeyboardEvent) {
            // faqat bitta belgili simvollarni olamiz
            if (e.key.length === 1) {
                buffer.current += e.key;

                // agar eski timeout bo‘lsa — to‘xtatamiz
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                // skanner yozishni tugatgan deb o‘ylaydigan vaqt
                timeoutRef.current = setTimeout(() => {
                    // barcode yakunlandi
                    if (buffer.current.length > 0) {
                        onScan(buffer.current);
                    }
                    buffer.current = "";
                }, SCAN_TIMEOUT);
            }
        }

        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [onScan]);
}
