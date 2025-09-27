"use client"

import { MarketStats } from "@/types/crypto"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarketService } from "@/lib/market-service"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Activity, BarChart3 } from "lucide-react"

interface MarketStatsProps {
  stats: MarketStats
  loading?: boolean
}

export function MarketStats({ stats, loading = false }: MarketStatsProps) {
  const formatMarketCap = MarketService.formatMarketCap
  const formatPercentage = MarketService.formatPercentage
  const getChangeColor = MarketService.getChangeColor

  const statCards = [
    {
      title: "Total Market Cap",
      value: formatMarketCap(stats.totalMarketCap),
      change: stats.marketCapChange24h,
      icon: DollarSign,
      description: "Total cryptocurrency market capitalization"
    },
    {
      title: "24h Volume",
      value: formatMarketCap(stats.totalVolume),
      change: stats.volumeChange24h,
      icon: BarChart3,
      description: "Total trading volume in 24 hours"
    },
    {
      title: "Bitcoin Dominance",
      value: `${stats.btcDominance.toFixed(2)}%`,
      change: 0, // Would need historical data
      icon: Bitcoin,
      description: "Bitcoin's share of total market cap"
    },
    {
      title: "Active Cryptocurrencies",
      value: stats.activeCryptocurrencies.toLocaleString(),
      change: 0,
      icon: Activity,
      description: "Number of tracked cryptocurrencies"
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const changeColor = getChangeColor(stat.change)

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change !== 0 && (
                <p className={`text-xs ${changeColor} flex items-center space-x-1`}>
                  {stat.change > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{formatPercentage(stat.change)}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Loading skeleton component
export function MarketStatsSkeleton() {
  return <MarketStats stats={{
    totalMarketCap: 0,
    totalVolume: 0,
    marketCapChange24h: 0,
    volumeChange24h: 0,
    btcDominance: 0,
    activeCryptocurrencies: 0
  }} loading={true} />
}