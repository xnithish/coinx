import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://cryptopanic.com/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_CRYPTOPANIC_API_KEY

export async function GET(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'CryptoPanic API key is not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)

    // Build the CryptoPanic API URL with all query parameters
    const url = new URL(`${API_BASE}/posts/`)

    // Forward all query parameters to the CryptoPanic API
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    // Add the auth_token parameter
    url.searchParams.set('auth_token', API_KEY)

    console.log('Fetching from CryptoPanic:', url.toString())

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Coinstax-App/1.0'
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('CryptoPanic API Error:', response.status, errorText)

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        )
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your configuration.' },
          { status: 401 }
        )
      } else {
        return NextResponse.json(
          { error: `API error (${response.status}): ${errorText}` },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in news API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}