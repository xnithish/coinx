"use client"

import { type ChangeEvent, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  AlertCircle,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

type CoinOption = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
}

type CurrencyOption = {
  code: string
  label: string
  locale: string
  decimals?: number
}

const currencyOptions: CurrencyOption[] = [
  { code: "usd", label: "US Dollar", locale: "en-US", decimals: 2 },
  { code: "eur", label: "Euro", locale: "de-DE", decimals: 2 },
  { code: "gbp", label: "British Pound", locale: "en-GB", decimals: 2 },
  { code: "inr", label: "Indian Rupee", locale: "en-IN", decimals: 2 },
  { code: "jpy", label: "Japanese Yen", locale: "ja-JP", decimals: 0 },
  { code: "aud", label: "Australian Dollar", locale: "en-AU", decimals: 2 },
  { code: "cad", label: "Canadian Dollar", locale: "en-CA", decimals: 2 },
]

const COIN_MARKET_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=24h"

export default function Calculator() {
  const [amountInput, setAmountInput] = useState<string>("1")
  const [coins, setCoins] = useState<CoinOption[]>([])
  const [selectedCoinId, setSelectedCoinId] = useState<string>("bitcoin")
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    currencyOptions[0].code
  )
  const [coinReloadKey, setCoinReloadKey] = useState(0)
  const [refreshToken, setRefreshToken] = useState(0)

  const [coinListLoading, setCoinListLoading] = useState<boolean>(false)
  const [coinListError, setCoinListError] = useState<string | null>(null)

  const [conversionLoading, setConversionLoading] = useState<boolean>(false)
  const [conversionError, setConversionError] = useState<string | null>(null)
  const [price, setPrice] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const amount = useMemo(() => {
    const parsed = parseFloat(amountInput)
    return Number.isFinite(parsed) ? parsed : 0
  }, [amountInput])

  const activeCurrency = useMemo(
    () =>
      currencyOptions.find((option) => option.code === selectedCurrency) ??
      currencyOptions[0],
    [selectedCurrency]
  )

  const selectedCoin = useMemo(
    () => coins.find((coin) => coin.id === selectedCoinId),
    [coins, selectedCoinId]
  )

  const usdFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    []
  )

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(activeCurrency.locale, {
        style: "currency",
        currency: activeCurrency.code.toUpperCase(),
        maximumFractionDigits: activeCurrency.decimals ?? 2,
        minimumFractionDigits: activeCurrency.decimals ?? 2,
      }),
    [activeCurrency]
  )

  const amountLabel = useMemo(() => {
    if (!Number.isFinite(amount)) {
      return "0"
    }

    const maximumFractionDigits = amount >= 1 ? 2 : 6
    return amount.toLocaleString(undefined, {
      maximumFractionDigits,
    })
  }, [amount])

  const coinSymbol = selectedCoin?.symbol?.toUpperCase() ?? "COIN"

  const convertedValue = useMemo(() => amount * price, [amount, price])
  const hasValidRate = price > 0 && !conversionError

  const formattedConvertedValue = hasValidRate
    ? currencyFormatter.format(convertedValue)
    : "—"

  const formattedRate = hasValidRate
    ? currencyFormatter.format(price)
    : "—"

  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null

    return lastUpdated.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    })
  }, [lastUpdated])

  useEffect(() => {
    let isCancelled = false
    const controller = new AbortController()

    async function fetchCoins() {
      if (!isCancelled) {
        setCoinListLoading(true)
        setCoinListError(null)
      }

      try {
        const response = await fetch(COIN_MARKET_ENDPOINT, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Failed to fetch coin list")
        }

        const data: CoinOption[] = await response.json()

        if (!isCancelled) {
          setCoins(data)
          setSelectedCoinId((previous) => {
            if (previous && data.some((coin) => coin.id === previous)) {
              return previous
            }

            return data[0]?.id ?? previous ?? "bitcoin"
          })
        }
      } catch (error) {
        if (!isCancelled && !(error instanceof DOMException && error.name === "AbortError")) {
          setCoins([])
          setCoinListError(
            "We couldn't load market data right now. Please try again shortly."
          )
        }
      } finally {
        if (!isCancelled) {
          setCoinListLoading(false)
        }
      }
    }

    fetchCoins()

    return () => {
      isCancelled = true
      controller.abort()
    }
  }, [coinReloadKey])

  useEffect(() => {
    if (!selectedCoinId) {
      setPrice(0)
      return
    }

    let isCancelled = false
    const controller = new AbortController()

    async function fetchPrice() {
      if (!isCancelled) {
        setConversionLoading(true)
        setConversionError(null)
        setLastUpdated(null)
      }

      try {
        if (activeCurrency.code === "usd" && selectedCoin) {
          if (!isCancelled) {
            setPrice(selectedCoin.current_price)
            setLastUpdated(new Date())
          }

          return
        }

        const parameters = new URLSearchParams({
          ids: selectedCoinId,
          vs_currencies: activeCurrency.code,
          include_last_updated_at: "true",
        })

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?${parameters.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch conversion rate")
        }

        const payload = (await response.json()) as Record<
          string,
          {
            [currencyCode: string]: number
            // last_updated_at?: number
          }
        >

        const coinData = payload[selectedCoinId]
        const rate = coinData?.[activeCurrency.code]

        if (typeof rate !== "number") {
          throw new Error("Missing rate data")
        }

        if (!isCancelled) {
          setPrice(rate)
          setLastUpdated(
            coinData?.last_updated_at
              ? new Date(coinData.last_updated_at * 1000)
              : new Date()
          )
        }
      } catch (error) {
        if (!isCancelled && !(error instanceof DOMException && error.name === "AbortError")) {
          setConversionError(
            "We couldn't fetch the latest rate. Please try again."
          )
          setPrice(0)
          setLastUpdated(null)
        }
      } finally {
        if (!isCancelled) {
          setConversionLoading(false)
        }
      }
    }

    fetchPrice()

    return () => {
      isCancelled = true
      controller.abort()
    }
  }, [selectedCoinId, activeCurrency, refreshToken, selectedCoin])

  useEffect(() => {
    if (!coins.length) {
      return
    }

    if (!coins.some((coin) => coin.id === selectedCoinId)) {
      setSelectedCoinId(coins[0].id)
    }
  }, [coins, selectedCoinId])

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value

    if (nextValue === "" || /^\d*(\.\d*)?$/.test(nextValue)) {
      setAmountInput(nextValue)
    }
  }

  const adjustAmount = (direction: "up" | "down") => {
    const current = parseFloat(amountInput || "0") || 0
    const step = current >= 1 ? 1 : 0.1
    const delta = direction === "up" ? step : -step
    const next = Math.max(0, Number((current + delta).toFixed(6)))

    setAmountInput(next.toString())
  }

  const triggerCoinReload = () => setCoinReloadKey((value) => value + 1)
  const triggerRefreshRates = () => setRefreshToken((value) => value + 1)

  const showCoinSkeleton = coinListLoading && coins.length === 0

  const summaryCardOpacity = conversionLoading ? "opacity-60" : ""

  return (
    <div >
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">Calculator</h1>
        <p className="text-muted-foreground">
          Convert cryptocurrency to your preferred fiat currency with live rates
          from CoinGecko
        </p>
      </div> */}

      <Card className="mx-auto max-w-lg">
        <CardHeader className="border-b">
          <CardTitle>Crypto Converter</CardTitle>
          <CardDescription>
            Enter an amount, pick a coin, and see the latest value instantly.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={triggerRefreshRates}
              disabled={conversionLoading || (!selectedCoinId && !coins.length)}
            >
              {conversionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Refresh rate
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6">
          {coinListError ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4" />
                <span>{coinListError}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={triggerCoinReload}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          ) : null}

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Amount
            </label>
            <div className="flex items-center gap-2">
              <Button
                className="justify-center items-center"
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustAmount("down")}
                disabled={amount <= 0 || conversionLoading}
                aria-label="Decrease amount"
              >
                <Minus className="size-4" />
              </Button>
              <Input
                inputMode="decimal"
                type="text"
                value={amountInput}
                onChange={handleAmountChange}
                className="h-12 text-lg"
                placeholder="0.00"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustAmount("up")}
                disabled={conversionLoading}
                aria-label="Increase amount"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2" id="here">
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                Select coin
              </label>
              {showCoinSkeleton ? (
                <Skeleton className="h-12 w-full rounded-md py-2" />
              ) : (
                <Select
                  value={
                    coins.some((coin) => coin.id === selectedCoinId)
                      ? selectedCoinId
                      : undefined
                  }
                  onValueChange={setSelectedCoinId}
                  disabled={coinListLoading && coins.length === 0}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Choose a coin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {coins.map((coin) => (
                      <div className="justify-between">
                        <SelectItem key={coin.id} value={coin.id}>
                          <span className="flex w-full items-center">
                            <span className="flex min-w-0 items-center gap-3">
                              <Image
                                src={coin.image}
                                alt={`${coin.name} logo`}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                              <span className="flex min-w-0 flex-col leading-tight">
                                <span className="truncate font-medium">
                                  {coin.name}
                                </span>
                              </span>
                            </span>
                          </span>
                        </SelectItem>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                Select currency
              </label>
              <Select
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              >
                <SelectTrigger className="h-12 w-full justify-between">
                  <SelectValue placeholder="Choose a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <span className="flex w-full items-center justify-between gap-2">
                        <span className="font-medium">{currency.label}</span>
                        <span className="text-xs uppercase text-muted-foreground">
                          {currency.code}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {conversionLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Fetching the latest rate…</span>
              </div>
            ) : null}

            {conversionError ? (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  <span>{conversionError}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={triggerRefreshRates}
                  className="ml-auto"
                >
                  Try again
                </Button>
              </div>
            ) : null}

            <div
              className={`rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-5 transition-opacity ${summaryCardOpacity}`}
            >
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-200/90">
                {amountLabel} {coinSymbol} =
              </p>
              <p className="text-3xl font-semibold tracking-tight">
                {formattedConvertedValue}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  1 {coinSymbol} = {formattedRate}
                </span>
                <span className="text-muted-foreground/40">•</span>
                {formattedLastUpdated ? (
                  <span>Last updated at {formattedLastUpdated} UTC</span>
                ) : (
                  <span>Live pricing via CoinGecko</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Rates are fetched directly from the public CoinGecko API and may be
            subject to rate limits.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}