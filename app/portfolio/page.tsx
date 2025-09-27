'use client'

import React, { useEffect, useState } from 'react'
import { PortfolioOverviewCard } from '@/components/portfolio/PortfolioOverviewCard'
import { HoldingsTable } from '@/components/portfolio/HoldingsTable'
import { PortfolioPieChart } from '@/components/portfolio/PortfolioPieChart'
import { AddHoldingsDialog } from '@/components/portfolio/AddHoldingsDialog'
import { EditHoldingsDialog } from '@/components/portfolio/EditHoldingsDialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePortfolioStore } from '@/store/portfolio'
import { Holding, HoldingsFormData, TimeFilter } from '@/types/portfolio'
import { RefreshCw, AlertCircle } from 'lucide-react'

const PortfolioPage = () => {
  const {
    holdings,
    portfolioOverview,
    portfolioMetrics,
    isLoading,
    error,
    loadHoldings,
    addHolding,
    updateHolding,
    deleteHolding,
      refreshPrices
  } = usePortfolioStore()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null)
  const [timeFilters] = useState<TimeFilter[]>([
    { label: '24H', value: '24h', active: true },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '1Y', value: '1y' },
    { label: 'ALL', value: 'all' }
  ])

  useEffect(() => {
    loadHoldings()
  }, [])

  const handleAddHolding = (data: HoldingsFormData) => {
    addHolding(data)
    setShowAddDialog(false)
  }

  const handleEditHolding = (data: HoldingsFormData) => {
    if (editingHolding) {
      updateHolding(editingHolding.id, data)
      setShowEditDialog(false)
      setEditingHolding(null)
    }
  }

  const handleDeleteHolding = (id: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      deleteHolding(id)
    }
  }

  const handleEditClick = (holding: Holding) => {
    setEditingHolding(holding)
    setShowEditDialog(true)
  }

  const handleRefreshPrices = async () => {
    await refreshPrices()
  }

  const handleTimeFilterChange = (filter: TimeFilter) => {
    // Update active filter
    const updatedFilters = timeFilters.map(f => ({
      ...f,
      active: f.value === filter.value
    }))
    // In a real app, you would fetch different time period data here
    console.log('Time filter changed:', filter.value)
  }

  // Prepare holdings with allocation percentages for the table
  const holdingsWithAllocation = holdings.map(holding => {
    const asset = portfolioOverview.assets.find(a => a.id === holding.id)
    return {
      ...holding,
      currentPrice: asset?.currentPrice || 0,
      allocationPercentage: asset?.allocationPercentage || 0
    }
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your cryptocurrency investments and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshPrices}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Prices
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Portfolio Overview */}
      <PortfolioOverviewCard
        portfolioOverview={portfolioOverview}
        metrics={portfolioMetrics}
        timeFilters={timeFilters}
        onTimeFilterChange={handleTimeFilterChange}
        loading={isLoading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-2">
          <HoldingsTable
            holdings={holdingsWithAllocation}
            onAdd={() => setShowAddDialog(true)}
            onEdit={handleEditClick}
            onDelete={handleDeleteHolding}
            loading={isLoading}
          />
        </div>

        {/* Portfolio Pie Chart */}
        <div className="lg:col-span-1">
          <PortfolioPieChart
            assets={portfolioOverview.assets}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Add Holding Dialog */}
      <AddHoldingsDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddHolding}
        onCancel={() => setShowAddDialog(false)}
        loading={isLoading}
      />

      {/* Edit Holding Dialog */}
      <EditHoldingsDialog
        holding={editingHolding}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={handleEditHolding}
        onCancel={() => {
          setShowEditDialog(false)
          setEditingHolding(null)
        }}
        loading={isLoading}
      />
    </div>
  )
}

export default PortfolioPage