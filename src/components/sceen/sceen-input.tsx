import { useEffect, useRef } from "react";

export function useBarcodeScanner(onScan: (code: string) => void) {
    const buffer = useRef("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const SCAN_TIMEOUT = 50; 

    useEffect(() => {
        function handleKeydown(e: KeyboardEvent) {
            if (e.key.length === 1) {
                buffer.current += e.key;

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
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
