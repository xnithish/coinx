"use client"

import Image from "next/image"
import { Cryptocurrency } from "@/types/crypto"
import { MarketService } from "@/lib/market-service"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface CryptoTableProps {
  cryptocurrencies: Cryptocurrency[]
  loading?: boolean
  currentSort?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string) => void
}

const COLUMNS = [
  { key: 'market_cap_rank', label: '#', width: 'w-12 sm:w-16' },
  { key: 'name', label: 'Name', width: 'w-32 sm:w-40' },
  { key: 'current_price', label: 'Price', width: 'w-24 sm:w-28' },
  { key: 'price_change_percentage_24h', label: '24h %', width: 'w-20 sm:w-24' },
  { key: 'market_cap', label: 'Market Cap', width: 'w-28 sm:w-32' },
  { key: 'total_volume', label: 'Volume', width: 'w-28 sm:w-32' },
  { key: 'circulating_supply', label: 'Circulating Supply', width: 'w-36 sm:w-40' }
]

export function CryptoTable({
  cryptocurrencies,
  loading = false,
  currentSort,
  sortOrder = 'desc',
  onSort
}: CryptoTableProps) {
  const { currency } = useCurrency()

  const formatPrice = (price: number) => MarketService.formatPrice(price, currency)
  const formatMarketCap = (marketCap: number) => MarketService.formatMarketCap(marketCap, currency)
  const formatPercentage = MarketService.formatPercentage
  const getChangeColor = MarketService.getChangeColor

  const handleSort = (column: string) => {
    if (onSort) {
      onSort(column)
    }
  }

  const getSortIcon = (column: string) => {
    if (currentSort !== column) {
      return null
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  const isColumnSorted = (column: string) => {
    return currentSort === column
  }

  const sortCryptocurrencies = (cryptos: Cryptocurrency[]) => {
    if (!currentSort) return cryptos

    return [...cryptos].sort((a, b) => {
      let aValue = a[currentSort as keyof Cryptocurrency]
      let bValue = b[currentSort as keyof Cryptocurrency]

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return 1
      if (bValue === undefined) return -1

      // Convert to numbers for numeric fields
      const numericFields = ['market_cap_rank', 'current_price', 'price_change_percentage_24h', 'market_cap', 'total_volume', 'circulating_supply']
      if (numericFields.includes(currentSort)) {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      // Handle numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      return 0
    })
  }

  const sortedCryptocurrencies = sortCryptocurrencies(cryptocurrencies)


  const renderRow = (crypto: Cryptocurrency) => {
    const priceChangeColor = getChangeColor(crypto.price_change_percentage_24h)

    return (
      <tr
        key={crypto.id}
        className="border-b hover:bg-muted/50 transition-colors"
      >
        <td className="py-2 sm:py-3 text-center text-muted-foreground text-xs sm:text-sm">
          {crypto.market_cap_rank}
        </td>
        <td className="py-2 sm:py-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
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
            <div className="min-w-0">
              <div className="font-medium text-foreground text-sm sm:text-base truncate">{crypto.name}</div>
              <div className="text-xs text-muted-foreground uppercase truncate">{crypto.symbol}</div>
            </div>
          </div>
        </td>
        <td className="py-2 sm:py-3 text-foreground text-xs sm:text-sm font-medium">
          {formatPrice(crypto.current_price)}
        </td>
        <td className="py-2 sm:py-3">
          <span className={`text-xs sm:text-sm font-medium ${priceChangeColor}`}>
            {formatPercentage(crypto.price_change_percentage_24h)}
          </span>
        </td>
        <td className="py-2 sm:py-3 text-foreground text-xs sm:text-sm">
          {formatMarketCap(crypto.market_cap)}
        </td>
        <td className="py-2 sm:py-3 text-foreground text-xs sm:text-sm">
          {formatMarketCap(crypto.total_volume)}
        </td>
        <td className="py-2 sm:py-3 text-muted-foreground text-xs sm:text-sm">
          {MarketService.formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
        </td>
      </tr>
    )
  }

  return (
    <div className="bg-card rounded-lg border">
      {/* Mobile scroll indicator */}
      <div className="sm:hidden px-4 py-2 bg-muted border-b">
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <span>← Scroll horizontally →</span>
        </div>
      </div>

      {/* Scrollable container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] sm:min-w-0">
          <thead>
            <tr className="border-b bg-muted/30">
              {COLUMNS.map((column, index) => (
                <th
                  key={index}
                  className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium ${column.width} sticky top-0 bg-muted/30 z-10`}
                >
                  <button
                    onClick={() => handleSort(column.key)}
                    className={`flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap ${
                      isColumnSorted(column.key) ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {column.label}
                    {getSortIcon(column.key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 20 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b hover:bg-muted/30">
                  {COLUMNS.map((column, colIndex) => (
                    <td key={colIndex} className={`py-2 sm:py-3 ${column.width}`}>
                      <Skeleton className="h-3 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              sortedCryptocurrencies.map(renderRow)
            )}
          </tbody>
        </table>
      </div>

      {!loading && sortedCryptocurrencies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No cryptocurrencies found
        </div>
      )}

      {/* Mobile footer with stats */}
      {!loading && sortedCryptocurrencies.length > 0 && (
        <div className="sm:hidden px-4 py-2 bg-muted/30 border-t">
          <div className="text-xs text-muted-foreground">
            Showing {sortedCryptocurrencies.length} cryptocurrencies
          </div>
        </div>
      )}
    </div>
  )
}

// Loading skeleton component
export function CryptoTableSkeleton() {
  return <CryptoTable cryptocurrencies={[]} loading={true} />
}