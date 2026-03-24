import { HomePage } from "@/pages/HomePage"
import { useThemeMode } from "@/hooks/use-theme-mode"

export default function App() {
  const { theme, toggleTheme } = useThemeMode()

  return <HomePage theme={theme} onToggleTheme={toggleTheme} />
}
