import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Plus } from 'lucide-react'
import { AddCoinDialogProps, Coin } from '@/types/portfolio'

export function AddCoinDialog({ isOpen, onOpenChange, coins, onAddCoin }: AddCoinDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)
  const [amount, setAmount] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCoin = () => {
    if (selectedCoin && amount && purchasePrice) {
      onAddCoin(selectedCoin, parseFloat(amount), parseFloat(purchasePrice))
      setSelectedCoin(null)
      setAmount('')
      setPurchasePrice('')
      setSearchTerm('')
      onOpenChange(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCoin(null)
      setAmount('')
      setPurchasePrice('')
      setSearchTerm('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add Cryptocurrency</DialogTitle>
          <DialogDescription className="text-sm">
            Search and add a cryptocurrency to your portfolio
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 flex-1">
            {filteredCoins.slice(0, 10).map((coin) => (
              <div
                key={coin.id}
                className={`flex items-center gap-2 sm:gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted ${
                  selectedCoin?.id === coin.id ? 'bg-muted border-primary' : ''
                }`}
                onClick={() => setSelectedCoin(coin)}
              >
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{coin.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {coin.symbol.toUpperCase()} • {formatCurrency(coin.current_price)}
                  </div>
                </div>
                <div className={`text-xs sm:text-sm flex-shrink-0 ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
          {selectedCoin && (
            <div className="space-y-4 pt-4 border-t flex-shrink-0">
              <div className="flex items-center gap-3">
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10" />
                <div>
                  <div className="font-medium">{selectedCoin.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCoin.symbol.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.00000001"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Purchase Price (USD)</label>
                  <Input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 flex-shrink-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleAddCoin} disabled={!selectedCoin || !amount || !purchasePrice} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add to Portfolio</span>
            <span className="sm:inline">Add</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}