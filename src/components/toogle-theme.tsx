import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ToogleTheme() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-12 w-12 rounded-md md:rounded-full border-2 border-primary/10 bg-card shadow-sm transition-all active:scale-95"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 fill-yellow-400 text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-6 w-6 fill-stone-600 text-stone-600 transition-all" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
