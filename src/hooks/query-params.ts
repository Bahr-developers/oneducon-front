import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useQueryParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateURL = useCallback((params: Record<string, string | number>) => {
        const current = new URLSearchParams(searchParams?.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value) current.set(key, value?.toString());
            else current?.delete(key);
        });

        setSearchParams(current, { replace: true });
    }, [searchParams, setSearchParams]);

    const getParam = (key: string, defaultValue: string = '') =>
        searchParams.get(key) || defaultValue;

    return { updateURL, getParam, searchParams };
}
