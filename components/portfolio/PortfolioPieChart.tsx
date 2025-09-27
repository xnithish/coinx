import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PortfolioAsset } from '@/types/portfolio'

interface PortfolioPieChartProps {
  assets: PortfolioAsset[]
  loading?: boolean
}

export const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({
  assets,
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
    return `${value.toFixed(1)}%`
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: PortfolioAsset }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-medium">{formatCurrency(data.value)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Holdings:</span>
              <span className="font-medium">{data.holdings.toFixed(4)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Allocation:</span>
              <span className="font-medium">{formatPercentage(data.allocationPercentage)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">P&L:</span>
              <span className={`font-medium ${data.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(data.profitLoss)} ({data.profitLossPercentage >= 0 ? '+' : ''}{data.profitLossPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom legend component
  const CustomLegend = ({ payload }: { payload?: Array<{ color: string; value: string; allocationPercentage: number }> }) => {
    return (
      <div className="space-y-2">
        {payload?.map((entry, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.value}</span>
            </div>
            <div className="text-muted-foreground">
              {formatPercentage(entry.allocationPercentage)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Prepare chart data
  const chartData = assets.map(asset => ({
    name: asset.name,
    symbol: asset.symbol.toUpperCase(),
    value: asset.value,
    holdings: asset.holdings,
    allocationPercentage: asset.allocationPercentage,
    profitLoss: asset.profitLoss,
    profitLossPercentage: asset.profitLossPercentage,
    color: asset.color
  }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (assets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-muted-foreground">No assets to display</div>
              <div className="text-sm text-muted-foreground">
                Add holdings to see your portfolio allocation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="mt-4 max-h-40 overflow-y-auto">
          <CustomLegend payload={chartData} />
        </div>

        {/* Portfolio Summary */}
        {assets.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Value: </span>
                <span className="font-medium">
                  {formatCurrency(assets.reduce((sum, asset) => sum + asset.value, 0))}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Assets: </span>
                <span className="font-medium">{assets.length}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}