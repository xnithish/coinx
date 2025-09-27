import {
  Cryptocurrency,
  GlobalMarketData,
  MarketStats,
  CryptoListResponse,
  FilterOptions
} from "@/types/crypto"
import { Currency } from "@/contexts/currency-context"

export class MarketService {
  static formatNumber(num: number): string {
    if (num >= 1_000_000_000_000) {
      return `${(num / 1_000_000_000_000).toFixed(2)}T`
    } else if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`
    } else if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`
    } else {
      return num.toFixed(0)
    }
  }
  private static readonly DEFAULT_PER_PAGE = 50
  private static readonly MAX_PER_PAGE = 250

  static async getGlobalMarketData(currency: Currency = "USD"): Promise<GlobalMarketData> {
    try {
      const response = await fetch(`/api/market/global?currency=${currency.toLowerCase()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch global market data: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching global market data:", error)
      throw error
    }
  }

  static async getCryptocurrencies(
    options: Partial<FilterOptions> = {},
    currency: Currency = "USD"
  ): Promise<CryptoListResponse> {
    const {
      page = 1,
      perPage = this.DEFAULT_PER_PAGE,
      sortBy = "market_cap",
      sortOrder = "desc",
      search = ""
    } = options

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: Math.min(perPage, this.MAX_PER_PAGE).toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
        currency,
      })

      if (search) {
        params.append("search", search)
      }

      const response = await fetch(`/api/market/cryptocurrencies?${params.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch cryptocurrencies: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error)
      throw error
    }
  }

  static async searchCryptocurrencies(query: string, currency: Currency = "USD"): Promise<Cryptocurrency[]> {
    try {
      const response = await this.getCryptocurrencies({
        search: query,
        perPage: 20,
      }, currency)

      return response.cryptocurrencies
    } catch (error) {
      console.error("Error searching cryptocurrencies:", error)
      return []
    }
  }

  static async getTopCryptocurrencies(limit: number = 10, currency: Currency = "USD"): Promise<Cryptocurrency[]> {
    try {
      const response = await this.getCryptocurrencies({
        perPage: limit,
        sortBy: "market_cap",
        sortOrder: "desc",
      }, currency)

      return response.cryptocurrencies
    } catch (error) {
      console.error("Error fetching top cryptocurrencies:", error)
      return []
    }
  }

  static getCurrencySymbol(currency: Currency): string {
    switch (currency) {
      case "EUR":
        return "€"
      case "INR":
        return "₹"
      case "USD":
      default:
        return "$"
    }
  }

  static formatPrice(price: number, currency: Currency = "USD"): string {
    const symbol = this.getCurrencySymbol(currency)

    if (price >= 1_000_000_000) {
      return `${symbol}${(price / 1_000_000_000).toFixed(2)}B`
    } else if (price >= 1_000_000) {
      return `${symbol}${(price / 1_000_000).toFixed(2)}M`
    } else if (price >= 1_000) {
      return `${symbol}${(price / 1_000).toFixed(2)}K`
    } else if (price >= 1) {
      return `${symbol}${price.toFixed(2)}`
    } else {
      return `${symbol}${price.toFixed(6)}`
    }
  }

  static formatMarketCap(marketCap: number, currency: Currency = "USD"): string {
    const symbol = this.getCurrencySymbol(currency)

    if (marketCap >= 1_000_000_000_000) {
      return `${symbol}${(marketCap / 1_000_000_000_000).toFixed(2)}T`
    } else if (marketCap >= 1_000_000_000) {
      return `${symbol}${(marketCap / 1_000_000_000).toFixed(2)}B`
    } else if (marketCap >= 1_000_000) {
      return `${symbol}${(marketCap / 1_000_000).toFixed(2)}M`
    } else {
      return `${symbol}${marketCap.toFixed(0)}`
    }
  }

  static formatPercentage(change: number): string {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  static getChangeColor(change: number): string {
    if (change > 0) {
      return "text-green-600 dark:text-green-400"
    } else if (change < 0) {
      return "text-red-600 dark:text-red-400"
    }
    return "text-gray-600 dark:text-gray-400"
  }

  static getChangeBgColor(change: number): string {
    if (change > 0) {
      return "bg-green-100 dark:bg-green-900/20"
    } else if (change < 0) {
      return "bg-red-100 dark:bg-red-900/20"
    }
    return "bg-gray-100 dark:bg-gray-800"
  }

  static calculateMarketStats(
    cryptocurrencies: Cryptocurrency[],
    globalData: GlobalMarketData
  ): MarketStats {
    const btc = cryptocurrencies.find(crypto => crypto.symbol.toLowerCase() === "btc")
    const btcDominance = globalData.btc_dominance || 0

    const totalMarketCap = globalData.total_market_cap
    const totalVolume = globalData.total_volume_24h

    return {
      totalMarketCap,
      totalVolume,
      marketCapChange24h: 0, // Would need historical data
      volumeChange24h: 0,   // Would need historical data
      btcDominance,
      activeCryptocurrencies: globalData.active_cryptocurrencies
    }
  }
}