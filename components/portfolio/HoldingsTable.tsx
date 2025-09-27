import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { HoldingsTableProps } from '@/types/portfolio'

export function HoldingsTable({ portfolioItems, onRemoveCoin, onAddCoin, formatCurrency }: HoldingsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">Your Holdings</CardTitle>
            <CardDescription className="text-sm">Manage your cryptocurrency portfolio</CardDescription>
          </div>
          <Button onClick={onAddCoin} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Holdings</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {portfolioItems.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Coin</TableHead>
                  <TableHead className="min-w-[80px] hidden sm:table-cell">Holdings</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Avg Buy Price</TableHead>
                  <TableHead className="min-w-[100px]">Current Price</TableHead>
                  <TableHead className="min-w-[100px]">Value</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Profit/Loss</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img src={item.coin.image} alt={item.coin.name} className="w-6 h-6 sm:w-8 sm:h-8" />
                        <div>
                          <div className="font-medium text-sm sm:text-base">{item.coin.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {item.coin.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm">{item.amount.toFixed(4)}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{formatCurrency(item.purchasePrice)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatCurrency(item.coin.current_price)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{formatCurrency(item.currentValue)}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className={`text-sm ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.profitLoss)}
                        </span>
                        <span className={`text-xs ${item.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profitLossPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveCoin(item.id)}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        <span className="hidden sm:inline">Remove</span>
                        <span className="sm:hidden">×</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm sm:text-base">
            No assets in portfolio. Click &quot;Add Coin&quot; to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}