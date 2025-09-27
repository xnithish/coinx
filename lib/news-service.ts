import { NewsArticle, NewsResponse, NewsFilter, NewsSort, CryptoPanicArticle } from "@/types/news"

export class NewsService {
  private static readonly API_BASE = "/api/news"
  private static readonly API_KEY = process.env.NEXT_PUBLIC_CRYPTOPANIC_API_KEY

  static async fetchNews(
    options: {
      filter?: NewsFilter
      sort?: NewsSort
      page?: number
      limit?: number
    } = {}
  ): Promise<NewsResponse> {
    const { filter = {}, sort = "published_at", page = 1, limit = 10 } = options

    if (!this.API_KEY) {
      throw new Error("CryptoPanic API key is not configured")
    }

    // Build URL with proper parameters
    const url = new URL(`${this.API_BASE}`, window.location.origin)
    url.searchParams.set('page', page.toString())

    // Only add limit if specified (default is 10)
    if (limit) {
      url.searchParams.set('limit', limit.toString())
    }

    // Add filter parameters
    if (filter.filter && filter.filter !== 'all') {
      url.searchParams.set('filter', filter.filter)
    }

    if (filter.kind && filter.kind !== 'all') {
      url.searchParams.set('kind', filter.kind)
    }

    try {
      console.log('Fetching news from:', url.toString())

      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)

        if (response.status === 429) {
          throw new Error("API rate limit exceeded. Please try again in a few minutes.")
        } else if (response.status === 401) {
          throw new Error("Invalid API key. Please check your configuration.")
        } else {
          throw new Error(`API error (${response.status}): ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API Response:', data)

      // Transform CryptoPanic API response to our NewsArticle format
      const transformedData: NewsResponse = {
        count: data.results.length,
        next: data.next,
        previous: data.previous,
        results: data.results.map((article: CryptoPanicArticle) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          published_at: article.published_at,
          created_at: article.created_at,
          kind: article.kind,
          description: article.description,
          // Optional fields not provided by CryptoPanic API
          url: undefined,
          source: undefined,
          currencies: [],
          sentiment: undefined,
          votes: {
            positive: 0,
            negative: 0,
            important: 0,
            liked: 0,
            disliked: 0,
            lol: 0,
            saved: 0,
            comments: 0
          }
        }))
      }

      return transformedData
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  }

  static async searchNews(
    query: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<NewsResponse> {
    return this.fetchNews({
      ...options,
      filter: { filter: "hot" }
    })
  }

  static async getNewsByKind(
    kind: "news" | "media",
    options: { page?: number; limit?: number } = {}
  ): Promise<NewsResponse> {
    return this.fetchNews({
      ...options,
      filter: { kind }
    })
  }

  static async getNewsBySentiment(
    sentiment: "bullish" | "bearish" | "important",
    options: { page?: number; limit?: number } = {}
  ): Promise<NewsResponse> {
    return this.fetchNews({
      ...options,
      filter: { filter: sentiment }
    })
  }

  static getSentimentColor(sentiment?: string): string {
    switch (sentiment) {
      case "bullish":
      case "positive":
        return "text-green-600 bg-green-50"
      case "bearish":
      case "negative":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  static getSentimentIcon(sentiment?: string): string {
    switch (sentiment) {
      case "bullish":
      case "positive":
        return "📈"
      case "bearish":
      case "negative":
        return "📉"
      default:
        return "📰"
    }
  }

  static getKindIcon(kind: string): string {
    return kind === "news" ? "📰" : "🎥"
  }
}