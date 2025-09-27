"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RotateCcw } from "lucide-react"
import { FilterOptions, SortOption } from "@/types/crypto"

interface SearchFilterProps {
  filterOptions: FilterOptions
  onFilterChange: (options: FilterOptions) => void
  loading?: boolean
}

const sortOptions: SortOption[] = [
  { value: "market_cap", label: "Market Cap" },
  { value: "current_price", label: "Price" },
  { value: "price_change_percentage_24h", label: "24h Change %" },
  { value: "total_volume", label: "Volume" },
  { value: "name", label: "Name" },
  { value: "market_cap_rank", label: "Rank" }
]

export function SearchFilter({ filterOptions, onFilterChange, loading = false }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(filterOptions.search)
  const [selectedSort, setSelectedSort] = useState(filterOptions.sortBy)
  const [selectedOrder, setSelectedOrder] = useState(filterOptions.sortOrder)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onFilterChange({
      ...filterOptions,
      search: value,
      page: 1 // Reset to first page when searching
    })
  }

  const handleSortChange = (value: string) => {
    setSelectedSort(value)
    onFilterChange({
      ...filterOptions,
      sortBy: value,
      page: 1
    })
  }

  const handleOrderChange = (value: string) => {
    setSelectedOrder(value as 'asc' | 'desc')
    onFilterChange({
      ...filterOptions,
      sortOrder: value as 'asc' | 'desc',
      page: 1
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedSort("market_cap")
    setSelectedOrder("desc")
    onFilterChange({
      search: "",
      sortBy: "market_cap",
      sortOrder: "desc",
      page: 1,
      perPage: filterOptions.perPage
    })
  }

  const hasActiveFilters = searchTerm || selectedSort !== "market_cap" || selectedOrder !== "desc"

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          {/* Sort By */}
          <Select value={selectedSort} onValueChange={handleSortChange} disabled={loading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select value={selectedOrder} onValueChange={handleOrderChange} disabled={loading}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md text-sm">
                <Search className="h-3 w-3" />
                Search: "{searchTerm}"
              </div>
            )}
            <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md text-sm">
              <Filter className="h-3 w-3" />
              Sort: {sortOptions.find(opt => opt.value === selectedSort)?.label}
            </div>
            <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md text-sm">
              Order: {selectedOrder === "desc" ? "High to Low" : "Low to High"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}