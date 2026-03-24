import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark"

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme())

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.dataset.theme = theme
  }, [theme])

  return {
    theme,
    toggleTheme: () => {
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
    },
  }
}
