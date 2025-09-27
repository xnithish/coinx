import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const perPage = parseInt(searchParams.get("per_page") || "50")
    const sortBy = searchParams.get("sort_by") || "market_cap"
    const sortOrder = searchParams.get("sort_order") || "desc"
    const search = searchParams.get("search") || ""
    const currency = searchParams.get("currency") || "usd"

    // Validate parameters
    if (perPage > 250) {
      return NextResponse.json(
        { error: "Maximum per_page is 250" },
        { status: 400 }
      )
    }

    // Build CoinGecko API URL
    const coinGeckoUrl = new URL("https://api.coingecko.com/api/v3/coins/markets")
    coinGeckoUrl.searchParams.set("vs_currency", currency)
    coinGeckoUrl.searchParams.set("order", `${sortBy}_${sortOrder}`)
    coinGeckoUrl.searchParams.set("per_page", perPage.toString())
    coinGeckoUrl.searchParams.set("page", page.toString())
    coinGeckoUrl.searchParams.set("sparkline", "false")
    coinGeckoUrl.searchParams.set("price_change_percentage", "24h")

    // Add price data fields
    coinGeckoUrl.searchParams.set("price_change_percentage", "24h")
    coinGeckoUrl.searchParams.set("locale", "en")

    // Fetch cryptocurrencies from CoinGecko
    const response = await fetch(coinGeckoUrl.toString(), {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Coinx/1.0"
      },
      cache: "no-store"
    })

    if (!response.ok) {
      // Check if it's a rate limit error
      if (response.status === 429) {
        console.log("Limit reached - CoinGecko API rate limit exceeded for cryptocurrencies data")
        return NextResponse.json({
          cryptocurrencies: [],
          total: 0,
          page,
          perPage
        })
      }
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Check if the response indicates rate limiting
    if (data.error && (data.error.includes("rate limit") || data.error.includes("Too Many Requests"))) {
      console.log("Limit reached - CoinGecko API rate limit exceeded for cryptocurrencies data")
      return NextResponse.json({
        cryptocurrencies: [],
        total: 0,
        page,
        perPage
      })
    }

    // Filter by search term if provided
    let filteredData = data
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredData = data.filter((crypto: any) =>
        crypto.name.toLowerCase().includes(searchTerm) ||
        crypto.symbol.toLowerCase().includes(searchTerm)
      )
    }

    // Transform the response to our format
    const cryptocurrencies = filteredData.map((crypto: any) => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.current_price || 0,
      market_cap: crypto.market_cap || 0,
      market_cap_rank: crypto.market_cap_rank || 0,
      fully_diluted_valuation: crypto.fully_diluted_valuation,
      total_volume: crypto.total_volume || 0,
      high_24h: crypto.high_24h || 0,
      low_24h: crypto.low_24h || 0,
      price_change_24h: crypto.price_change_24h || 0,
      price_change_percentage_24h: crypto.price_change_percentage_24h || 0,
      market_cap_change_24h: crypto.market_cap_change_24h || 0,
      market_cap_change_percentage_24h: crypto.market_cap_change_percentage_24h || 0,
      circulating_supply: crypto.circulating_supply || 0,
      total_supply: crypto.total_supply || 0,
      max_supply: crypto.max_supply,
      ath: crypto.ath || 0,
      ath_change_percentage: crypto.ath_change_percentage || 0,
      ath_date: crypto.ath_date || "",
      atl: crypto.atl || 0,
      atl_change_percentage: crypto.atl_change_percentage || 0,
      atl_date: crypto.atl_date || "",
      roi: crypto.roi,
      last_updated: crypto.last_updated || ""
    }))

    return NextResponse.json({
      cryptocurrencies,
      total: cryptocurrencies.length,
      page,
      perPage
    })
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error)
    return NextResponse.json(
      { error: "Failed to fetch cryptocurrencies" },
      { status: 500 }
    )
  }
}