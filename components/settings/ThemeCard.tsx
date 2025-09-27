import { useTheme } from "@/contexts/theme-context"
import { SettingsCard } from "./SettingsCard"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"
import type { Theme } from "@/contexts/theme-context"

const themes: { key: Theme; label: string; icon: React.ComponentType<any> }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
]

export function ThemeCard() {
  const { theme, setTheme } = useTheme()

  return (
    <SettingsCard
      title="Theme"
      description="Choose your preferred theme appearance"
    >
      <div className="grid grid-cols-3 gap-2">
        {themes.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={theme === key ? "default" : "outline"}
            className="flex flex-col gap-2 h-auto py-4"
            onClick={() => setTheme(key)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </SettingsCard>
  )
}