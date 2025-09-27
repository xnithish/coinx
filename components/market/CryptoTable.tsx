"use client"

import Image from "next/image"
import { Cryptocurrency } from "@/types/crypto"
import { MarketService } from "@/lib/market-service"
import { Skeleton } from "@/components/ui/skeleton"

interface CryptoTableProps {
  cryptocurrencies: Cryptocurrency[]
  loading?: boolean
}

const COLUMNS = [
  { key: 'rank', label: '#', width: 'w-12' },
  { key: 'name', label: 'Name', width: 'w-32' },
  { key: 'price', label: 'Price', width: 'w-24' },
  { key: 'change24h', label: '24h %', width: 'w-20' },
  { key: 'marketCap', label: 'Market Cap', width: 'w-28' },
  { key: 'volume', label: 'Volume', width: 'w-28' },
  { key: 'supply', label: 'Circulating Supply', width: 'w-36' }
]

export function CryptoTable({ cryptocurrencies, loading = false }: CryptoTableProps) {
  const formatPrice = MarketService.formatPrice
  const formatMarketCap = MarketService.formatMarketCap
  const formatPercentage = MarketService.formatPercentage
  const getChangeColor = MarketService.getChangeColor

  
  const renderRow = (crypto: Cryptocurrency) => {
    const priceChangeColor = getChangeColor(crypto.price_change_percentage_24h)

    return (
      <tr
        key={crypto.id}
        className="border-b hover:bg-muted/50 transition-colors"
      >
        <td className="py-3 text-center text-muted-foreground">
          {crypto.market_cap_rank}
        </td>
        <td className="py-3">
          <div className="flex items-center space-x-3">
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src={crypto.image}
                alt={crypto.name}
                fill
                className="rounded-full"
                sizes="24px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>
            <div>
              <div className="font-medium text-foreground">{crypto.name}</div>
              <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
            </div>
          </div>
        </td>
        <td className="py-3 text-foreground">
          {formatPrice(crypto.current_price)}
        </td>
        <td className="py-3">
          <span className={`text-sm font-medium ${priceChangeColor}`}>
            {formatPercentage(crypto.price_change_percentage_24h)}
          </span>
        </td>
        <td className="py-3 text-foreground">
          {formatMarketCap(crypto.market_cap)}
        </td>
        <td className="py-3 text-foreground">
          {formatMarketCap(crypto.total_volume)}
        </td>
        <td className="py-3 text-muted-foreground">
          {MarketService.formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
        </td>
      </tr>
    )
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {COLUMNS.map((column, index) => (
              <th
                key={index}
                className={`py-3 px-4 text-left text-xs font-medium text-muted-foreground ${column.width}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 20 }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="border-b">
                {COLUMNS.map((column, colIndex) => (
                  <td key={colIndex} className={`py-3 ${column.width}`}>
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            cryptocurrencies.map(renderRow)
          )}
        </tbody>
      </table>

      {!loading && cryptocurrencies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No cryptocurrencies found
        </div>
      )}
    </div>
  )
}

// Loading skeleton component
export function CryptoTableSkeleton() {
  return <CryptoTable cryptocurrencies={[]} loading={true} />
}