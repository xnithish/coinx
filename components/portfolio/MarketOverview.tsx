import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { MarketOverviewProps } from '@/types/portfolio'
import { useRouter } from 'next/navigation'
import { useCurrency } from '@/contexts/currency-context'
import { MarketService } from '@/lib/market-service'

export function MarketOverview({ coins }: MarketOverviewProps) {
  const router = useRouter()
  const { currency } = useCurrency()

  const formatCurrency = (value: number) => {
    const symbol = MarketService.getCurrencySymbol(currency)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace(currency, symbol)
  }

  const formatNumber = (value: number) => {
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K'
    return value.toFixed(2)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">Market Overview</CardTitle>
            <CardDescription className="text-sm">Top cryptocurrencies by market cap</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/markets')}
            className="w-full sm:w-auto"
            >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {coins.slice(0, 4).map((coin) => (
            <div key={coin.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <img src={coin.image} alt={coin.name} className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm sm:text-base truncate">{coin.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {coin.symbol.toUpperCase()} • Market Cap: {formatNumber(coin.market_cap)}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="font-medium text-sm sm:text-base">{formatCurrency(coin.current_price)}</div>
                <div className={`text-xs sm:text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}