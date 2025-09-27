import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { PortfolioOverview, PortfolioMetrics, TimeFilter } from '@/types/portfolio'
import { cn } from '@/lib/utils'

interface PortfolioOverviewCardProps {
  portfolioOverview: PortfolioOverview
  metrics: PortfolioMetrics
  timeFilters?: TimeFilter[]
  onTimeFilterChange?: (filter: TimeFilter) => void
  loading?: boolean
}

export const PortfolioOverviewCard: React.FC<PortfolioOverviewCardProps> = ({
  portfolioOverview,
  metrics,
  timeFilters,
  onTimeFilterChange,
  loading = false
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const isPositive = (value: number): boolean => {
    return value >= 0
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Portfolio Overview</CardTitle>
              <CardDescription>Loading your portfolio data...</CardDescription>
            </div>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                <div className="h-8 bg-muted-foreground/20 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Portfolio Overview</CardTitle>
            <CardDescription>
              {metrics.assetCount} {metrics.assetCount === 1 ? 'asset' : 'assets'} • {metrics.portfolioAge}
            </CardDescription>
          </div>

          {timeFilters && timeFilters.length > 0 && (
            <div className="flex gap-2">
              {timeFilters.map((filter) => (
                <Badge
                  key={filter.value}
                  variant={filter.active ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => onTimeFilterChange?.(filter)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Main metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Value */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Value</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioOverview.totalValue)}
            </div>
          </div>

          {/* Total Profit/Loss */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {isPositive(portfolioOverview.totalProfitLoss) ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium text-muted-foreground">Total P&L</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioOverview.totalProfitLoss)}
            </div>
            <div className={cn(
              'text-sm font-medium',
              isPositive(portfolioOverview.totalProfitLossPercentage)
                ? 'text-green-600'
                : 'text-red-600'
            )}>
              {formatPercentage(portfolioOverview.totalProfitLossPercentage)}
            </div>
          </div>

          {/* Daily Change */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {isPositive(metrics.dailyChange) ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium text-muted-foreground">24h Change</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.dailyChange)}
            </div>
            <div className={cn(
              'text-sm font-medium',
              isPositive(metrics.dailyChangePercentage)
                ? 'text-green-600'
                : 'text-red-600'
            )}>
              {formatPercentage(metrics.dailyChangePercentage)}
            </div>
          </div>

          {/* Asset Count */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Assets</span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.assetCount}
            </div>
            <div className="text-sm text-muted-foreground">
              {metrics.assetCount === 1 ? 'holding' : 'holdings'}
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Performer */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Best Performer</span>
            </div>
            <div className="text-lg font-semibold">
              {metrics.bestPerformer || 'N/A'}
            </div>
            <div className="text-sm text-green-600 font-medium">
              {metrics.bestPerformerChange !== 0 ? formatPercentage(metrics.bestPerformerChange) : 'N/A'}
            </div>
          </div>

          {/* Worst Performer */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-muted-foreground">Worst Performer</span>
            </div>
            <div className="text-lg font-semibold">
              {metrics.worstPerformer || 'N/A'}
            </div>
            <div className="text-sm text-red-600 font-medium">
              {metrics.worstPerformerChange !== 0 ? formatPercentage(metrics.worstPerformerChange) : 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}