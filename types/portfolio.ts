export interface PortfolioAsset {
  id: string
  name: string
  symbol: string
  holdings: number
  averageBuyPrice: number
  currentPrice: number
  value: number
  profitLoss: number
  profitLossPercentage: number
  allocationPercentage: number
  color: string
}

export interface Holding {
  id: string
  name: string
  symbol: string
  holdings: number
  averageBuyPrice: number
  currentPrice?: number
  lastUpdated?: string
}

export interface HoldingsFormData {
  id?: string
  name: string
  symbol: string
  holdings: number
  averageBuyPrice: number
}

export interface HoldingWithAllocation extends Holding {
  allocationPercentage?: number
}

export interface HoldingsTableProps {
  portfolioItems: PortfolioItem[]
  onRemoveCoin: (id: string) => void
  onAddCoin: () => void
  formatCurrency: (value: number) => string
}

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

export interface PortfolioHolding {
  id: string
  coinId: string
  amount: number
  purchasePrice: number
}

export interface PortfolioItem extends PortfolioHolding {
  coin: Coin
  currentValue: number
  profitLoss: number
  profitLossPercentage: number
}

export interface PieChartData {
  name: string
  value: number
  percentage: number
  fullName: string
  [key: string]: unknown // Allow additional properties for recharts compatibility
}

export interface AddCoinDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  coins: Coin[]
  onAddCoin: (coin: Coin, amount: number, purchasePrice: number) => void
}

export interface PortfolioOverviewCardsProps {
  portfolioItems: PortfolioItem[]
  totalPortfolioValue: number
  totalProfitLoss: number
  total24hChange: number
}

export interface PortfolioDistributionChartProps {
  pieChartData: PieChartData[]
}

export interface MarketOverviewProps {
  coins: Coin[]
}

export interface PortfolioOverview {
  totalValue: number
  totalProfitLoss: number
  totalProfitLossPercentage: number
  assetCount: number
  assets: PortfolioAsset[]
  performanceHistory: Array<{ date: string; value: number }>
}

export interface PortfolioMetrics {
  totalValue: number
  totalProfitLoss: number
  totalProfitLossPercentage: number
  assetCount: number
  portfolioAge: string
  dailyChange: number
  dailyChangePercentage: number
}