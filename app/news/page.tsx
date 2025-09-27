"use client"

import * as React from "react"
import { NewsService } from "@/lib/news-service"
import { NewsArticle, NewsFilter, NewsSort } from "@/types/news"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Clock,
  RefreshCw,
  Search,
} from "lucide-react"

export default function NewsPage() {
  const [articles, setArticles] = React.useState<NewsArticle[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedFilter, setSelectedFilter] = React.useState<string>("hot")
  const [selectedKind, setSelectedKind] = React.useState<string>("all")

  const fetchNews = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filter: NewsFilter = {}

      if (selectedFilter !== "all") {
        filter.filter = selectedFilter as 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol'
      }

      if (selectedKind !== "all") {
        filter.kind = selectedKind as "news" | "media"
      }

      const response = await NewsService.fetchNews({
        filter,
        sort: "published_at",
        page: 1,
        limit: 6
      })

      setArticles(response.results)
    } catch (err) {
      console.error("Error fetching news:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch news")
    } finally {
      setLoading(false)
    }
  }, [selectedFilter, selectedKind])

  React.useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const handleSearch = React.useCallback(() => {
    if (searchQuery.trim()) {
      // For search, we'll filter the current articles (simple implementation)
      // In a real app, you might want to implement backend search
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setArticles(filtered)
    } else {
      fetchNews()
    }
  }, [searchQuery, articles, fetchNews])

  const handleRefresh = () => {
    fetchNews()
  }

  const formatPublishedAt = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredArticles = React.useMemo(() => {
    if (!searchQuery) return articles

    return articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [articles, searchQuery])

  if (error && articles.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News</h1>
          <p className="text-muted-foreground">
            Stay updated with cryptocurrency news and trends
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Error Loading News</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={handleRefresh} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">News</h1>
        <p className="text-muted-foreground">
          Stay updated with cryptocurrency news and trends
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="flex gap-2 cursor-pointer">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="rising">Rising</SelectItem>
              <SelectItem value="bullish">Bullish</SelectItem>
              <SelectItem value="bearish">Bearish</SelectItem>
              <SelectItem value="important">Important</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedKind} onValueChange={setSelectedKind}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="media">Media</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* News Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading && articles.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {filteredArticles.slice(0, 6).map((article) => {
              const cryptoPanicUrl = `https://cryptopanic.com/news/${article.slug}/`
              return (
                <a
                  key={article.id}
                  href={cryptoPanicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20 cursor-pointer">
                    <CardHeader >
                      <div className="flex items-center gap-2 ">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatPublishedAt(article.published_at)}
                        </div>
                      </div>
                      <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                        <ExternalLink className="ml-1 inline h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                    </CardHeader>

                    {article.description && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {article.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </a>
              )
            })}

            <div className="col-span-full flex justify-center">
              <Button
                className="px-4 py-3 text-sm font-medium"
                asChild
              >
                <a
                  href="https://cryptopanic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View More
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </>
        )}
      </div>

      {!loading && filteredArticles.length === 0 && searchQuery && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-sm text-muted-foreground text-center">
              No news articles match your search query &quot;{searchQuery}&quot;
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}