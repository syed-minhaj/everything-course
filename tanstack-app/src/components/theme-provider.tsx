import { createContext, useContext, useEffect, useState, PropsWithChildren,} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (t: Theme) => void;
} | null>(null);

const KEY = "_preferred-theme";

export function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const stored = localStorage.getItem(KEY) as Theme | null;
        if (stored) setTheme(stored);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");

        localStorage.setItem(KEY, theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}