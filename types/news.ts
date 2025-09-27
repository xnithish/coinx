export interface Currency {
  code: string
  title: string
  slug: string
}

export interface Domain {
  name: string
  slug: string
}

export interface Source {
  title: string
  domain: Domain
  meta: {
    icon?: string
    favicon?: string
  }
}

// Actual CryptoPanic API response structure
export interface CryptoPanicArticle {
  id: string
  title: string
  slug: string
  description?: string
  published_at: string
  created_at: string
  kind: 'news' | 'media'
}

// Enhanced article structure with optional fields for future compatibility
export interface NewsArticle {
  id: string
  title: string
  slug: string
  url?: string
  published_at: string
  created_at: string
  kind: 'news' | 'media'
  description?: string
  source?: Source
  currencies?: Currency[]
  metadata?: {
    title?: string
    description?: string
    image?: string
  }
  sentiment?: 'positive' | 'negative' | 'neutral'
  votes?: {
    positive: number
    negative: number
    important: number
    liked: number
    disliked: number
    lol: number
    saved: number
    comments: number
  }
}

export interface NewsResponse {
  count: number
  next?: string
  previous?: string
  results: NewsArticle[]
}

export type NewsFilter = {
  filter?: 'all' | 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol'
  kind?: 'all' | 'news' | 'media'
  currencies?: string
  regions?: string
}

export type NewsSort = 'published_at' | 'voted_at' | 'positive_votes' | 'negative_votes' | 'important_votes'