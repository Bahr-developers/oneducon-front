import { useSearchParams } from "react-router-dom";

export function useQueryParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateURL = (params: Record<string, string | number>) => {
        const current = new URLSearchParams(searchParams.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                current.set(key, value.toString());
            } else {
                current.delete(key);
            }
        });

        // URL ni yangilash (sahifa qayta yuklanmasdan)
        setSearchParams(current, { replace: true });
    };

    const getParam = (key: string, defaultValue: string = '') => {
        return searchParams.get(key) || defaultValue;
    };

    return { updateURL, getParam, searchParams };
}