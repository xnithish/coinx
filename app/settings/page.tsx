"use client"

import { ThemeCard } from "@/components/settings/ThemeCard"
import { CurrencyCard } from "@/components/settings/CurrencyCard"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeCard />
          <CurrencyCard />
        </div>
      </div>
    </div>
  )
}