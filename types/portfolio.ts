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

export interface HoldingsTableProps {
  holdings: Holding[]
  onAdd: () => void
  onEdit: (holding: Holding) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export interface HoldingsFormProps {
  holding?: Holding
  onSubmit: (data: HoldingsFormData) => void
  onCancel: () => void
  loading?: boolean
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
  bestPerformer: string
  bestPerformerChange: number
  worstPerformer: string
  worstPerformerChange: number
  dailyChange: number
  dailyChangePercentage: number
}

export interface TimeFilter {
  label: string
  value: string
  active?: boolean
}

export interface PortfolioOverviewCardProps {
  title?: string
  timeFilters?: TimeFilter[]
  onTimeFilterChange?: (filter: TimeFilter) => void
  portfolioOverview: PortfolioOverview
  metrics: PortfolioMetrics
  loading?: boolean
}