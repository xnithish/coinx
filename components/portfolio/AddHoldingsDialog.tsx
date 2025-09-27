import React, { useState } from 'react'
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
import { HoldingsFormData, HoldingsFormProps } from '@/types/portfolio'
import { Plus } from 'lucide-react'

interface AddHoldingsDialogProps extends HoldingsFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AddHoldingsDialog: React.FC<AddHoldingsDialogProps> = ({
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

    onSubmit({
      ...formData,
      symbol: formData.symbol.toUpperCase().trim(),
      name: formData.name.trim()
    })

    // Reset form
    setFormData({
      name: '',
      symbol: '',
      holdings: 0,
      averageBuyPrice: 0
    })
    setErrors({})
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      symbol: '',
      holdings: 0,
      averageBuyPrice: 0
    })
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
            <Plus className="h-5 w-5" />
            Add New Holding
          </DialogTitle>
          <DialogDescription>
            Add a new cryptocurrency holding to your portfolio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Cryptocurrency Name</Label>
            <Input
              id="name"
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
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
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
            <Label htmlFor="holdings">Number of Holdings</Label>
            <Input
              id="holdings"
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
            <Label htmlFor="averageBuyPrice">Average Buy Price (USD)</Label>
            <Input
              id="averageBuyPrice"
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
              {loading ? 'Adding...' : 'Add Holding'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}