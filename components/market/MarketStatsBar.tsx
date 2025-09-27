"use client"

import { MarketStats } from "@/types/crypto"
import { MarketService } from "@/lib/market-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Bitcoin, Activity, DollarSign, BarChart3 } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface MarketStatsBarProps {
  stats: MarketStats
  loading?: boolean
}

export function MarketStatsBar({ stats, loading = false }: MarketStatsBarProps) {
  const { currency } = useCurrency()
  const formatMarketCap = (value: number) => MarketService.formatMarketCap(value, currency)
  
  const statsData = [
    {
      label: "Cryptocurrencies",
      value: stats.activeCryptocurrencies.toLocaleString(),
      icon: Activity,
    },
    {
      label: "Total Market Cap",
      value: formatMarketCap(stats.totalMarketCap),
      icon: DollarSign,
    },
    {
      label: "24h Vol",
      value: formatMarketCap(stats.totalVolume),
      icon: BarChart3,
    },
    {
      label: "BTC Dominance",
      value: `${stats.btcDominance.toFixed(1)}%`,
      icon: Bitcoin,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((_, index) => (
          <div key={index} className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <Icon className="h-4 w-4 text-[#00DC33]" />
            </div>
            <div className={`text-lg font-semibold color-00DC33 || 'text-foreground'}`}>
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Loading skeleton component
export function MarketStatsBarSkeleton() {
  return <MarketStatsBar stats={{
    totalMarketCap: 0,
    totalVolume: 0,
    marketCapChange24h: 0,
    volumeChange24h: 0,
    btcDominance: 0,
    activeCryptocurrencies: 0
  }} loading={true} />
}