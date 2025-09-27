import { useCurrency } from "@/contexts/currency-context"
import { SettingsCard } from "./SettingsCard"
import { Button } from "@/components/ui/button"

const currencies = [
  { key: "USD", label: "US Dollar", symbol: "$" },
  { key: "EUR", label: "Euro", symbol: "€" },
  { key: "INR", label: "Indian Rupee", symbol: "₹" },
]

export function CurrencyCard() {
  const { currency, setCurrency } = useCurrency()

  return (
    <SettingsCard
      title="Currency"
      description="Choose your preferred currency for displaying prices"
    >
      <div className="grid grid-cols-3 gap-2">
        {currencies.map(({ key, label, symbol }) => (
          <Button
            key={key}
            variant={currency === key ? "default" : "outline"}
            className="flex flex-col gap-2 h-auto py-4"
            onClick={() => setCurrency(key as "USD" | "EUR" | "INR")}
          >
            <span className="text-lg font-medium">{symbol}</span>
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </SettingsCard>
  )
}