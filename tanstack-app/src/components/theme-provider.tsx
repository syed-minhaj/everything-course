import { useRouter } from "@tanstack/react-router";
import { createContext, type PropsWithChildren, use, useState } from "react";
import { setThemeServerFn, type T as Theme } from "@/lib/theme";

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);

export function ThemeProvider({ children, theme:Itheme }: Props) {
  const router = useRouter();
  const [theme, setThemeS] = useState(Itheme);

  function setTheme(val: Theme) {
    setThemeS(val)
    setThemeServerFn({ data: val }).then(() => router.invalidate());
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  const val = use(ThemeContext);
  if (!val) throw new Error("useTheme called outside of ThemeProvider!");
  return val;
}
