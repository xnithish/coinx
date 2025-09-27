"use client"

import Image from "next/image"
import { Cryptocurrency } from "@/types/crypto"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MarketService } from "@/lib/market-service"
import { Skeleton } from "@/components/ui/skeleton"

interface CryptoCardProps {
  crypto: Cryptocurrency
  loading?: boolean
}

export function CryptoCard({ crypto, loading = false }: CryptoCardProps) {
  const formatPrice = MarketService.formatPrice
  const formatMarketCap = MarketService.formatMarketCap
  const formatPercentage = MarketService.formatPercentage
  const getChangeColor = MarketService.getChangeColor
  const getChangeBgColor = MarketService.getChangeBgColor

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const priceChangeColor = getChangeColor(crypto.price_change_percentage_24h)
  const priceChangeBgColor = getChangeBgColor(crypto.price_change_percentage_24h)

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Badge variant="outline">
          #{crypto.market_cap_rank}
        </Badge>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-muted-foreground">
            24h:
          </span>
          <span className={`text-sm font-medium ${priceChangeColor} ${priceChangeBgColor} px-2 py-1 rounded`}>
            {formatPercentage(crypto.price_change_percentage_24h)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <Image
                src={crypto.image}
                alt={crypto.name}
                fill
                className="rounded-full"
                sizes="32px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{crypto.name}</CardTitle>
              <p className="text-sm text-muted-foreground uppercase">
                {crypto.symbol}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatPrice(crypto.current_price)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Market Cap</p>
                <p className="font-medium">{formatMarketCap(crypto.market_cap)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume (24h)</p>
                <p className="font-medium">{formatMarketCap(crypto.total_volume)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">24h High</p>
                <p className="font-medium">{formatPrice(crypto.high_24h)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">24h Low</p>
                <p className="font-medium">{formatPrice(crypto.low_24h)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full flex justify-between">
          <span>Supply: {formatMarketCap(crypto.circulating_supply)}</span>
          {crypto.max_supply && (
            <span>Max: {formatMarketCap(crypto.max_supply)}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Loading skeleton component
export function CryptoCardSkeleton() {
  return <CryptoCard crypto={{} as Cryptocurrency} loading={true} />
}