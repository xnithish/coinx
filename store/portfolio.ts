import { create } from 'zustand'
import { Holding, HoldingsFormData, PortfolioOverview, PortfolioMetrics } from '@/types/portfolio'
import {
  loadHoldingsFromStorage,
  saveHoldingsToStorage,
  calculatePortfolioMetrics,
  calculatePortfolioStatistics,
  addHolding as addHoldingUtil,
  updateHolding as updateHoldingUtil,
  deleteHolding as deleteHoldingUtil
} from '@/lib/portfolio-utils'

interface PortfolioStore {
  // State
  holdings: Holding[]
  isLoading: boolean
  error: string | null

  // Computed
  portfolioOverview: PortfolioOverview
  portfolioMetrics: PortfolioMetrics

  // Actions
  loadHoldings: () => void
  addHolding: (data: HoldingsFormData) => void
  updateHolding: (id: string, data: HoldingsFormData) => void
  deleteHolding: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  refreshPrices: () => Promise<void>
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  // Initial state
  holdings: [],
  isLoading: false,
  error: null,

  // Initial computed values
  portfolioOverview: {
    totalValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0,
    assetCount: 0,
    assets: [],
    performanceHistory: []
  },

  portfolioMetrics: {
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
  },

  // Actions
  loadHoldings: () => {
    try {
      const holdings = loadHoldingsFromStorage()
      set({ holdings })
      get().updateComputedValues()
    } catch (error) {
      set({ error: 'Failed to load holdings from storage' })
    }
  },

  addHolding: (data: HoldingsFormData) => {
    try {
      const { holdings } = get()
      const updatedHoldings = addHoldingUtil(holdings, data)
      set({ holdings: updatedHoldings })
      get().updateComputedValues()
    } catch (error) {
      set({ error: 'Failed to add holding' })
    }
  },

  updateHolding: (id: string, data: HoldingsFormData) => {
    try {
      const { holdings } = get()
      const existingHolding = holdings.find(h => h.id === id)
      if (!existingHolding) {
        set({ error: 'Holding not found' })
        return
      }

      const updatedHolding: Holding = {
        ...existingHolding,
        ...data,
        id
      }

      const updatedHoldings = updateHoldingUtil(holdings, updatedHolding)
      set({ holdings: updatedHoldings })
      get().updateComputedValues()
    } catch (error) {
      set({ error: 'Failed to update holding' })
    }
  },

  deleteHolding: (id: string) => {
    try {
      const { holdings } = get()
      const updatedHoldings = deleteHoldingUtil(holdings, id)
      set({ holdings: updatedHoldings })
      get().updateComputedValues()
    } catch (error) {
      set({ error: 'Failed to delete holding' })
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  refreshPrices: async () => {
    set({ isLoading: true, error: null })
    try {
      const { holdings } = get()

      // In a real implementation, you would fetch current prices from CoinGecko here
      // For now, we'll just recalculate with existing mock data
      get().updateComputedValues()

      // Clear any existing error
      set({ error: null })
    } catch (error) {
      set({ error: 'Failed to refresh prices' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Helper method to update computed values
  updateComputedValues: () => {
    const { holdings } = get()
    const portfolioOverview = calculatePortfolioMetrics(holdings)
    const portfolioMetrics = calculatePortfolioStatistics(holdings)

    set({
      portfolioOverview,
      portfolioMetrics
    })
  }
}))