import {
  Cryptocurrency,
  GlobalMarketData,
  MarketStats,
  CryptoListResponse,
  FilterOptions
} from "@/types/crypto"

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

  static async getGlobalMarketData(): Promise<GlobalMarketData> {
    try {
      const response = await fetch("/api/market/global", {
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
    options: Partial<FilterOptions> = {}
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

  static async searchCryptocurrencies(query: string): Promise<Cryptocurrency[]> {
    try {
      const response = await this.getCryptocurrencies({
        search: query,
        perPage: 20,
      })

      return response.cryptocurrencies
    } catch (error) {
      console.error("Error searching cryptocurrencies:", error)
      return []
    }
  }

  static async getTopCryptocurrencies(limit: number = 10): Promise<Cryptocurrency[]> {
    try {
      const response = await this.getCryptocurrencies({
        perPage: limit,
        sortBy: "market_cap",
        sortOrder: "desc",
      })

      return response.cryptocurrencies
    } catch (error) {
      console.error("Error fetching top cryptocurrencies:", error)
      return []
    }
  }

  static formatPrice(price: number): string {
    if (price >= 1_000_000_000) {
      return `$${(price / 1_000_000_000).toFixed(2)}B`
    } else if (price >= 1_000_000) {
      return `$${(price / 1_000_000).toFixed(2)}M`
    } else if (price >= 1_000) {
      return `$${(price / 1_000).toFixed(2)}K`
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`
    } else {
      return `$${price.toFixed(6)}`
    }
  }

  static formatMarketCap(marketCap: number): string {
    if (marketCap >= 1_000_000_000_000) {
      return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`
    } else if (marketCap >= 1_000_000_000) {
      return `$${(marketCap / 1_000_000_000).toFixed(2)}B`
    } else if (marketCap >= 1_000_000) {
      return `$${(marketCap / 1_000_000).toFixed(2)}M`
    } else {
      return `$${marketCap.toFixed(0)}`
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
    const btcDominance = btc
      ? (btc.market_cap / globalData.total_market_cap_usd) * 100
      : 0

    const totalMarketCap = globalData.total_market_cap_usd
    const totalVolume = globalData.total_volume_24h_usd

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