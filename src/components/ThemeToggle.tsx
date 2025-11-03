import { useState, useEffect } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Theme = "light" | "dark" | "system"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    // Apply theme when component mounts
    const applySavedTheme = () => {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setTheme(savedTheme)
        applyTheme(savedTheme)
      } else {
        // Default to system theme
        setTheme("system")
        applyTheme("system")
      }
    }
    
    applySavedTheme()
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      if (!savedTheme || savedTheme === "system") {
        applyTheme("system")
      }
    }
    
    mediaQuery.addEventListener("change", handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    
    // Remove existing theme classes
    root.classList.remove("light", "dark")
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  const handleThemeChange = (value: string) => {
    const newTheme = value as Theme
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case "light":
        return <Sun className="w-4 h-4" />
      case "dark":
        return <Moon className="w-4 h-4" />
      case "system":
        return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <Select value={theme} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-28 h-8">
        <SelectValue>
          <div className="flex items-center gap-1.5">
            {getThemeIcon(theme)}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun className="w-4 h-4" />
        </SelectItem>
        <SelectItem value="dark">
          <Moon className="w-4 h-4" />
        </SelectItem>
        <SelectItem value="system">
          <Monitor className="w-4 h-4" />
        </SelectItem>
      </SelectContent>
    </Select>
  )
}