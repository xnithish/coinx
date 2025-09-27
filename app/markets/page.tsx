"use client"

import { useState, useEffect, useCallback } from "react"
import { Cryptocurrency, MarketStats, FilterOptions } from "@/types/crypto"
import { MarketService } from "@/lib/market-service"
import { CryptoTable, CryptoTableSkeleton } from "@/components/market/CryptoTable"
import { MarketStatsBar, MarketStatsBarSkeleton } from "@/components/market/MarketStatsBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, BarChart3, ExternalLink } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

const DEFAULT_FILTERS: FilterOptions = {
  search: "",
  sortBy: "market_cap",
  sortOrder: "desc",
  page: 1,
  perPage: 20
}

export default function Markets() {
  const { currency } = useCurrency()
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([])
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS)
  const [currentSort, setCurrentSort] = useState<string>('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
      setError(null)

      // Fetch global market data with currency parameter
      const globalData = await MarketService.getGlobalMarketData(currency)

      // Fetch cryptocurrencies with currency parameter
      const cryptoResponse = await MarketService.getCryptocurrencies(filterOptions, currency)

      // Calculate market stats
      const stats = MarketService.calculateMarketStats(
        cryptoResponse.cryptocurrencies,
        globalData
      )

      setCryptocurrencies(cryptoResponse.cryptocurrencies)
      setMarketStats(stats)
    } catch (err) {
      console.error("Error fetching market data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch market data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filterOptions, currency])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData(false)
  }

  const handleSort = (column: string) => {
    if (currentSort === column) {
      // Toggle sort order if same column
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to descending
      setCurrentSort(column)
      setSortOrder('desc')
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
            <p className="text-muted-foreground">
              Track cryptocurrency markets and prices
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">
                Failed to load market data
              </div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} disabled={refreshing}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track cryptocurrency markets and prices
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} className="w-full sm:w-auto">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Market Statistics */}
      {loading ? (
        <MarketStatsBarSkeleton />
      ) : marketStats ? (
        <MarketStatsBar stats={marketStats} />
      ) : null}

      {/* Cryptocurrency Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Cryptocurrencies
          </h3>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Sort by: {currentSort.replace(/_/g, ' ')} ({sortOrder})
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          {loading ? (
            <CryptoTableSkeleton />
          ) : (
            <CryptoTable
              cryptocurrencies={cryptocurrencies}
              currentSort={currentSort}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}
        </div>

        {!loading && cryptocurrencies.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-2">
                  No cryptocurrencies found
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={() => setFilterOptions(DEFAULT_FILTERS)}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View More Button */}
        {!loading && cryptocurrencies.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => window.open("https://www.coingecko.com/", "_blank")}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" />
              View More on CoinGecko
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}