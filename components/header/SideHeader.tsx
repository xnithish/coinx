"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { LayoutHeader } from "@/components/header/LayoutHeader"
import { CurrencyProvider } from "@/contexts/currency-context"
import {
  Home,
  TrendingUp,
  Newspaper,
  Calculator,
  Settings,
  Sun,
  Moon,
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Markets",
    url: "/markets",
    icon: TrendingUp,
  },
  {
    title: "News",
    url: "/news",
    icon: Newspaper,
  },
  {
    title: "Calculator",
    url: "/calculator",
    icon: Calculator,
  },
]

function AppSidebarContent() {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const sidebar = useSidebar()

  React.useEffect(() => {
    // Check for dark mode preference
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark)

    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked)
    if (checked) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleNavigationClick = () => {
    // Close sidebar on mobile/tablet when clicking navigation links
    if (window.innerWidth < 768) {
      sidebar.setOpen(false)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Image src="/logo.svg" alt="Coinx Logo" width={24} height={24} />
          <h1 className="text-lg font-bold group-data-[collapsible=icon]:hidden">Coinx</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={handleNavigationClick}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={handleNavigationClick}
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Mobile Theme Switch */}
          <SidebarMenuItem className="md:hidden">
            <div className="flex items-center justify-between w-full px-2 py-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span className="text-sm">Theme</span>
                <Moon className="h-4 w-4" />
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebarContent />
          <SidebarInset>
            <div className="p-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
              <LayoutHeader />
            </div>
            <div className="flex-1 p-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </CurrencyProvider>
  )
}