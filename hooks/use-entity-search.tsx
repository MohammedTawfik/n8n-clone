import { useState, useEffect, startTransition, useRef } from "react";
import { PAGINATION } from "@/utils/constants";

interface UseEntitySearchProps<T extends {
    search: string;
    page: number;
    pageSize: number;
}> {
    params: T;
    setParams: (params: T) => void;
    debounceTime?: number;
}

export const useEntitySearch = <T extends {
    search: string;
    page: number;
    pageSize: number;
}>({ params, setParams, debounceTime = 500 }: UseEntitySearchProps<T>) => {
    const [search, setSearch] = useState(params.search);
    const isUserInputRef = useRef(false);
    const prevParamsSearchRef = useRef(params.search);
    const pendingSearchValueRef = useRef<string | null>(null);

    // Debounce user input and update URL params
    useEffect(() => {
        if (search === "" && params.search !== "") {
            setParams({ ...params, search: "", page: PAGINATION.DEFAULT_PAGE });
            return;
        }
        if (isUserInputRef.current) {
            pendingSearchValueRef.current = search;
            const timeout = setTimeout(() => {
                if (pendingSearchValueRef.current === search && search !== params.search) {
                    setParams({ ...params, search, page: PAGINATION.DEFAULT_PAGE });
                }
                // Clear the pending value after params have had time to update
                setTimeout(() => {
                    pendingSearchValueRef.current = null;
                    isUserInputRef.current = false;
                }, 50);
            }, debounceTime);
            return () => clearTimeout(timeout);
        }
    }, [search, params, setParams, debounceTime]);

    // Sync URL params to local state when URL changes externally (not from user input)
    useEffect(() => {
        // Only sync if:
        // 1. URL param actually changed
        // 2. It's different from current local state
        // 3. We don't have a pending update that matches this value (not from our debounced update)
        // 4. User is not currently typing
        const isOurUpdate = pendingSearchValueRef.current === params.search;
        if (
            prevParamsSearchRef.current !== params.search &&
            params.search !== search &&
            !isOurUpdate &&
            !isUserInputRef.current
        ) {
            startTransition(() => {
                setSearch(params.search);
            });
        }
        prevParamsSearchRef.current = params.search;
    }, [params.search, search]);

    const setSearchValue = (value: string) => {
        isUserInputRef.current = true;
        setSearch(value);
    };

    return { searchValue: search, setSearchValue };
};