import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Activity } from 'lucide-react'
import { PortfolioOverviewCardsProps } from '@/types/portfolio'

export function PortfolioOverviewCards({
  portfolioItems,
  totalPortfolioValue,
  totalProfitLoss,
  total24hChange,
  total24hChangePercentage
}: PortfolioOverviewCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const statsData = [
    {
      label: 'Total Portfolio Value',
      value: formatCurrency(totalPortfolioValue),
      icon: DollarSign,
      color: 'text-foreground'
    },
    {
      label: 'Total Profit/Loss',
      value: formatCurrency(totalProfitLoss),
      icon: totalProfitLoss >= 0 ? TrendingUp : TrendingDown,
      color: totalProfitLoss >= 0 ? 'text-[#00DC33]' : 'text-red-600'
    },
    {
      label: 'Assets',
      value: portfolioItems.length.toString(),
      icon: PieChartIcon,
      color: 'text-foreground'
    },
    {
      label: '24h Change',
      value: formatCurrency(total24hChange),
      icon: Activity,
      color: total24hChange >= 0 ? 'text-[#00DC33]' : 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-card rounded-lg p-4 border shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`text-lg font-semibold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}