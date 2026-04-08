import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark"
const THEME_STORAGE_KEY = "hagisoul-theme"

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark"
}

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light"
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (isThemeMode(storedTheme)) {
    return storedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme())

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return {
    theme,
    toggleTheme: () => {
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
    },
  }
}
