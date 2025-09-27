import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { HoldingsTableProps } from '@/types/portfolio'

export function HoldingsTable({ portfolioItems, onRemoveCoin, onAddCoin, formatCurrency }: HoldingsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Holdings</CardTitle>
            <CardDescription>Manage your cryptocurrency portfolio</CardDescription>
          </div>
          <Button onClick={onAddCoin}>
            <Plus className="h-4 w-4 mr-2" />
            Add Holdings
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {portfolioItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Holdings</TableHead>
                <TableHead>Avg Buy Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Profit/Loss</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={item.coin.image} alt={item.coin.name} className="w-8 h-8" />
                      <div>
                        <div className="font-medium">{item.coin.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.amount.toFixed(4)}</TableCell>
                  <TableCell>{formatCurrency(item.purchasePrice)}</TableCell>
                  <TableCell>{formatCurrency(item.coin.current_price)}</TableCell>
                  <TableCell>{formatCurrency(item.currentValue)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(item.profitLoss)}
                      </span>
                      <span className={`text-sm ${item.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.profitLossPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveCoin(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No assets in portfolio. Click &quot;Add Coin&quot; to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}