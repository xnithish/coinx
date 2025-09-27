"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PortfolioOverviewCards } from './PortfolioOverviewCards'
import { AddCoinDialog } from './AddCoinDialog'
import { PortfolioDistributionChart } from './PortfolioDistributionChart'
import { MarketOverview } from './MarketOverview'
import { HoldingsTable } from './HoldingsTable'
import {
  Coin,
  PortfolioHolding,
  PortfolioItem,
  PieChartData
} from '@/types/portfolio'
import { useCurrency } from '@/contexts/currency-context'
import { MarketService } from '@/lib/market-service'

export function CryptoPortfolio() {
  const { currency } = useCurrency()
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [coins, setCoins] = useState<Coin[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cryptoPortfolio')
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved))
      } catch (error) {
        console.error('Error parsing saved portfolio:', error)
      }
    } else {
      // Add default holdings if no portfolio exists
      const defaultHoldings: PortfolioHolding[] = [
        {
          id: 'default-btc',
          coinId: 'bitcoin',
          amount: 0.5,
          purchasePrice: 45000
        },
        {
          id: 'default-sol',
          coinId: 'solana',
          amount: 10,
          purchasePrice: 120
        }
      ]
      localStorage.setItem('cryptoPortfolio', JSON.stringify(defaultHoldings))
      setPortfolio(defaultHoldings)
    }
  }, [])

  const savePortfolio = (holdings: PortfolioHolding[]) => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(holdings))
    setPortfolio(holdings)
  }

  const fetchCoins = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
        { cache: 'no-store' }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch coins: ${response.status} ${response.statusText}`)
      }

      const data: Coin[] = await response.json()
      setCoins(data)
    } catch (error) {
      console.error('Error fetching coins:', error)
    }
  }, [currency])

  useEffect(() => {
    fetchCoins()
  }, [fetchCoins])

  const addCoin = (coin: Coin, amount: number, purchasePrice: number) => {
    const newHolding: PortfolioHolding = {
      id: Date.now().toString(),
      coinId: coin.id,
      amount,
      purchasePrice,
    }
    savePortfolio([...portfolio, newHolding])
  }

  const removeCoin = (id: string) => {
    savePortfolio(portfolio.filter(holding => holding.id !== id))
  }

  const portfolioItems: PortfolioItem[] = portfolio.map(holding => {
    const coin = coins.find(c => c.id === holding.coinId)
    if (!coin) return null

    const currentValue = holding.amount * coin.current_price
    const profitLoss = currentValue - (holding.amount * holding.purchasePrice)
    const profitLossPercentage = ((coin.current_price - holding.purchasePrice) / holding.purchasePrice) * 100

    return {
      ...holding,
      coin,
      currentValue,
      profitLoss,
      profitLossPercentage
    }
  }).filter(Boolean) as PortfolioItem[]

  const totalPortfolioValue = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0)
  const totalProfitLoss = portfolioItems.reduce((sum, item) => sum + item.profitLoss, 0)

  // Calculate weighted 24-hour change based on portfolio allocation
  const total24hChangePercentage = totalPortfolioValue > 0
    ? portfolioItems.reduce((sum, item) => {
        const weight = item.currentValue / totalPortfolioValue
        return sum + (weight * item.coin.price_change_percentage_24h)
      }, 0)
    : 0

  const total24hChange = (total24hChangePercentage / 100) * totalPortfolioValue

  const pieChartData: PieChartData[] = portfolioItems.map(item => ({
    name: item.coin.symbol.toUpperCase(),
    value: item.currentValue,
    percentage: (item.currentValue / totalPortfolioValue) * 100,
    fullName: item.coin.name
  }))

  const formatCurrency = (value: number) => {
    const symbol = MarketService.getCurrencySymbol(currency)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace(currency, symbol)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className='flex flex-col space-y-1'>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md">
              Welcome to your cryptocurrency portfolio overview
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Coin</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </header>

        <PortfolioOverviewCards
          portfolioItems={portfolioItems}
          totalPortfolioValue={totalPortfolioValue}
          totalProfitLoss={totalProfitLoss}
          total24hChange={total24hChange}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <PortfolioDistributionChart
            pieChartData={pieChartData}
            totalPortfolioValue={totalPortfolioValue}
          />
          <MarketOverview coins={coins} />
        </div>

        <HoldingsTable
          portfolioItems={portfolioItems}
          onRemoveCoin={removeCoin}
          onAddCoin={() => setIsAddDialogOpen(true)}
          formatCurrency={formatCurrency}
        />

        <AddCoinDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          coins={coins}
          onAddCoin={addCoin}
        />
      </div>
    </div>
  )
}