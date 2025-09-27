import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { MarketOverviewProps } from '@/types/portfolio'
import { useRouter } from 'next/navigation'

export function MarketOverview({ coins }: MarketOverviewProps) {
  const router = useRouter()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Top cryptocurrencies by market cap</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/markets')}
            >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {coins.slice(0, 4).map((coin) => (
            <div key={coin.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {coin.symbol.toUpperCase()} • Market Cap: {formatNumber(coin.market_cap)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(coin.current_price)}</div>
                <div className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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