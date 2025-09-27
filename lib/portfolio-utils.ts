import { Holding, PortfolioAsset, PortfolioOverview, PortfolioMetrics } from "@/types/portfolio"

const STORAGE_KEY = "crypto-portfolio-holdings"

// LocalStorage management
export const saveHoldingsToStorage = (holdings: Holding[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings))
  } catch (error) {
    console.error("Failed to save holdings to localStorage:", error)
  }
}

export const loadHoldingsFromStorage = (): Holding[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const holdings = JSON.parse(stored)
      return Array.isArray(holdings) ? holdings : []
    }
  } catch (error) {
    console.error("Failed to load holdings from localStorage:", error)
  }
  return []
}

// CoinGecko price cache
const priceCache = new Map<string, { price: number; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Mock current prices - fallback when API is unavailable
const MOCK_CURRENT_PRICES: Record<string, number> = {
  "BTC": 43250,
  "ETH": 2650,
  "BNB": 315,
  "SOL": 102,
  "ADA": 0.42,
  "XRP": 0.63,
  "DOT": 7.2,
  "DOGE": 0.08,
  "AVAX": 37.5,
  "MATIC": 0.85
}

// Common crypto symbol to CoinGecko ID mapping
const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  "BTC": "bitcoin",
  "ETH": "ethereum",
  "BNB": "binancecoin",
  "SOL": "solana",
  "ADA": "cardano",
  "XRP": "ripple",
  "DOT": "polkadot",
  "DOGE": "dogecoin",
  "AVAX": "avalanche-2",
  "MATIC": "matic-network",
  "LINK": "chainlink",
  "UNI": "uniswap",
  "LTC": "litecoin",
  "BCH": "bitcoin-cash",
  "ATOM": "cosmos",
  "VET": "vechain",
  "TRX": "tron",
  "ETC": "ethereum-classic",
  "FIL": "filecoin",
  "THETA": "theta-token",
  "XLM": "stellar",
  "MKR": "maker",
  "AAVE": "aave",
  "KSM": "kusama",
  "NEAR": "near",
  "ALGO": "algorand",
  "ICP": "internet-computer",
  "QNT": "quant-network",
  "HBAR": "hedera-hashgraph",
  "VXV": "vectorspace-ai",
  "EGLD": "elrond-erd-2",
  "SAND": "the-sandbox",
  "MANA": "decentraland",
  "AXS": "axie-infinity",
  "FTT": "ftx-token",
  "LEO": "unus-sed-leo",
  "CRO": "crypto-com-chain",
  "SNX": "synthetix-network-token",
  "COMP": "compound-governance-token",
  "YFI": "yearn-finance",
  "SUSHI": "sushi",
  "CRV": "curve-dao-token",
  "UMA": "uma",
  "BAND": "band-protocol",
  "KNC": "kyber-network",
  "REN": "republic-protocol",
  "RSR": "reserve-rights-token",
  "BAT": "basic-attention-token",
  "ZRX": "0x",
  "ENJ": "enjincoin",
  "ANT": "aragon",
  "REP": "augur",
  "KAVA": "kava",
  "IOTX": "iotex",
  "OGN": "origin-protocol",
  "CTSI": "cartesi",
  "MLN": "melonport",
  "DIA": "dia-data",
  "PRQ": "parrot-protocol",
  "WNXM": "wrapped-nxm",
  "NMR": "numeraire",
  "LPT": "livepeer",
  "BNT": "bancor",
  "CVC": "civic",
  "DNT": "district0x",
  "MAN": "matrix-ai-network",
  "MCO": "monaco",
  "ADX": "adex",
  "FUN": "funfair",
  "ZEC": "zcash",
  "DASH": "dash",
  "XEM": "nem",
  "XTZ": "tezos",
  "EOS": "eos",
  "BSV": "bitcoin-sv",
  "BTG": "bitcoin-gold"
}

// Get current price from CoinGecko API or cache
export const getCurrentPrice = async (symbol: string): Promise<number> => {
  const upperSymbol = symbol.toUpperCase()

  // Check cache first
  const cached = priceCache.get(upperSymbol)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price
  }

  try {
    // For now, return mock price - in production you would use CoinGecko API here
    const mockPrice = MOCK_CURRENT_PRICES[upperSymbol] || 1

    // Cache the result
    priceCache.set(upperSymbol, {
      price: mockPrice,
      timestamp: Date.now()
    })

    return mockPrice
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error)
    // Fallback to mock price
    return MOCK_CURRENT_PRICES[upperSymbol] || 1
  }
}

// Batch fetch prices for multiple symbols
export const getBatchPrices = async (symbols: string[]): Promise<Record<string, number>> => {
  const results: Record<string, number> = {}

  for (const symbol of symbols) {
    try {
      const price = await getCurrentPrice(symbol)
      results[symbol] = price
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error)
      results[symbol] = MOCK_CURRENT_PRICES[symbol.toUpperCase()] || 1
    }
  }

  return results
}

// Clear price cache
export const clearPriceCache = () => {
  priceCache.clear()
}

// Portfolio calculation utilities
export const calculatePortfolioMetrics = (holdings: Holding[], currentPrices?: Record<string, number>): PortfolioOverview => {
  if (holdings.length === 0) {
    return {
      totalValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
      assetCount: 0,
      assets: [],
      performanceHistory: []
    }
  }

  let totalValue = 0
  let totalCost = 0
  const assets: PortfolioAsset[] = []

  holdings.forEach((holding, index) => {
    const currentPrice = currentPrices?.[holding.symbol.toUpperCase()] || MOCK_CURRENT_PRICES[holding.symbol.toUpperCase()] || 1
    const value = holding.holdings * currentPrice
    const cost = holding.holdings * holding.averageBuyPrice
    const profitLoss = value - cost
    const profitLossPercentage = cost > 0 ? (profitLoss / cost) * 100 : 0

    totalValue += value
    totalCost += cost

    assets.push({
      id: holding.id,
      name: holding.name,
      symbol: holding.symbol,
      holdings: holding.holdings,
      averageBuyPrice: holding.averageBuyPrice,
      currentPrice: currentPrice,
      value: value,
      profitLoss: profitLoss,
      profitLossPercentage: profitLossPercentage,
      allocationPercentage: 0, // Will be calculated below
      color: getAssetColor(index)
    })
  })

  const totalProfitLoss = totalValue - totalCost
  const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0

  // Calculate allocation percentages
  assets.forEach(asset => {
    asset.allocationPercentage = totalValue > 0 ? (asset.value / totalValue) * 100 : 0
  })

  return {
    totalValue,
    totalProfitLoss,
    totalProfitLossPercentage,
    assetCount: holdings.length,
    assets: assets.sort((a, b) => b.value - a.value), // Sort by value descending
    performanceHistory: []
  }
}

// Async version that fetches current prices
export const calculatePortfolioMetricsAsync = async (holdings: Holding[]): Promise<PortfolioOverview> => {
  if (holdings.length === 0) {
    return {
      totalValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
      assetCount: 0,
      assets: [],
      performanceHistory: []
    }
  }

  // Get unique symbols
  const symbols = [...new Set(holdings.map(h => h.symbol.toUpperCase()))]

  // Fetch current prices
  const currentPrices = await getBatchPrices(symbols)

  return calculatePortfolioMetrics(holdings, currentPrices)
}

export const calculatePortfolioStatistics = (holdings: Holding[]): PortfolioMetrics => {
  const portfolioOverview = calculatePortfolioMetrics(holdings)

  if (holdings.length === 0) {
    return {
      totalValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
      assetCount: 0,
      portfolioAge: "",
      bestPerformer: "",
      bestPerformerChange: 0,
      worstPerformer: "",
      worstPerformerChange: 0,
      dailyChange: 0,
      dailyChangePercentage: 0
    }
  }

  const assets = portfolioOverview.assets

  // Find best and worst performers
  const bestPerformer = assets.reduce((best, current) =>
    current.profitLossPercentage > best.profitLossPercentage ? current : best
  )

  const worstPerformer = assets.reduce((worst, current) =>
    current.profitLossPercentage < worst.profitLossPercentage ? current : worst
  )

  // Calculate mock daily change (in real app, this would come from API)
  const dailyChangePercentage = Math.random() * 10 - 5 // -5% to +5%
  const dailyChange = (portfolioOverview.totalValue * dailyChangePercentage) / 100

  // Calculate portfolio age based on oldest holding
  const portfolioAge = calculatePortfolioAge(holdings)

  return {
    totalValue: portfolioOverview.totalValue,
    totalProfitLoss: portfolioOverview.totalProfitLoss,
    totalProfitLossPercentage: portfolioOverview.totalProfitLossPercentage,
    assetCount: holdings.length,
    portfolioAge,
    bestPerformer: bestPerformer.symbol,
    bestPerformerChange: bestPerformer.profitLossPercentage,
    worstPerformer: worstPerformer.symbol,
    worstPerformerChange: worstPerformer.profitLossPercentage,
    dailyChange,
    dailyChangePercentage
  }
}

// Helper functions
const getMockCurrentPrice = (symbol: string): number => {
  return MOCK_CURRENT_PRICES[symbol.toUpperCase()] || 1 // Default to $1 if not found
}

const getAssetColor = (index: number): string => {
  const colors = [
    "#f7931a", // Bitcoin orange
    "#627eea", // Ethereum blue
    "#f3ba2f", // BNB yellow
    "#00ffa3", // Solana green
    "#0033ad", // Cardano blue
    "#e6007a", // Ripple pink
    "#00d4aa", // Polkadot teal
    "#c2a633", // Dogecoin gold
    "#ff6b35", // Avalanche orange
    "#7209b7"  // Polygon purple
  ]
  return colors[index % colors.length]
}

const calculatePortfolioAge = (holdings: Holding[]): string => {
  if (holdings.length === 0) return ""

  // Mock calculation - in real app, you'd use actual purchase dates
  const ages = ["6 months", "1 year", "2 years", "3 years", "5 years"]
  return ages[Math.floor(Math.random() * ages.length)]
}

// Holdings CRUD operations
export const addHolding = (holdings: Holding[], newHolding: Omit<Holding, "id">): Holding[] => {
  const holding: Holding = {
    ...newHolding,
    id: generateId(),
    lastUpdated: new Date().toISOString()
  }
  const updatedHoldings = [...holdings, holding]
  saveHoldingsToStorage(updatedHoldings)
  return updatedHoldings
}

export const updateHolding = (holdings: Holding[], updatedHolding: Holding): Holding[] => {
  const updatedHoldings = holdings.map(holding =>
    holding.id === updatedHolding.id
      ? { ...updatedHolding, lastUpdated: new Date().toISOString() }
      : holding
  )
  saveHoldingsToStorage(updatedHoldings)
  return updatedHoldings
}

export const deleteHolding = (holdings: Holding[], id: string): Holding[] => {
  const updatedHoldings = holdings.filter(holding => holding.id !== id)
  saveHoldingsToStorage(updatedHoldings)
  return updatedHoldings
}

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}