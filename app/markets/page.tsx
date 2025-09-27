"use client"

import { useState, useEffect, useCallback } from "react"
import { Cryptocurrency, MarketStats, FilterOptions } from "@/types/crypto"
import { MarketService } from "@/lib/market-service"
import { CryptoCard, CryptoCardSkeleton } from "@/components/crypto-card"
import { MarketStats, MarketStatsSkeleton } from "@/components/market-stats"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

const DEFAULT_FILTERS: FilterOptions = {
  search: "",
  sortBy: "market_cap",
  sortOrder: "desc",
  page: 1,
  perPage: 50
}

export default function Markets() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([])
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
      setError(null)

      // Fetch global market data
      const globalData = await MarketService.getGlobalMarketData()

      // Fetch cryptocurrencies
      const cryptoResponse = await MarketService.getCryptocurrencies(filterOptions)

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
  }, [filterOptions])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData(false)
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters)
  }

  const getTrendingCryptos = () => {
    const sorted = [...cryptocurrencies].sort(
      (a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)
    )
    return sorted.slice(0, 5)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-muted-foreground">
            Track cryptocurrency markets and prices
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Market Statistics */}
      {loading ? (
        <MarketStatsSkeleton />
      ) : marketStats ? (
        <MarketStats stats={marketStats} />
      ) : null}

      {/* Search and Filter */}
      <SearchFilter
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Trending Section */}
      {!loading && cryptocurrencies.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Cryptocurrencies
              </h3>
              <p className="text-sm text-muted-foreground">
                Biggest movers in the last 24 hours
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {getTrendingCryptos().map((crypto) => (
                <div key={crypto.id} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <img
                      src={crypto.image}
                      alt={crypto.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="ml-2 font-medium text-sm">{crypto.symbol}</span>
                  </div>
                  <div className={`text-sm font-medium ${
                    MarketService.getChangeColor(crypto.price_change_percentage_24h)
                  }`}>
                    {MarketService.formatPercentage(crypto.price_change_percentage_24h)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {MarketService.formatPrice(crypto.current_price)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cryptocurrency Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Cryptocurrencies
          </h3>
          <div className="text-sm text-muted-foreground">
            Showing {cryptocurrencies.length} cryptocurrencies
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <CryptoCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptocurrencies.map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        )}

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
      </div>
    </div>
  )
}