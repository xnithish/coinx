import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownmenu'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import { HoldingsTableProps } from '@/types/portfolio'
import { cn } from '@/lib/utils'

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  onAdd,
  onEdit,
  onDelete,
  loading = false
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Holdings</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Holding
          </Button>
        </div>
        <div className="border rounded-lg">
          <div className="space-y-2 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-4 bg-muted-foreground/20 rounded w-20"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-16"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-32"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
                <div className="h-8 bg-muted-foreground/20 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Holdings</h2>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Holding
        </Button>
      </div>

      {holdings.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">No holdings yet</h3>
            <p className="text-sm text-muted-foreground">
              Start building your portfolio by adding your first crypto holding.
            </p>
            <Button onClick={onAdd} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Holding
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Holdings</TableHead>
                <TableHead className="text-right">Avg Buy Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const value = holding.holdings * (holding.currentPrice || 0)
                const cost = holding.holdings * holding.averageBuyPrice
                const profitLoss = value - cost
                const profitLossPercentage = cost > 0 ? (profitLoss / cost) * 100 : 0

                return (
                  <TableRow key={holding.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{holding.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {holding.symbol.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(holding.holdings)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(holding.averageBuyPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(holding.currentPrice || 0)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(value)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          'font-medium',
                          isPositive(profitLoss) ? 'text-green-600' : 'text-red-600'
                        )}>
                          {formatCurrency(profitLoss)}
                        </span>
                        <span className={cn(
                          'text-xs',
                          isPositive(profitLossPercentage) ? 'text-green-600' : 'text-red-600'
                        )}>
                          {formatPercentage(profitLossPercentage)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {holding.allocationPercentage?.toFixed(1) || '0.0'}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(holding)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(holding.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}