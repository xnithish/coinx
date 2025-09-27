import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HoldingsFormData, HoldingsFormProps, Holding } from '@/types/portfolio'
import { Edit } from 'lucide-react'

interface EditHoldingsDialogProps extends HoldingsFormProps {
  holding: Holding | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditHoldingsDialog: React.FC<EditHoldingsDialogProps> = ({
  holding,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<HoldingsFormData>({
    name: '',
    symbol: '',
    holdings: 0,
    averageBuyPrice: 0
  })

  const [errors, setErrors] = useState<Partial<HoldingsFormData>>({})

  // Initialize form data when holding changes
  useEffect(() => {
    if (holding) {
      setFormData({
        name: holding.name,
        symbol: holding.symbol,
        holdings: holding.holdings,
        averageBuyPrice: holding.averageBuyPrice
      })
      setErrors({})
    }
  }, [holding])

  const validateForm = (): boolean => {
    const newErrors: Partial<HoldingsFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required'
    }

    if (formData.holdings <= 0) {
      newErrors.holdings = 'Holdings must be greater than 0'
    }

    if (formData.averageBuyPrice <= 0) {
      newErrors.averageBuyPrice = 'Average buy price must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!holding) {
      return
    }

    onSubmit({
      ...formData,
      id: holding.id,
      symbol: formData.symbol.toUpperCase().trim(),
      name: formData.name.trim()
    })
  }

  const handleCancel = () => {
    setErrors({})
    onCancel()
  }

  const handleInputChange = (field: keyof HoldingsFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Holding
          </DialogTitle>
          <DialogDescription>
            Update your cryptocurrency holding details.
          </DialogDescription>
        </DialogHeader>

        {holding && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Cryptocurrency Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Bitcoin"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-symbol">Symbol</Label>
              <Input
                id="edit-symbol"
                placeholder="e.g., BTC"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                className={errors.symbol ? 'border-red-500' : ''}
              />
              {errors.symbol && (
                <p className="text-sm text-red-500">{errors.symbol}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-holdings">Number of Holdings</Label>
              <Input
                id="edit-holdings"
                type="number"
                step="0.00000001"
                min="0"
                placeholder="e.g., 0.5"
                value={formData.holdings || ''}
                onChange={(e) => handleInputChange('holdings', parseFloat(e.target.value) || 0)}
                className={errors.holdings ? 'border-red-500' : ''}
              />
              {errors.holdings && (
                <p className="text-sm text-red-500">{errors.holdings}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-averageBuyPrice">Average Buy Price (USD)</Label>
              <Input
                id="edit-averageBuyPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 45000"
                value={formData.averageBuyPrice || ''}
                onChange={(e) => handleInputChange('averageBuyPrice', parseFloat(e.target.value) || 0)}
                className={errors.averageBuyPrice ? 'border-red-500' : ''}
              />
              {errors.averageBuyPrice && (
                <p className="text-sm text-red-500">{errors.averageBuyPrice}</p>
              )}
            </div>

            {/* Display current price info if available */}
            {holding.currentPrice && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <div className="text-sm font-medium">Current Market Price</div>
                <div className="text-lg font-semibold">
                  ${holding.currentPrice.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  This price is fetched from the market and may not reflect your actual purchase price.
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Holding'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}