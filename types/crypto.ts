export interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation?: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply?: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi?: {
    times: number
    currency: string
    percentage: number
  }
  last_updated: string
}

export interface SimplePriceData {
  [key: string]: {
    usd: number
    usd_market_cap?: number
    usd_24h_vol?: number
    usd_24h_change?: number
  }
}

export interface GlobalMarketData {
  total_market_cap_usd: number
  total_volume_24h_usd: number
  active_cryptocurrencies: number
}

export interface MarketStats {
  totalMarketCap: number
  totalVolume: number
  marketCapChange24h: number
  volumeChange24h: number
  btcDominance: number
  activeCryptocurrencies: number
}

export interface CryptoListResponse {
  cryptocurrencies: Cryptocurrency[]
  total: number
  page: number
  perPage: number
}

export interface SortOption {
  value: string
  label: string
}

export interface FilterOptions {
  search: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  page: number
  perPage: number
}