import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Fetch global market data from CoinGecko
    const response = await fetch(
      "https://api.coingecko.com/api/v3/global",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Coinx/1.0"
        },
        cache: "no-store"
      }
    )

    if (!response.ok) {
      // Check if it's a rate limit error
      if (response.status === 429) {
        console.log("Limit reached - CoinGecko API rate limit exceeded for global market data")
        // Return fallback data instead of throwing error
        return NextResponse.json({
          total_market_cap_usd: 0,
          total_volume_24h_usd: 0,
          active_cryptocurrencies: 0
        })
      }
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Check if the response indicates rate limiting
    if (data.error && data.error.includes("rate limit")) {
      console.log("Limit reached - CoinGecko API rate limit exceeded for global market data")
      return NextResponse.json({
        total_market_cap_usd: 0,
        total_volume_24h_usd: 0,
        active_cryptocurrencies: 0
      })
    }

    // Transform the response to our format
    const globalData = {
      total_market_cap_usd: data.data.total_market_cap.usd || 0,
      total_volume_24h_usd: data.data.total_volume.usd || 0,
      active_cryptocurrencies: data.data.active_cryptocurrencies || 0
    }

    return NextResponse.json(globalData)
  } catch (error) {
    console.error("Error fetching global market data:", error)

    // Return fallback data
    return NextResponse.json({
      total_market_cap_usd: 0,
      total_volume_24h_usd: 0,
      active_cryptocurrencies: 0
    })
  }
}