"use client"
import { useEffect, useState } from "react"

export function useHash<T extends string>(defaultHash : T , options : readonly T[]) {
    const [hash, setHash] = useState<T>(defaultHash)

    useEffect(() => {
        const updateHashConst = () => {
            if (!options.includes(window.location.hash.slice(1) as T)) {
                window.location.hash = defaultHash
                return
            }
            setHash(window.location.hash.slice(1) as T)
            if (window.location.hash.slice(1) == "" && defaultHash != "") {
                updateHash(defaultHash)
            }
        }
        updateHashConst()
        window.addEventListener('hashchange', updateHashConst)
        return () => window.removeEventListener('hashchange', updateHashConst)
    }, [])

    const updateHash = (newHash : T) => {
        const currentScrollY = window.scrollY;
        window.location.hash = newHash;
        window.scrollTo(0, currentScrollY);
    }

    return {hash , updateHash}
}